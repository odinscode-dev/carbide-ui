// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement, RefObject } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { must } from "../test/dom.js";
import { Drawer } from "./Drawer.js";

function surface(element: ReactElement): { tag: string; markup: string } {
  const markup = renderToStaticMarkup(element);
  const match = /<div[^>]*data-part="content"[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No surface in the markup: ${markup}`);
  }
  return { tag: match[0], markup };
}

describe("Drawer", () => {
  it("renders backdrop, positioner and the surface as dialog when modal", () => {
    const { tag, markup } = surface(
      <Drawer open title="Menu">
        Pumps
      </Drawer>,
    );
    expect(tag).toContain('role="dialog"');
    expect(tag).toContain('aria-modal="true"');
    expect(tag).toContain("data-modal");
    expect(markup).toMatch(
      /data-part="backdrop"[\s\S]*data-part="positioner"[\s\S]*data-part="content"/,
    );
    expect(markup).toContain("Pumps");
  });

  it("leaves out the backdrop when not modal", () => {
    const { tag, markup } = surface(<Drawer modal={false} open title="Menu" />);
    expect(markup).not.toContain('data-part="backdrop"');
    expect(tag).not.toContain("data-modal");
    expect(tag).toContain('aria-modal="false"');
  });

  it("takes end as the default and carries the edge on positioner and surface", () => {
    const end = surface(<Drawer open title="M" />);
    expect(end.tag).toContain('data-side="end"');
    expect(end.markup).toMatch(/data-part="positioner"[^>]*data-side="end"/);

    const start = surface(<Drawer open side="start" title="M" />);
    expect(start.tag).toContain('data-side="start"');
    expect(start.markup).toMatch(/data-part="positioner"[^>]*data-side="start"/);
  });

  it("takes sm as the default size and carries it as data-size", () => {
    expect(surface(<Drawer open title="M" />).tag).toContain('data-size="sm"');
    expect(surface(<Drawer open size="lg" title="M" />).tag).toContain('data-size="lg"');
  });

  it("sets the title as Ark's title and lets it name the surface", () => {
    const { tag, markup } = surface(<Drawer open title="Menu" />);
    expect(markup).toMatch(/<h2 [^>]*data-part="title"[^>]*>Menu<\/h2>/);
    expect(tag).toMatch(/aria-labelledby="[^"]*:title"/);
  });

  it("renders the footer only with footer and reports it as data-footer", () => {
    const withFooter = surface(<Drawer footer={<span>Actions</span>} open title="M" />);
    expect(withFooter.tag).toContain("data-footer");
    expect(withFooter.markup).toContain("<footer");

    const withoutFooter = surface(<Drawer open title="M" />);
    expect(withoutFooter.tag).not.toContain("data-footer");
    expect(withoutFooter.markup).not.toContain("<footer");
  });

  it("stands closed as data-state closed and hidden, open without hidden", () => {
    const closed = surface(<Drawer open={false} title="M" />);
    expect(closed.tag).toContain('data-state="closed"');
    expect(closed.tag).toContain("hidden");

    const open = surface(<Drawer open title="M" />);
    expect(open.tag).toContain('data-state="open"');
    expect(open.tag).not.toContain("hidden");
  });

  it("names the close button from the catalog and lets it be overridden", () => {
    expect(surface(<Drawer open title="M" />).markup).toMatch(
      /data-part="close-trigger"[^>]*aria-label="Close"/,
    );
    expect(surface(<Drawer closeText="Dismiss" open title="M" />).markup).toMatch(
      /data-part="close-trigger"[^>]*aria-label="Dismiss"/,
    );
  });

  it("passes native attributes through to the surface", () => {
    const { tag } = surface(<Drawer data-testid="d" id="board-menu" open title="M" />);
    expect(tag).toContain('id="board-menu"');
    expect(tag).toContain('data-testid="d"');
  });
});

describe("Drawer, portal location", () => {
  afterEach(cleanup);

  it("attaches to document.body without container", () => {
    render(<Drawer open title="M" />);
    expect(document.body.querySelector('[data-part="content"]')).not.toBeNull();
  });

  it("attaches inside the given element with container", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const ref: RefObject<HTMLElement | null> = { current: container };
    render(<Drawer container={ref} open title="M" />);
    expect(container.querySelector('[data-part="content"]')).not.toBeNull();
  });
});

describe("Drawer, unpadded body", () => {
  afterEach(cleanup);

  it("skips the scroll area and padding, leaving children to manage their own", () => {
    render(
      <Drawer open title="M" unpadded>
        <div data-testid="own-scroll">content</div>
      </Drawer>,
    );
    expect(document.body.querySelector('[data-part="viewport"]')).toBeNull();
    expect(screen.getByTestId("own-scroll")).not.toBeNull();
  });

  it("keeps the scroll area and padding by default", () => {
    render(
      <Drawer open title="M">
        content
      </Drawer>,
    );
    expect(document.body.querySelector('[data-part="viewport"]')).not.toBeNull();
  });
});

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("Drawer, closing on outside interaction", () => {
  afterEach(cleanup);

  it("decouples closeOnInteractOutside from modal: a non-modal drawer can still close on outside click", async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <div>
        <Drawer closeOnInteractOutside modal={false} onOpenChange={onOpenChange} open title="M">
          content
        </Drawer>
        <button type="button">Elsewhere</button>
      </div>,
    );
    const outside = must(container.querySelector("button"));
    await nextFrame();
    await nextTick();

    fireEvent.pointerDown(outside);
    fireEvent.pointerUp(outside);
    fireEvent.click(outside);

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false));
  });

  it("leaves a non-modal drawer open on outside click without the opt-in", async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <div>
        <Drawer modal={false} onOpenChange={onOpenChange} open title="M">
          content
        </Drawer>
        <button type="button">Elsewhere</button>
      </div>,
    );
    const outside = must(container.querySelector("button"));
    await nextFrame();
    await nextTick();

    fireEvent.pointerDown(outside);
    fireEvent.pointerUp(outside);
    fireEvent.click(outside);

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
