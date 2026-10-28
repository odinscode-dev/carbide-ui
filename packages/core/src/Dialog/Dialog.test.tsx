// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { RefObject } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { must } from "../test/dom.js";
import { renderPart } from "../test/render.js";
import { Dialog, type DialogRole } from "./Dialog.js";

function surface(element: Parameters<typeof renderPart>[0]) {
  return renderPart(element, "content");
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const ROLES: DialogRole[] = ["confirm", "warning", "critical", "error", "info"];

describe("Dialog", () => {
  it("renders title, message and two buttons", () => {
    const { markup } = surface(<Dialog message="Pump 1 stops." open title="Stop pump?" />);
    expect(markup).toMatch(/<h2 [^>]*data-part="title"[^>]*>.*Stop pump\?<\/h2>/);
    expect(markup).toMatch(/data-part="description"[^>]*>Pump 1 stops\./);
    expect(markup).toContain(">Cancel</button>");
    expect(markup).toContain(">OK</button>");
  });

  it("makes the message Ark's description", () => {
    const { attrs, markup } = surface(<Dialog message="Pump 1 stops." open title="T" />);
    const description = /data-part="description"[^>]*id="([^"]+)"/.exec(markup)?.[1];
    expect(description).toBeDefined();
    expect(attrs["aria-describedby"]).toBe(description);
  });

  it.each(ROLES)("carries the role %s as data-role on the root element", (role) => {
    expect(surface(<Dialog message="M" open role={role} title="T" />).attrs["data-role"]).toBe(
      role,
    );
  });

  it("takes confirm as the default", () => {
    expect(surface(<Dialog message="M" open title="T" />).attrs["data-role"]).toBe("confirm");
  });

  it.each([
    ["confirm", "dialog"],
    ["info", "dialog"],
    ["warning", "alertdialog"],
    ["critical", "alertdialog"],
    ["error", "alertdialog"],
  ] as const)("reports the role %s to assistive tech as role=%s", (role, ariaRole) => {
    expect(surface(<Dialog message="M" open role={role} title="T" />).attrs.role).toBe(ariaRole);
  });

  it("shows exactly one icon per role before the title, hidden from assistive tech", () => {
    for (const role of ROLES) {
      const { markup } = surface(<Dialog message="M" open role={role} title="Title" />);
      expect(markup).toMatch(/data-part="title"[^>]*><span [^>]*><svg aria-hidden="true"/);
      expect(markup.match(/<svg/g)).toHaveLength(2);
    }
  });

  it("is always small", () => {
    expect(surface(<Dialog message="M" open title="T" />).attrs["data-size"]).toBe("sm");
  });

  it("lets both button texts be overridden", () => {
    const { markup } = surface(
      <Dialog cancelText="Abort" confirmText="Stop" message="M" open title="T" />,
    );
    expect(markup).toContain(">Abort</button>");
    expect(markup).toContain(">Stop</button>");
    expect(markup).not.toContain(">Cancel</button>");
  });

  it("gives the confirm button variant primary without danger", () => {
    const { attrs, markup } = surface(<Dialog message="M" open title="T" />);
    expect(attrs).not.toHaveProperty("data-danger");
    expect(markup).toMatch(/data-variant="primary"[^>]*>OK</);
  });

  it("gives it variant danger with danger and reports the state on the root element", () => {
    const { attrs, markup } = surface(<Dialog danger message="M" open title="T" />);
    expect(attrs["data-danger"]).toBe("");
    expect(markup).toMatch(/data-variant="danger"[^>]*>OK</);
    expect(markup).toMatch(/data-variant="secondary"[^>]*>Cancel</);
  });

  it("passes native attributes through to the surface", () => {
    expect(surface(<Dialog id="stop" message="M" open title="T" />).attrs.id).toBe("stop");
  });
});

describe("Dialog, every way out", () => {
  afterEach(cleanup);

  it("Cancel button: onCancel, onOpenChange(false), never onConfirm", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        message="M"
        onCancel={onCancel}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="T"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("OK button: onConfirm, onOpenChange(false), never onCancel", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        message="M"
        onCancel={onCancel}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="T"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("Close icon: onCancel, onOpenChange(false), never onConfirm", async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        message="M"
        onCancel={onCancel}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="T"
      />,
    );

    const closeIcon = document.body.querySelector('[data-part="close-trigger"]');
    expect(closeIcon).not.toBeNull();
    fireEvent.click(must(closeIcon));
    await waitFor(() => expect(onCancel).toHaveBeenCalledOnce());
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Escape: onCancel, onOpenChange(false), never onConfirm", async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        message="M"
        onCancel={onCancel}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="T"
      />,
    );
    const content = document.body.querySelector('[data-part="content"]');
    expect(content).not.toBeNull();

    await Promise.resolve();
    fireEvent.keyDown(must(content), { key: "Escape" });
    await waitFor(() => expect(onCancel).toHaveBeenCalledOnce());
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("click on the backdrop: onCancel, onOpenChange(false), never onConfirm", async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        message="M"
        onCancel={onCancel}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open
        title="T"
      />,
    );
    const backdrop = document.body.querySelector('[data-part="backdrop"]');
    expect(backdrop).not.toBeNull();

    await nextFrame();
    await nextTick();

    fireEvent.pointerDown(must(backdrop), { button: 0, isPrimary: true, pointerId: 1 });
    fireEvent.pointerUp(must(backdrop), { button: 0, isPrimary: true, pointerId: 1 });
    fireEvent.click(must(backdrop));
    await nextFrame();
    await nextFrame();
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("passes container unchanged to Modal", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const ref: RefObject<HTMLElement | null> = { current: container };
    render(<Dialog container={ref} message="M" open title="T" />);
    expect(container.querySelector('[data-part="content"]')).not.toBeNull();
  });
});
