import { describe, expect, it } from "vitest";
import { BOARD_STORY_WIDGETS } from "./BoardShell.stories.js";
import type { BoardWidgetPosition } from "./validateBoard.js";
import { validateBoard } from "./validateBoard.js";

function widget(overrides: Partial<BoardWidgetPosition> & { id: string }): BoardWidgetPosition {
  return { x: 1, y: 1, w: 2, h: 4, ...overrides };
}

describe("validateBoard", () => {
  it("reports nothing for an empty list", () => {
    expect(validateBoard([])).toEqual([]);
  });

  it("reports nothing for non-overlapping widgets on the grid", () => {
    const issues = validateBoard([
      widget({ id: "a", x: 1, y: 1, w: 2, h: 4 }),
      widget({ id: "b", x: 3, y: 1, w: 2, h: 4 }),
    ]);
    expect(issues).toEqual([]);
  });

  it("allows a widget that fills the grid exactly", () => {
    const issues = validateBoard([widget({ id: "a", x: 1, y: 1, w: 24, h: 20 })]);
    expect(issues).toEqual([]);
  });

  it("reports a widget that overhangs the 24 columns on the right", () => {
    const issues = validateBoard([widget({ id: "a", x: 20, y: 1, w: 6, h: 4 })]);
    expect(issues).toEqual([{ type: "out-of-bounds", id: "a" }]);
  });

  it("reports a widget that overhangs the 20 rows at the bottom", () => {
    const issues = validateBoard([widget({ id: "a", x: 1, y: 18, w: 2, h: 4 })]);
    expect(issues).toEqual([{ type: "out-of-bounds", id: "a" }]);
  });

  it("reports a widget with x or y under 1", () => {
    expect(validateBoard([widget({ id: "a", x: 0 })])).toEqual([
      { type: "out-of-bounds", id: "a" },
    ]);
    expect(validateBoard([widget({ id: "b", y: 0 })])).toEqual([
      { type: "out-of-bounds", id: "b" },
    ]);
  });

  it("reports two widgets that share a cell", () => {
    const issues = validateBoard([
      widget({ id: "a", x: 1, y: 1, w: 4, h: 4 }),
      widget({ id: "b", x: 3, y: 1, w: 4, h: 4 }),
    ]);
    expect(issues).toEqual([{ type: "overlap", ids: ["a", "b"] }]);
  });

  it("allows two widgets that only stand edge to edge", () => {
    const issues = validateBoard([
      widget({ id: "a", x: 1, y: 1, w: 4, h: 4 }),
      widget({ id: "b", x: 5, y: 1, w: 4, h: 4 }),
    ]);
    expect(issues).toEqual([]);
  });

  it("reports only the overlapping pair among several widgets", () => {
    const issues = validateBoard([
      widget({ id: "a", x: 1, y: 1, w: 4, h: 4 }),
      widget({ id: "b", x: 10, y: 1, w: 4, h: 4 }),
      widget({ id: "c", x: 2, y: 2, w: 4, h: 4 }),
    ]);
    expect(issues).toEqual([{ type: "overlap", ids: ["a", "c"] }]);
  });

  it("reports overlap and out-of-bounds in one call", () => {
    const issues = validateBoard([
      widget({ id: "a", x: 1, y: 1, w: 4, h: 4 }),
      widget({ id: "b", x: 2, y: 2, w: 4, h: 4 }),
      widget({ id: "c", x: 23, y: 1, w: 4, h: 4 }),
    ]);
    expect(issues).toEqual([
      { type: "out-of-bounds", id: "c" },
      { type: "overlap", ids: ["a", "b"] },
    ]);
  });

  it("lets the six widgets from the story pass without an error", () => {
    expect(validateBoard(BOARD_STORY_WIDGETS)).toEqual([]);
  });
});
