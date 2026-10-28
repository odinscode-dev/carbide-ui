import { CHART_AXIS_TEXT_FILL } from "./ChartContainer.js";

/** Gap in px between a label and the axis line. */
export const LABEL_GAP = 8;

export interface RankingLabelProps {
  /** Injected by recharts: the right edge of the label, on the tick. */
  x?: number | undefined;
  /** Injected by recharts: the vertical centre of the row. */
  y?: number | undefined;
  /** Injected by recharts: the category being labelled. */
  payload?: { value?: unknown } | undefined;
  /** Width in px reserved for labels; the label is cut to fit it. */
  labelWidth: number;
  /** Height in px of one row. */
  rowHeight: number;
  fontSize: number;
}

// One category label of a RankingChart: a single line, cut with an ellipsis at
// the column's width, the full text in its title. A recharts text tick breaks a
// long label into several lines that run into the neighbours' rows; HTML in a
// foreignObject can be cut by the browser exactly, at whatever width the text
// happens to have.
export function RankingLabel({
  x = 0,
  y = 0,
  payload,
  labelWidth,
  rowHeight,
  fontSize,
}: RankingLabelProps) {
  const text = payload?.value === undefined ? "" : String(payload.value);
  const width = Math.max(labelWidth - LABEL_GAP, 0);
  return (
    <foreignObject height={rowHeight} width={width} x={x - width} y={y - rowHeight / 2}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          boxSizing: "border-box",
          inlineSize: width,
          blockSize: rowHeight,
        }}
      >
        <span
          style={{
            minInlineSize: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: CHART_AXIS_TEXT_FILL,
            fontFamily: "inherit",
            fontSize,
          }}
          title={text}
        >
          {text}
        </span>
      </div>
    </foreignObject>
  );
}
