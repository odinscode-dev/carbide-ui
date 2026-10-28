import { BOARD_COLUMNS, BOARD_ROWS } from "./Board.js";
import type { BoardWidgetState } from "./BoardWidget.js";

export interface BoardWidgetPosition {
  id: string;

  x: number;

  y: number;

  w: number;

  h: number;
  state?: BoardWidgetState | undefined;
}

export type BoardValidationIssue =
  | { type: "out-of-bounds"; id: string }
  | { type: "overlap"; ids: [string, string] };

export function validateBoard(widgets: readonly BoardWidgetPosition[]): BoardValidationIssue[] {
  const issues: BoardValidationIssue[] = [];

  for (const widget of widgets) {
    if (isOutOfBounds(widget)) {
      issues.push({ type: "out-of-bounds", id: widget.id });
    }
  }

  for (const [index, a] of widgets.entries()) {
    for (const b of widgets.slice(index + 1)) {
      if (overlaps(a, b)) {
        issues.push({ type: "overlap", ids: [a.id, b.id] });
      }
    }
  }

  return issues;
}

function isOutOfBounds(widget: BoardWidgetPosition): boolean {
  return (
    widget.x < 1 ||
    widget.y < 1 ||
    widget.x + widget.w - 1 > BOARD_COLUMNS ||
    widget.y + widget.h - 1 > BOARD_ROWS
  );
}

function overlaps(a: BoardWidgetPosition, b: BoardWidgetPosition): boolean {
  const columnOverlap = a.x <= b.x + b.w - 1 && b.x <= a.x + a.w - 1;
  const rowOverlap = a.y <= b.y + b.h - 1 && b.y <= a.y + a.h - 1;
  return columnOverlap && rowOverlap;
}
