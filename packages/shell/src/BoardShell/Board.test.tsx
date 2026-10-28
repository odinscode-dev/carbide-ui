import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BOARD_COLUMNS, BOARD_ROWS, Board } from "./Board.js";
import { BoardWidget } from "./BoardWidget.js";

describe("Board", () => {
  it("renders its widgets", () => {
    const markup = renderToStaticMarkup(
      <Board>
        <BoardWidget h={4} w={2} x={1} y={1}>
          Flow
        </BoardWidget>
      </Board>,
    );
    expect(markup).toContain("Flow");
  });

  it("passes native attributes through to the root", () => {
    const markup = renderToStaticMarkup(<Board data-testid="board" id="canvas" />);
    expect(markup).toContain('id="canvas"');
    expect(markup).toContain('data-testid="board"');
  });

  it("names the grid as 24 by 20 cells", () => {
    expect(BOARD_COLUMNS).toBe(24);
    expect(BOARD_ROWS).toBe(20);
  });
});
