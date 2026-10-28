import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import type { Unit } from "../format/quantities.js";
import { ChartContainer } from "./ChartContainer.js";
import { ChartLegend } from "./ChartLegend.js";
import { ChartTooltip } from "./ChartTooltip.js";
import type { SeriesSlot } from "./series.js";
import { seriesColor } from "./series.js";

export interface PieChartSlice {
  id: string;
  name: string;
  value: number;
  slot: SeriesSlot;
  // Any CSS colour (a token like `var(--my-tone)` or a value) instead of the
  // slot's -- so a slice can wear the colour its quantity has elsewhere.
  color?: string | undefined;
  unit?: Unit | undefined;
}

export function sliceColor(slice: PieChartSlice): string {
  return slice.color ?? seriesColor(slice.slot);
}

export interface PieChartProps {
  data: PieChartSlice[];
  height?: number | `${number}%` | undefined;
  // false leaves out the legend -- when a table or a legend of its own
  // beside the chart already names the slices.
  legend?: boolean | undefined;
}

export function PieChart({ data, height, legend = true }: PieChartProps) {
  const units: Record<string, Unit> = {};
  for (const slice of data) {
    if (slice.unit !== undefined) {
      units[slice.name] = slice.unit;
    }
  }

  return (
    <ChartContainer height={height}>
      <RechartsPieChart margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
        <ChartTooltip units={units} />
        {legend ? <ChartLegend /> : null}
        <Pie data={data} dataKey="value" isAnimationActive={false} nameKey="name">
          {data.map((slice) => (
            <Cell fill={sliceColor(slice)} key={slice.id} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ChartContainer>
  );
}
