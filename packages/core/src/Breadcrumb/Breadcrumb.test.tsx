import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Breadcrumb } from "./Breadcrumb.js";

const PATH = [
  { label: "Plants", href: "/plants" },
  { label: "Plant North", href: "/plants/nord" },
  { label: "Line 4", href: "/plants/nord/line-4" },
  { label: "Motor M-12" },
];

const DEEP = [
  ...PATH.slice(0, 3),
  { label: "Station 7", href: "/s7" },
  { label: "Pump P-3", href: "/p3" },
  { label: "Motor M-12" },
];

function anchors(markup: string): string[] {
  return [...markup.matchAll(/<a\b[^>]*>([^<]*)</g)].map((match) => match[1] ?? "");
}

describe("Breadcrumb", () => {
  it("renders a bar of anchors, the last entry as the current page", () => {
    const { tag, attrs, markup } = renderRoot(<Breadcrumb items={PATH} />);
    expect(tag).toBe("nav");
    expect(attrs["aria-label"]).toBe("Breadcrumb");
    expect(markup.match(/<li\b/g)).toHaveLength(4);
    expect(anchors(markup)).toEqual(["Plants", "Plant North", "Line 4"]);
    expect(markup).toMatch(/<span[^>]*aria-current="page"[^>]*data-current[^>]*>Motor M-12</);
  });

  it("passes href through and leaves the separator to CSS", () => {
    const { markup } = renderRoot(<Breadcrumb items={PATH} />);
    expect(markup).toContain('href="/plants/nord"');
    expect(markup).not.toContain("/<");
  });

  it("shows an entry without href as text, even mid-path", () => {
    const { markup } = renderRoot(
      <Breadcrumb
        items={[
          { label: "Plants", href: "/plants" },
          { label: "Plant North" },
          { label: "Motor M-12" },
        ]}
      />,
    );
    expect(anchors(markup)).toEqual(["Plants"]);
    expect(markup).toContain(">Plant North<");
  });

  it("stays side by side without a menu for up to four entries", () => {
    const { attrs, markup } = renderRoot(<Breadcrumb items={PATH} />);
    expect(attrs).not.toHaveProperty("data-collapsed");
    expect(markup).not.toContain('data-part="trigger"');
  });

  it("collapses the middle into a menu from five entries on and reports it on the root element", () => {
    const { attrs, markup } = renderRoot(<Breadcrumb items={DEEP} />);
    expect(attrs["data-collapsed"]).toBe("");

    expect(markup.match(/<li\b/g)).toHaveLength(4);
    expect(markup).toContain('data-part="trigger"');
    expect(markup.match(/data-part="item"/g)).toHaveLength(3);
    expect(anchors(markup)).toEqual(["Plants", "Plant North", "Line 4", "Station 7", "Pump P-3"]);
  });

  it("lets the names of the bar and the button be overridden", () => {
    const { attrs, markup } = renderRoot(
      <Breadcrumb items={DEEP} label="Path" moreLabel="Show more" />,
    );
    expect(attrs["aria-label"]).toBe("Path");
    expect(markup).toContain('aria-label="Show more"');
    expect(renderRoot(<Breadcrumb items={DEEP} />).markup).toContain("Show more breadcrumbs");
  });

  it("renders an empty list without entries", () => {
    const { tag, markup } = renderRoot(<Breadcrumb items={[]} />);
    expect(tag).toBe("nav");
    expect(markup).not.toContain("<li");
  });
});
