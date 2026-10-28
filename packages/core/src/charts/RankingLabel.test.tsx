import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LABEL_GAP, RankingLabel } from "./RankingLabel.js";

const LONG = "How should the label of an axis be cut when it is longer than the column?";

function render(value: unknown, labelWidth = 130) {
  return renderToStaticMarkup(
    <svg aria-label="test" role="img">
      <RankingLabel
        fontSize={11}
        labelWidth={labelWidth}
        payload={{ value }}
        rowHeight={26}
        x={130}
        y={40}
      />
    </svg>,
  );
}

describe("RankingLabel", () => {
  it("keeps a long label on one line and cut with an ellipsis", () => {
    const markup = render(LONG);
    expect(markup).toContain("white-space:nowrap");
    expect(markup).toContain("text-overflow:ellipsis");
    expect(markup).toContain("overflow:hidden");
  });

  it("puts the full text in the title, so nothing is lost by the cut", () => {
    expect(render(LONG)).toContain(`title="${LONG}"`);
  });

  it("stays inside the column, right-aligned against the axis", () => {
    const width = 130 - LABEL_GAP;
    const markup = render("Short", 130);
    expect(markup).toContain(`width="${width}"`);
    // Its right edge is the tick position, its row centred on the tick.
    expect(markup).toContain(`x="${130 - width}"`);
    expect(markup).toContain(`y="${40 - 13}"`);
    expect(markup).toContain("justify-content:flex-end");
  });

  it("follows the width reserved for labels", () => {
    expect(render("Short", 200)).toContain(`width="${200 - LABEL_GAP}"`);
  });

  it("renders a label that is not text as text, and none as empty", () => {
    expect(render(42)).toContain(">42<");
    expect(render(undefined)).toContain('title=""');
  });

  it("never gets a negative width", () => {
    expect(render("x", 3)).toContain('width="0"');
  });
});
