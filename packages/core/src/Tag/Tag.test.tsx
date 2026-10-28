// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Tag } from "./Tag.js";

describe("Tag", () => {
  it("renders a span with the text and data-state neutral by default", () => {
    const { tag, attrs, markup } = renderRoot(<Tag>Pump 3</Tag>);
    expect(tag).toBe("span");
    expect(attrs["data-state"]).toBe("neutral");
    expect(markup).toContain("Pump 3");
  });

  it("writes the state as data-state on the root element", () => {
    expect(renderRoot(<Tag state="error">x</Tag>).attrs["data-state"]).toBe("error");
    expect(renderRoot(<Tag state="accent">x</Tag>).attrs["data-state"]).toBe("accent");
  });

  it("has no button and no data-removable without onRemove", () => {
    const { attrs, markup } = renderRoot(<Tag>x</Tag>);
    expect(attrs).not.toHaveProperty("data-removable");
    expect(markup).not.toContain("<button");
  });

  it("shows a close button with text from the catalog when onRemove is given", () => {
    const { attrs, markup } = renderRoot(<Tag onRemove={() => undefined}>x</Tag>);
    expect(attrs["data-removable"]).toBe("");
    expect(markup).toMatch(/<button aria-label="Remove"[^>]*type="button"/);
  });

  it("lets the button's text be overridden", () => {
    const { markup } = renderRoot(
      <Tag onRemove={() => undefined} removeLabel="Remove filter">
        x
      </Tag>,
    );
    expect(markup).toContain('aria-label="Remove filter"');
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Tag id="t1">x</Tag>).attrs.id).toBe("t1");
  });
});

describe("Tag, click", () => {
  afterEach(cleanup);

  it("calls onRemove when the remove button is clicked", () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>x</Tag>);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("uses removeLabel as the accessible name of the remove button", () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Entfernen">
        x
      </Tag>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Entfernen" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
