import { ReferenceArea } from "recharts";
import { CHART_REF_AREA_ALPHA } from "./ChartContainer.js";
import type { ChartOverflow } from "./EventLine.js";

const DEFAULT_COLOR = "var(--carbide-chart-threshold-neutral)";
const EDGE_DASH = "1 3";

export interface BandProps {
  from: number;
  to: number;
  yAxisId?: string | undefined;
  color?: string | undefined;
  label?: string | undefined;
  /** The stretch of the time axis the band covers; both omitted, the whole width. */
  start?: number | undefined;
  end?: number | undefined;
  ifOverflow?: ChartOverflow | undefined;
}

// A target range: a light fill between two values with dotted edges in the
// same colour, so it reads as a range and not as one more series.
export function Band({
  from,
  to,
  yAxisId,
  color = DEFAULT_COLOR,
  label,
  start,
  end,
  ifOverflow,
}: BandProps) {
  return (
    <ReferenceArea
      pointerEvents="none"
      fill={color}
      fillOpacity={CHART_REF_AREA_ALPHA}
      stroke={color}
      strokeDasharray={EDGE_DASH}
      strokeOpacity={0.6}
      y1={from}
      y2={to}
      {...(start === undefined ? {} : { x1: start })}
      {...(end === undefined ? {} : { x2: end })}
      {...(ifOverflow === undefined ? {} : { ifOverflow })}
      {...(yAxisId === undefined ? {} : { yAxisId })}
      {...(label === undefined
        ? {}
        : { label: { fill: color, position: "insideTopLeft" as const, value: label } })}
    />
  );
}
