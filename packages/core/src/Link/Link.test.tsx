// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Link } from "./Link.js";

describe("Link", () => {
  it("renders an anchor with href and text", () => {
    const { tag, attrs, markup } = renderRoot(<Link href="/docs">Documentation</Link>);
    expect(tag).toBe("a");
    expect(attrs.href).toBe("/docs");
    expect(markup).toContain("Documentation");
  });

  it("is standalone without data-inline, and inline with it", () => {
    expect(renderRoot(<Link href="/">x</Link>).attrs).not.toHaveProperty("data-inline");
    expect(
      renderRoot(
        <Link href="/" inline>
          x
        </Link>,
      ).attrs["data-inline"],
    ).toBe("");
  });

  it("locked: no href, aria-disabled and data-disabled on the root element", () => {
    const { attrs } = renderRoot(
      <Link href="/docs" disabled>
        x
      </Link>,
    );
    expect(attrs).not.toHaveProperty("href");
    expect(attrs["aria-disabled"]).toBe("true");
    expect(attrs["data-disabled"]).toBe("");
  });

  it("shows the icon hidden from assistive tech behind the text", () => {
    const { markup } = renderRoot(
      <Link href="/" icon={<svg data-testid="icon" />}>
        Go
      </Link>,
    );
    expect(markup).toMatch(
      /Go<span aria-hidden="true"[^>]*><svg data-testid="icon"><\/svg><\/span>/,
    );
  });

  it("passes native anchor attributes through", () => {
    const { attrs } = renderRoot(
      <Link href="https://forge" target="_blank" rel="noreferrer" id="l1">
        x
      </Link>,
    );
    expect(attrs.target).toBe("_blank");
    expect(attrs.rel).toBe("noreferrer");
    expect(attrs.id).toBe("l1");
  });

  it("keeps a className from outside next to its own class", () => {
    const { attrs } = renderRoot(
      <Link href="/" className="external">
        x
      </Link>,
    );
    expect(attrs.class).toContain("external");
    expect(attrs.class?.split(" ").length).toBeGreaterThan(1);
  });
});

describe("Link, click", () => {
  afterEach(cleanup);

  it("calls onClick on click", () => {
    const onClick = vi.fn();
    render(
      <Link href="/a" onClick={onClick}>
        x
      </Link>,
    );
    fireEvent.click(screen.getByText("x"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  // Documents the current behaviour (Ticket #71): `disabled` only drops the
  // href and marks the element, it does not guard a passed-through onClick --
  // unlike Button and Tile. A link without a target can still legitimately
  // report the click (tracking, explanation why it is locked). If this turns
  // out to be wrong, it is a separate ticket, not a silent change here.
  it("disabled: still calls a passed-through onClick", () => {
    const onClick = vi.fn();
    render(
      <Link disabled href="/a" onClick={onClick}>
        x
      </Link>,
    );
    fireEvent.click(screen.getByText("x"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
