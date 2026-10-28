import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { ContentSwitcher, type ContentSwitcherItem } from "./ContentSwitcher.js";

const ITEMS: ContentSwitcherItem[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
];

describe("ContentSwitcher", () => {
  it("renders one segment per item", () => {
    const { tag, markup } = renderRoot(<ContentSwitcher items={ITEMS} value="day" />);
    expect(tag).toBe("div");
    expect(markup).toContain("Day");
    expect(markup).toContain("Week");
  });

  it("marks the selected segment with data-state checked", () => {
    const { markup } = renderRoot(<ContentSwitcher items={ITEMS} value="week" />);
    expect(markup).toMatch(/data-state="checked"[^>]*>[\s\S]*?Week/);
  });

  it("shows a disabled segment as data-disabled", () => {
    const { markup } = renderRoot(
      <ContentSwitcher items={[{ value: "a", label: "A", disabled: true }]} />,
    );
    expect(markup).toMatch(/data-disabled=""[^>]*>[\s\S]*?A/);
  });

  it("locks the whole group with disabled", () => {
    const { attrs } = renderRoot(<ContentSwitcher disabled items={ITEMS} />);
    expect(attrs["data-disabled"]).toBe("");
  });

  it("passes the id through to the root element", () => {
    expect(renderRoot(<ContentSwitcher id="range" items={ITEMS} />).attrs.id).toBe("range");
  });

  it("runs horizontally so the indicator is positioned on the left instead of on top", () => {
    expect(renderRoot(<ContentSwitcher items={ITEMS} />).attrs["data-orientation"]).toBe(
      "horizontal",
    );
  });
});
