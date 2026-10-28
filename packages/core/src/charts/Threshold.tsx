import { ReferenceLine } from "recharts";
import type { ThresholdKind } from "./types.js";

const COLORS: Readonly<Record<ThresholdKind, string>> = {
  negative: "var(--carbide-chart-threshold-negative)",
  positive: "var(--carbide-chart-threshold-positive)",
  info: "var(--carbide-chart-threshold-info)",
  neutral: "var(--carbide-chart-threshold-neutral)",
};

export interface ThresholdProps {
  value: number;
  kind: ThresholdKind;
  label?: string | undefined;
  yAxisId?: string | undefined;
}

export function Threshold({ value, kind, label, yAxisId }: ThresholdProps) {
  const color = COLORS[kind];
  return (
    <ReferenceLine
      pointerEvents="none"
      stroke={color}
      strokeDasharray="4 4"
      y={value}
      {...(yAxisId === undefined ? {} : { yAxisId })}
      {...(label === undefined
        ? {}
        : { label: { fill: color, position: "insideBottomRight" as const, value: label } })}
    />
  );
}
