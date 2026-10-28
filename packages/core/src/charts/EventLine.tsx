import { ReferenceLine } from "recharts";
import { CHART_REF_LINE } from "./ChartContainer.js";

export type ChartOverflow = "discard" | "hidden" | "visible" | "extendDomain";

export interface EventLineProps {
  at: number;
  label?: string | undefined;
  yAxisId?: string | undefined;

  ifOverflow?: ChartOverflow | undefined;
}

export function EventLine({ at, label, yAxisId, ifOverflow }: EventLineProps) {
  return (
    <ReferenceLine
      pointerEvents="none"
      stroke={CHART_REF_LINE}
      x={at}
      {...(ifOverflow === undefined ? {} : { ifOverflow })}
      {...(yAxisId === undefined ? {} : { yAxisId })}
      {...(label === undefined
        ? {}
        : { label: { fill: CHART_REF_LINE, position: "top" as const, value: label } })}
    />
  );
}
