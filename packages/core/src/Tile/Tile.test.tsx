// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Tile } from "./Tile.js";

describe("Tile", () => {
  it("is static a div with content and no state attributes", () => {
    const { tag, attrs, markup } = renderRoot(<Tile>Content</Tile>);
    expect(tag).toBe("div");
    expect(markup).toContain("Content");
    expect(attrs).not.toHaveProperty("data-clickable");
    expect(attrs).not.toHaveProperty("data-selectable");
    expect(attrs).not.toHaveProperty("data-selected");
    expect(attrs).not.toHaveProperty("data-disabled");
  });

  it("is clickable a button of type button with data-clickable", () => {
    const { tag, attrs } = renderRoot(<Tile clickable>x</Tile>);
    expect(tag).toBe("button");
    expect(attrs.type).toBe("button");
    expect(attrs["data-clickable"]).toBe("");
    expect(attrs).not.toHaveProperty("aria-pressed");
  });

  it("is with onSelect a toggle button with aria-pressed and data-selectable", () => {
    const unselected = renderRoot(<Tile onSelect={() => undefined}>x</Tile>);
    expect(unselected.tag).toBe("button");
    expect(unselected.attrs["data-selectable"]).toBe("");
    expect(unselected.attrs["aria-pressed"]).toBe("false");
    expect(unselected.attrs).not.toHaveProperty("data-selected");

    const selected = renderRoot(
      <Tile onSelect={() => undefined} selected>
        x
      </Tile>,
    );
    expect(selected.attrs["aria-pressed"]).toBe("true");
    expect(selected.attrs["data-selected"]).toBe("");
  });

  it("locked: data-disabled on the root element, plus disabled on the button and aria-disabled on the div", () => {
    const toggle = renderRoot(
      <Tile clickable disabled>
        x
      </Tile>,
    );
    expect(toggle.attrs["data-disabled"]).toBe("");
    expect(toggle.attrs).toHaveProperty("disabled");

    const surface = renderRoot(<Tile disabled>x</Tile>);
    expect(surface.attrs["data-disabled"]).toBe("");
    expect(surface.attrs["aria-disabled"]).toBe("true");
  });

  it("raised and accent: data attributes and the accent as a custom property", () => {
    const plain = renderRoot(<Tile>x</Tile>);
    expect(plain.attrs).not.toHaveProperty("data-elevation");
    expect(plain.attrs).not.toHaveProperty("data-accent");

    const raised = renderRoot(
      <Tile accent="red" elevation="raised" style={{ width: "10px" }}>
        x
      </Tile>,
    );
    expect(raised.attrs["data-elevation"]).toBe("raised");
    expect(raised.attrs["data-accent"]).toBe("");
    expect(raised.attrs.style).toContain("--carbide-tile-accent:red");
    expect(raised.attrs.style).toContain("width:10px");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Tile id="t1">x</Tile>).attrs.id).toBe("t1");
    expect(
      renderRoot(
        <Tile clickable id="t2">
          x
        </Tile>,
      ).attrs.id,
    ).toBe("t2");
  });
});

describe("Tile, click", () => {
  afterEach(cleanup);

  it("clickable: calls onClick on click", () => {
    const onClick = vi.fn();
    render(
      <Tile clickable onClick={onClick}>
        x
      </Tile>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("selectable: onSelect receives the inverted selected state", () => {
    const onSelect = vi.fn();
    const { rerender } = render(<Tile onSelect={onSelect}>x</Tile>);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenLastCalledWith(true);

    rerender(
      <Tile onSelect={onSelect} selected>
        x
      </Tile>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenLastCalledWith(false);
  });

  it("selectable: onClick and onSelect both fire on one click", () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <Tile onClick={onClick} onSelect={onSelect}>
        x
      </Tile>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("disabled: neither onClick nor onSelect fires", () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <Tile clickable disabled onClick={onClick} onSelect={onSelect}>
        x
      </Tile>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("variant: glass adds the pane next to the tile's own class", () => {
    const { container } = render(<Tile variant="glass">x</Tile>);
    const tile = container.firstElementChild;
    expect(tile?.getAttribute("data-variant")).toBe("glass");
    expect(tile?.className.split(" ").length).toBe(2);
  });

  it("keeps a caller's className next to its own class, with or without glass", () => {
    const plain = render(<Tile className="mine">x</Tile>).container.firstElementChild;
    expect(plain?.classList.contains("mine")).toBe(true);
    expect(plain?.className.split(" ").length).toBe(2);
    cleanup();
    const glass = render(
      <Tile className="mine" variant="glass">
        x
      </Tile>,
    ).container.firstElementChild;
    expect(glass?.classList.contains("mine")).toBe(true);
    expect(glass?.className.split(" ").length).toBe(3);
  });

  it("keeps a caller's className on a clickable tile", () => {
    render(
      <Tile className="mine" clickable>
        x
      </Tile>,
    );
    expect(screen.getByRole("button").classList.contains("mine")).toBe(true);
  });

  it("variant: the default leaves the attribute off", () => {
    const { container } = render(<Tile>x</Tile>);
    const tile = container.firstElementChild;
    expect(tile?.hasAttribute("data-variant")).toBe(false);
    expect(tile?.className.split(" ").length).toBe(1);
  });
});
