import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { ScrollArea } from "./ScrollArea.js";

describe("ScrollArea", () => {
  it("renders a div with vertical as the default axis", () => {
    const { tag, attrs, markup } = renderRoot(<ScrollArea>Content</ScrollArea>);
    expect(tag).toBe("div");
    expect(attrs["data-axis"]).toBe("vertical");
    expect(markup).toContain("Content");
  });

  it("writes the axis as data-axis on the root element", () => {
    expect(renderRoot(<ScrollArea axis="horizontal">x</ScrollArea>).attrs["data-axis"]).toBe(
      "horizontal",
    );
    expect(renderRoot(<ScrollArea axis="both">x</ScrollArea>).attrs["data-axis"]).toBe("both");
  });

  it("writes data-disabled only when locked", () => {
    expect(renderRoot(<ScrollArea disabled>x</ScrollArea>).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<ScrollArea>x</ScrollArea>).attrs).not.toHaveProperty("data-disabled");
  });

  it("keeps the content as wide as the viewport unless it scrolls horizontally", () => {
    const contentStyle = (markup: string) =>
      /data-part="content"[^>]*style="([^"]*)"/.exec(markup)?.[1] ?? "";
    expect(contentStyle(renderRoot(<ScrollArea>x</ScrollArea>).markup)).toContain("min-width:0");
    for (const axis of ["horizontal", "both"] as const) {
      expect(contentStyle(renderRoot(<ScrollArea axis={axis}>x</ScrollArea>).markup)).toContain(
        "min-width:fit-content",
      );
    }
  });

  it("shows a vertical scrollbar for the vertical axis, no horizontal one", () => {
    const { markup } = renderRoot(<ScrollArea>x</ScrollArea>);
    expect(markup).toMatch(/data-part="scrollbar"[^>]*data-orientation="vertical"/);
    expect(markup).not.toMatch(/data-orientation="horizontal"/);
  });

  it("shows a horizontal scrollbar for the horizontal axis, no vertical one", () => {
    const { markup } = renderRoot(<ScrollArea axis="horizontal">x</ScrollArea>);
    expect(markup).toMatch(/data-part="scrollbar"[^>]*data-orientation="horizontal"/);
    expect(markup).not.toMatch(/data-orientation="vertical"/);
  });

  it("shows both scrollbars for both", () => {
    const { markup } = renderRoot(<ScrollArea axis="both">x</ScrollArea>);
    expect(markup).toMatch(/data-orientation="vertical"/);
    expect(markup).toMatch(/data-orientation="horizontal"/);
  });

  it("renders no scrollbar at all when disabled", () => {
    const { markup } = renderRoot(<ScrollArea disabled>x</ScrollArea>);
    expect(markup).not.toContain('data-part="scrollbar"');
    expect(markup).not.toContain('data-part="thumb"');
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<ScrollArea id="log">x</ScrollArea>).attrs.id).toBe("log");
    expect(
      renderRoot(
        <ScrollArea disabled id="log">
          x
        </ScrollArea>,
      ).attrs.id,
    ).toBe("log");
  });

  it("appends a custom className to the root element's own instead of replacing it", () => {
    const { attrs } = renderRoot(<ScrollArea className="custom-class">x</ScrollArea>);
    expect(attrs.class).toContain("custom-class");
    expect(attrs.class?.split(" ").length).toBeGreaterThan(1);
  });
});
