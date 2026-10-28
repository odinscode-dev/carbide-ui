// @vitest-environment jsdom

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { must } from "../test/dom.js";
import { renderPart, renderRoot } from "../test/render.js";
import { Popover } from "./Popover.js";

const ANCHOR = <button type="button">Pump 1</button>;

describe("Popover", () => {
  it("makes the anchor the trigger, without wrapping it in an element", () => {
    const { tag, attrs } = renderRoot(<Popover content="Details">{ANCHOR}</Popover>);
    expect(tag).toBe("button");
    expect(attrs["data-part"]).toBe("trigger");
    expect(attrs["data-state"]).toBe("closed");
    expect(attrs["aria-expanded"]).toBe("false");
  });

  it("keeps the content closed and hidden", () => {
    const { attrs } = renderPart(<Popover content="Details">{ANCHOR}</Popover>, "content");
    expect(attrs["data-state"]).toBe("closed");
    expect(attrs).toHaveProperty("hidden");
  });

  it("shows the content as a dialog with open", () => {
    const element = (
      <Popover content="Details" open>
        {ANCHOR}
      </Popover>
    );
    expect(renderRoot(element).attrs["aria-expanded"]).toBe("true");

    const { attrs, markup } = renderPart(element, "content");
    expect(attrs.role).toBe("dialog");
    expect(attrs["data-state"]).toBe("open");
    expect(attrs).not.toHaveProperty("hidden");
    expect(markup).toContain("Details");
  });

  it("connects trigger and content via aria-controls", () => {
    const element = (
      <Popover content="Details" open>
        {ANCHOR}
      </Popover>
    );
    const controlledId = renderRoot(element).attrs["aria-controls"];
    expect(controlledId).toBeDefined();
    expect(renderPart(element, "content").attrs.id).toBe(controlledId);
  });

  it("renders the arrow when arrow is set and leaves it out when not", () => {
    const withArrow = renderRoot(
      <Popover content="Details" open>
        {ANCHOR}
      </Popover>,
    ).markup;
    expect(withArrow).toContain('data-part="arrow"');
    expect(withArrow).toContain('data-part="arrow-tip"');

    const withoutArrow = renderRoot(
      <Popover arrow={false} content="Details" open>
        {ANCHOR}
      </Popover>,
    ).markup;
    expect(withoutArrow).not.toContain('data-part="arrow"');
  });

  it("accepts any content, including controls", () => {
    const { markup } = renderRoot(
      <Popover content={<button type="button">Stop</button>} open>
        {ANCHOR}
      </Popover>,
    );
    expect(markup).toContain(">Stop</button>");
  });

  it("sets the border color css variable when borderColor is given", () => {
    const { attrs } = renderPart(
      <Popover borderColor="red" content="Details" open>
        {ANCHOR}
      </Popover>,
      "content",
    );
    expect(attrs.style).toContain("--carbide-popover-border-color:red");
  });

  it("sets the background css variable and data-background when background is given", () => {
    const { attrs } = renderPart(
      <Popover background="red" content="Details" open>
        {ANCHOR}
      </Popover>,
      "content",
    );
    expect(attrs.style).toContain("--carbide-popover-background:red");
    expect(attrs).toHaveProperty("data-background");
  });

  it("sets the width css variable and data-width when width is given", () => {
    const { attrs } = renderPart(
      <Popover content="Details" open width="36rem">
        {ANCHOR}
      </Popover>,
      "content",
    );
    expect(attrs.style).toContain("--carbide-popover-width:36rem");
    expect(attrs).toHaveProperty("data-width");
  });

  it("leaves width unset without the prop", () => {
    const { attrs } = renderPart(
      <Popover content="Details" open>
        {ANCHOR}
      </Popover>,
      "content",
    );
    expect(attrs.style ?? "").not.toContain("--carbide-popover-width");
    expect(attrs).not.toHaveProperty("data-width");
  });

  it("leaves the border color css variable unset without borderColor", () => {
    const { attrs } = renderPart(
      <Popover content="Details" open>
        {ANCHOR}
      </Popover>,
      "content",
    );
    expect(attrs.style ?? "").not.toContain("--carbide-popover-border-color");
  });
});

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function content() {
  return document.querySelector('[data-part="content"]');
}

describe("Popover, opening and closing", () => {
  afterEach(cleanup);

  it("the trigger opens it", async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Popover content="Details" onOpenChange={onOpenChange}>
        {ANCHOR}
      </Popover>,
    );
    fireEvent.click(must(container.querySelector('[data-part="trigger"]')));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true));
    await waitFor(() => expect(content()?.hasAttribute("hidden")).toBe(false));
  });

  it("Escape closes it", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover content="Details" onOpenChange={onOpenChange} open>
        {ANCHOR}
      </Popover>,
    );
    await Promise.resolve();
    fireEvent.keyDown(must(content()), { key: "Escape" });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false));
  });

  it("a click outside closes it", async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <div>
        <Popover content="Details" onOpenChange={onOpenChange} open>
          {ANCHOR}
        </Popover>
        <button type="button">Elsewhere</button>
      </div>,
    );
    const outside = must(container.querySelector("button:not([data-part])"));
    await nextFrame();
    await nextTick();
    fireEvent.pointerDown(outside);
    fireEvent.pointerUp(outside);
    fireEvent.click(outside);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false));
  });

  it("a click inside the content does not close it", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover content={<button type="button">Stop</button>} onOpenChange={onOpenChange} open>
        {ANCHOR}
      </Popover>,
    );
    await nextFrame();
    await nextTick();
    const inside = must(content()?.querySelector("button"));
    fireEvent.pointerDown(inside);
    fireEvent.pointerUp(inside);
    fireEvent.click(inside);
    await nextTick();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
