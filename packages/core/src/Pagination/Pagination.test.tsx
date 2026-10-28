import { describe, expect, it } from "vitest";
import { formatNumber } from "../format/number.js";
import { renderRoot } from "../test/render.js";
import { Pagination } from "./Pagination.js";

function button(markup: string, part: string): string {
  const match = new RegExp(`<button[^>]*data-part="${part}"[^>]*>`).exec(markup);
  if (match === null) {
    throw new Error(`No button '${part}' in markup: ${markup}`);
  }
  return match[0];
}

function range(start: number, end: number, total: number): string {
  return `${formatNumber(start)}–${formatNumber(end)} of ${formatNumber(total)}`;
}

describe("Pagination", () => {
  it("renders a navigation with a select, range and page numbers", () => {
    const { tag, attrs, markup } = renderRoot(<Pagination page={1} pageSize={25} total={1250} />);
    expect(tag).toBe("nav");
    expect(attrs["aria-label"]).toBe("Pagination");
    expect(markup).toContain("Items per page");
    expect(markup).toContain('data-part="prev-trigger"');
    expect(markup).toContain('data-part="next-trigger"');
    expect(button(markup, "item")).toContain('data-index="1"');
  });

  it("shows the range from Ark's pageRange, passed through formatNumber", () => {
    expect(renderRoot(<Pagination page={1} pageSize={25} total={1250} />).markup).toContain(
      range(1, 25, 1250),
    );
    expect(renderRoot(<Pagination page={3} pageSize={25} total={1250} />).markup).toContain(
      range(51, 75, 1250),
    );

    expect(renderRoot(<Pagination page={50} pageSize={25} total={1240} />).markup).toContain(
      range(1226, 1240, 1240),
    );
  });

  it("marks the current page and locks Previous on the first page", () => {
    const { markup } = renderRoot(<Pagination page={1} pageSize={25} total={1250} />);
    expect(markup).toMatch(/data-part="item"[^>]*data-index="1"[^>]*data-selected/);
    expect(markup).toMatch(/data-part="item"[^>]*data-index="1"[^>]*aria-current="page"/);
    expect(button(markup, "prev-trigger")).toContain("disabled");
    expect(button(markup, "next-trigger")).not.toContain("disabled");
  });

  it("locks Next on the last page", () => {
    const { markup } = renderRoot(<Pagination page={50} pageSize={25} total={1250} />);
    expect(button(markup, "next-trigger")).toContain("disabled");
    expect(button(markup, "prev-trigger")).not.toContain("disabled");
  });

  it("puts ellipses between the page numbers", () => {
    const { markup } = renderRoot(<Pagination page={25} pageSize={25} total={1250} />);
    expect(markup.match(/data-part="ellipsis"/g)).toHaveLength(2);
    expect(markup).toMatch(/data-part="item"[^>]*data-index="25"[^>]*data-selected/);
  });

  it("takes the page sizes as a select, with the current one as the value", () => {
    const { markup } = renderRoot(
      <Pagination page={1} pageSize={50} pageSizes={[50, 500]} total={1250} />,
    );
    expect(markup.match(/data-part="item"[^>]*data-value="/g)).toHaveLength(2);
    expect(markup).toContain('data-value="500"');
    expect(markup).toMatch(new RegExp(`data-part="value-text"[^>]*>${formatNumber(50)}<`));
  });

  it("writes disabled on the root element and locks every button", () => {
    const { attrs, markup } = renderRoot(
      <Pagination disabled page={25} pageSize={25} total={1250} />,
    );
    expect(attrs["data-disabled"]).toBe("");
    expect(button(markup, "prev-trigger")).toContain("disabled");
    expect(button(markup, "next-trigger")).toContain("disabled");
    expect(button(markup, "item")).toContain("disabled");

    expect(button(markup, "trigger")).toContain("disabled");

    const open = renderRoot(<Pagination page={25} pageSize={25} total={1250} />);
    expect(open.attrs).not.toHaveProperty("data-disabled");
    expect(button(open.markup, "item")).not.toContain("disabled");
    expect(button(open.markup, "trigger")).not.toContain("disabled");
  });

  it("lets the select's label and the range be overridden", () => {
    const { markup } = renderRoot(
      <Pagination
        page={1}
        pageSize={25}
        pageSizeLabel="Rows per page"
        rangeText={({ start, end, total }) => `${start} to ${end} of ${total}`}
        total={1250}
      />,
    );
    expect(markup).toContain("Rows per page");
    expect(markup).toContain("1 to 25 of 1250");
    expect(markup).not.toContain("Items per page");
  });

  it("names Next, Previous and the page numbers from the catalog", () => {
    const { markup } = renderRoot(<Pagination page={1} pageSize={25} total={1250} />);
    expect(button(markup, "prev-trigger")).toContain('aria-label="Previous page"');
    expect(button(markup, "next-trigger")).toContain('aria-label="Next page"');
    expect(button(markup, "item")).toContain('aria-label="Page 1"');
  });
});
