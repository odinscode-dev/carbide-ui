import { Bar } from "recharts";
import { drawKeyOf, rangeKeyOf } from "./axes.js";
import { CartesianChart, type CartesianChartProps, type ChartZoomProps } from "./CartesianChart.js";
import { colorOf } from "./series.js";

export interface BarChartProps<TRow>
  extends Omit<CartesianChartProps<TRow>, "renderSeries" | keyof ChartZoomProps> {
  /** Width of one bar in px; omitted, recharts sizes bars to the band. */
  barSize?: number | undefined;
  /** Series on the same value axis stack into one bar instead of standing side by side. */
  stacked?: boolean | undefined;
}

export function BarChart<TRow>({ barSize, stacked = false, ...props }: BarChartProps<TRow>) {
  return (
    <CartesianChart
      {...props}
      axisFromZero
      renderSeries={(entry, axisId) => {
        const range = rangeKeyOf(entry);
        // A range floats from its low to its high end; it never stacks.
        return (
          <Bar
            {...(barSize === undefined ? {} : { barSize })}
            {...(stacked && range === undefined ? { stackId: axisId } : {})}
            dataKey={drawKeyOf(entry)}
            fill={colorOf(entry)}
            isAnimationActive={false}
            key={entry.id}
            name={entry.name}
            yAxisId={axisId}
          />
        );
      }}
    />
  );
}
