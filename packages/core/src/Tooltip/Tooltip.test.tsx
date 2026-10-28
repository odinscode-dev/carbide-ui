// @vitest-environment jsdom

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { must } from "../test/dom.js";
import { renderPart, renderRoot } from "../test/render.js";
import { Tooltip } from "./Tooltip.js";

const ANCHOR = <button type="button">Pump 1</button>;

describe("Tooltip", () => {
  it("makes the anchor the trigger, without wrapping it in an element", () => {
    const { tag, attrs } = renderRoot(<Tooltip content="Feed pump">{ANCHOR}</Tooltip>);
    expect(tag).toBe("button");
    expect(attrs["data-part"]).toBe("trigger");
    expect(attrs["data-state"]).toBe("closed");
  });

  it("keeps the content closed and hidden", () => {
    const { attrs } = renderPart(<Tooltip content="Feed pump">{ANCHOR}</Tooltip>, "content");
    expect(attrs["data-state"]).toBe("closed");
    expect(attrs).toHaveProperty("hidden");
  });

  it("shows the content as role tooltip with defaultOpen", () => {
    const element = (
      <Tooltip content="Feed pump" defaultOpen>
        {ANCHOR}
      </Tooltip>
    );
    expect(renderRoot(element).attrs["data-state"]).toBe("open");

    const { attrs, markup } = renderPart(element, "content");
    expect(attrs.role).toBe("tooltip");
    expect(attrs["data-state"]).toBe("open");
    expect(attrs).not.toHaveProperty("hidden");
    expect(markup).toContain("Feed pump");
  });

  it("connects trigger and content via aria-describedby", () => {
    const element = (
      <Tooltip content="Feed pump" defaultOpen>
        {ANCHOR}
      </Tooltip>
    );
    const described = renderRoot(element).attrs["aria-describedby"];
    expect(described).toBeDefined();
    expect(renderPart(element, "content").attrs.id).toBe(described);
  });

  it("renders the arrow toward the anchor", () => {
    const { markup } = renderRoot(
      <Tooltip content="Feed pump" defaultOpen>
        {ANCHOR}
      </Tooltip>,
    );
    expect(markup).toContain('data-part="arrow"');
    expect(markup).toContain('data-part="arrow-tip"');
  });

  it("accepts any content, not just text", () => {
    const { markup } = renderRoot(
      <Tooltip content={<strong>3.2 bar</strong>} defaultOpen>
        {ANCHOR}
      </Tooltip>,
    );
    expect(markup).toContain("<strong>3.2 bar</strong>");
  });
});

function tooltip() {
  return document.querySelector('[data-part="content"]');
}

function isOpen() {
  return tooltip()?.getAttribute("data-state") === "open";
}

describe("Tooltip, showing and hiding", () => {
  afterEach(cleanup);

  it("opens on hover, but only after the delay", async () => {
    const { container } = render(<Tooltip content="Feed pump">{ANCHOR}</Tooltip>);
    const anchor = must(container.querySelector('[data-part="trigger"]'));

    const start = performance.now();
    fireEvent.pointerOver(anchor, { pointerType: "mouse" });
    fireEvent.pointerMove(anchor, { pointerType: "mouse" });
    expect(isOpen()).toBe(false);

    await waitFor(() => expect(isOpen()).toBe(true));

    expect(performance.now() - start).toBeGreaterThan(90);
  });

  it("closes on Escape", async () => {
    render(
      <Tooltip content="Feed pump" defaultOpen>
        {ANCHOR}
      </Tooltip>,
    );
    expect(isOpen()).toBe(true);

    await Promise.resolve();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(isOpen()).toBe(false));
  });

  it("closes when the pointer leaves the anchor", async () => {
    const { container } = render(
      <Tooltip content="Feed pump" defaultOpen>
        {ANCHOR}
      </Tooltip>,
    );
    expect(isOpen()).toBe(true);
    fireEvent.pointerLeave(must(container.querySelector('[data-part="trigger"]')));
    await waitFor(() => expect(isOpen()).toBe(false));
  });

  it("connects the anchor to the content only while it is open", async () => {
    const { container } = render(<Tooltip content="Feed pump">{ANCHOR}</Tooltip>);
    const anchor = must(container.querySelector('[data-part="trigger"]'));
    expect(anchor.hasAttribute("aria-describedby")).toBe(false);

    fireEvent.pointerOver(anchor, { pointerType: "mouse" });
    fireEvent.pointerMove(anchor, { pointerType: "mouse" });
    await waitFor(() => expect(anchor.getAttribute("aria-describedby")).toBe(tooltip()?.id));
  });
});
