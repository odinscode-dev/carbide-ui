import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BoardWidget } from "./BoardWidget.js";

function tile(element: ReactElement): { tag: string; markup: string } {
  const markup = renderToStaticMarkup(element);
  const match = /^<div[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No div in markup: ${markup}`);
  }
  return { tag: match[0], markup };
}

describe("BoardWidget", () => {
  it("renders the children", () => {
    const { markup } = tile(
      <BoardWidget h={4} w={2} x={1} y={1}>
        Flow
      </BoardWidget>,
    );
    expect(markup).toContain("Flow");
  });

  it("sets grid-column and grid-row from x, y, w, h", () => {
    const { tag } = tile(
      <BoardWidget h={8} w={6} x={3} y={5}>
        Flow
      </BoardWidget>,
    );
    expect(tag).toContain("grid-column:3 / span 6");
    expect(tag).toContain("grid-row:5 / span 8");
  });

  it("carries state as data-state and shows the bar only with it", () => {
    const withState = tile(
      <BoardWidget h={4} state="error" w={2} x={1} y={1}>
        Flow
      </BoardWidget>,
    );
    expect(withState.tag).toContain('data-state="error"');
    expect(withState.markup).toContain('aria-hidden="true"');

    const withoutState = tile(
      <BoardWidget h={4} w={2} x={1} y={1}>
        Flow
      </BoardWidget>,
    );
    expect(withoutState.tag).not.toContain("data-state");
    expect(withoutState.markup).not.toContain('aria-hidden="true"');
  });

  it("passes native attributes through to the root", () => {
    const { tag } = tile(<BoardWidget data-testid="w" h={4} id="flow-widget" w={2} x={1} y={1} />);
    expect(tag).toContain('id="flow-widget"');
    expect(tag).toContain('data-testid="w"');
  });
});
