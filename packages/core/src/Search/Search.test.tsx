import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Search } from "./Search.js";

function field(markup: string): string {
  const match = /<input[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in the markup: ${markup}`);
  }
  return match[0];
}

describe("Search", () => {
  it("renders a search field with a magnifier and a name from the catalog", () => {
    const { tag, attrs, markup } = renderRoot(<Search />);
    expect(tag).toBe("div");
    expect(attrs.role).toBe("group");
    expect(field(markup)).toContain('type="search"');
    expect(field(markup)).toContain('aria-label="Search"');
    expect(field(markup)).toContain('placeholder="Search"');
    expect(markup).toContain("<svg");
  });

  it("lets name and placeholder be overridden", () => {
    const { markup } = renderRoot(<Search aria-label="Filter" placeholder="Filter assets" />);
    expect(field(markup)).toContain('aria-label="Filter"');
    expect(field(markup)).toContain('placeholder="Filter assets"');
  });

  it("shows the clear button only with a value and sets data-filled on the root element", () => {
    const empty = renderRoot(<Search value="" />);
    expect(empty.attrs).not.toHaveProperty("data-filled");
    expect(empty.markup).not.toContain("<button");

    const filled = renderRoot(<Search value="pump" />);
    expect(filled.attrs["data-filled"]).toBe("");
    expect(filled.markup).toMatch(/<button[^>]*aria-label="Clear search"/);
  });

  it("lets the clear button's name be overridden", () => {
    expect(renderRoot(<Search clearLabel="Reset" value="pump" />).markup).toMatch(
      /<button[^>]*aria-label="Reset"/,
    );
  });

  it("passes value and native attributes through to the field", () => {
    const { markup } = renderRoot(<Search id="filter" name="q" value="pump" />);
    const input = field(markup);
    expect(input).toContain('value="pump"');
    expect(input).toContain('name="q"');
    expect(input).toContain('id="filter"');
  });

  it("writes disabled as a data attribute on the root element and locks the field and the clear button", () => {
    const { attrs, markup } = renderRoot(<Search disabled value="pump" />);
    expect(attrs["data-disabled"]).toBe("");
    expect(field(markup)).toContain("disabled");
    expect(markup).toMatch(/<button[^>]*disabled/);
  });
});
