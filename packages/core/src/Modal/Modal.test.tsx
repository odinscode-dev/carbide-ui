// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import type { RefObject } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { renderPart } from "../test/render.js";
import { Modal } from "./Modal.js";

function surface(element: Parameters<typeof renderPart>[0]) {
  return renderPart(element, "content");
}

describe("Modal", () => {
  it("renders backdrop, positioner and the surface as role dialog", () => {
    const { tag, attrs, markup } = surface(
      <Modal open title="Acknowledge alarm">
        Pump 1 has been running dry.
      </Modal>,
    );
    expect(tag).toBe("div");
    expect(attrs.role).toBe("dialog");
    expect(attrs["aria-modal"]).toBe("true");
    expect(markup).toMatch(
      /data-part="backdrop"[\s\S]*data-part="positioner"[\s\S]*data-part="content"/,
    );
    expect(markup).toContain("Pump 1 has been running dry.");
  });

  it("sets the title as Ark's title and lets it name the dialog", () => {
    const { attrs, markup } = surface(<Modal open title="Acknowledge alarm" />);
    expect(markup).toMatch(/<h2 [^>]*data-part="title"[^>]*>Acknowledge alarm<\/h2>/);
    expect(attrs["aria-labelledby"]).toMatch(/:title$/);
  });

  it("takes md as the default and carries the size as data-size", () => {
    expect(surface(<Modal open title="T" />).attrs["data-size"]).toBe("md");
    expect(surface(<Modal open size="sm" title="T" />).attrs["data-size"]).toBe("sm");
    expect(surface(<Modal open size="lg" title="T" />).attrs["data-size"]).toBe("lg");
  });

  it("renders the footer only with footer and reports it as data-footer", () => {
    const withFooter = surface(<Modal footer={<span>Actions</span>} open title="T" />);
    expect(withFooter.attrs["data-footer"]).toBe("");
    expect(withFooter.markup).toContain("<footer");

    const withoutFooter = surface(<Modal open title="T" />);
    expect(withoutFooter.attrs).not.toHaveProperty("data-footer");
    expect(withoutFooter.markup).not.toContain("<footer");
  });

  it("stands closed as data-state closed and hidden in the markup", () => {
    const { attrs, markup } = surface(<Modal open={false} title="T" />);
    expect(attrs["data-state"]).toBe("closed");
    expect(attrs).toHaveProperty("hidden");
    expect(markup).toMatch(/data-part="backdrop"[^>]*hidden/);
  });

  it("stands open as data-state open without hidden", () => {
    const { attrs } = surface(<Modal open title="T" />);
    expect(attrs["data-state"]).toBe("open");
    expect(attrs).not.toHaveProperty("hidden");
  });

  it("names the close button from the catalog", () => {
    expect(surface(<Modal open title="T" />).markup).toMatch(
      /data-part="close-trigger"[^>]*aria-label="Close"/,
    );
  });

  it("lets the close button's name be overridden", () => {
    expect(surface(<Modal closeText="Dismiss" open title="T" />).markup).toMatch(
      /data-part="close-trigger"[^>]*aria-label="Dismiss"/,
    );
  });

  it("passes native attributes through to the surface", () => {
    const { attrs } = surface(<Modal data-testid="m" id="alarm-modal" open title="T" />);
    expect(attrs.id).toBe("alarm-modal");
    expect(attrs["data-testid"]).toBe("m");
  });

  it("can report itself as an alertdialog", () => {
    const { attrs } = surface(
      <Modal open role="alertdialog" title="T">
        x
      </Modal>,
    );
    expect(attrs.role).toBe("alertdialog");
  });
});

describe("Modal, portal location", () => {
  afterEach(cleanup);

  it("attaches the portal content to document.body without container", () => {
    render(
      <Modal open title="T">
        x
      </Modal>,
    );
    expect(document.body.querySelector('[data-part="content"]')).not.toBeNull();
  });

  it("attaches it inside the given element with container", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const ref: RefObject<HTMLElement | null> = { current: container };

    render(
      <Modal container={ref} open title="T">
        x
      </Modal>,
    );
    expect(container.querySelector('[data-part="content"]')).not.toBeNull();

    expect(Array.from(document.body.children).some((kind) => kind.hasAttribute("data-part"))).toBe(
      false,
    );
  });

  it("variant: glass marks the content element as a pane", () => {
    render(
      <Modal open title="T" variant="glass">
        x
      </Modal>,
    );
    const content = document.querySelector('[data-part="content"]');
    expect(content?.getAttribute("data-variant")).toBe("glass");
  });

  it("keeps a caller's className on the content element, with or without glass", () => {
    render(
      <Modal className="mine" open title="T">
        x
      </Modal>,
    );
    expect(document.querySelector('[data-part="content"]')?.classList.contains("mine")).toBe(true);
    cleanup();
    render(
      <Modal className="mine" open title="T" variant="glass">
        x
      </Modal>,
    );
    const content = document.querySelector('[data-part="content"]');
    expect(content?.classList.contains("mine")).toBe(true);
    expect(content?.getAttribute("data-variant")).toBe("glass");
  });

  it("variant: the default leaves the attribute off", () => {
    render(
      <Modal open title="T">
        x
      </Modal>,
    );
    const content = document.querySelector('[data-part="content"]');
    expect(content?.hasAttribute("data-variant")).toBe(false);
  });
});
