import { ReferenceArea } from "recharts";
import { CHART_REF_AREA_ALPHA, CHART_REF_LINE } from "./ChartContainer.js";
import type { ChartOverflow } from "./EventLine.js";
import type { ChartRangeTone } from "./types.js";

// A neutral range is the backdrop (night, a gap), not an event: the neutral
// threshold grey instead of the accent.
const NEUTRAL = "var(--carbide-chart-threshold-neutral)";

export interface EventRangeProps {
  from: number;
  to: number;
  label?: string | undefined;
  yAxisId?: string | undefined;
  ifOverflow?: ChartOverflow | undefined;
  tone?: ChartRangeTone | undefined;
}

export function EventRange({
  from,
  to,
  label,
  yAxisId,
  ifOverflow,
  tone = "accent",
}: EventRangeProps) {
  const color = tone === "neutral" ? NEUTRAL : CHART_REF_LINE;
  return (
    <ReferenceArea
      pointerEvents="none"
      fill={color}
      fillOpacity={CHART_REF_AREA_ALPHA}
      x1={from}
      x2={to}
      {...(ifOverflow === undefined ? {} : { ifOverflow })}
      {...(yAxisId === undefined ? {} : { yAxisId })}
      {...(label === undefined
        ? {}
        : { label: { fill: color, position: "insideTop" as const, value: label } })}
    />
  );
}
