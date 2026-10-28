import { Area, Line } from "recharts";
import { dataKeyOf, rangeKeyOf } from "./axes.js";
import { CartesianChart, type CartesianChartProps } from "./CartesianChart.js";
import { CHART_AREA_ALPHA } from "./ChartContainer.js";
import { colorOf, lineLook } from "./series.js";

export type LineChartProps<TRow> = Omit<CartesianChartProps<TRow>, "renderSeries">;

export function LineChart<TRow>(props: LineChartProps<TRow>) {
  return (
    <CartesianChart
      {...props}
      renderSeries={(entry, axisId) => {
        const range = rangeKeyOf(entry);
        // A range series is a band behind the lines, not a line of its own.
        return range === undefined ? (
          <Line
            dataKey={dataKeyOf(entry)}
            dot={false}
            isAnimationActive={false}
            key={entry.id}
            name={entry.name}
            {...lineLook(entry)}
            type="monotone"
            yAxisId={axisId}
          />
        ) : (
          <Area
            dataKey={range}
            fill={colorOf(entry)}
            fillOpacity={CHART_AREA_ALPHA}
            isAnimationActive={false}
            key={entry.id}
            name={entry.name}
            stroke="none"
            type="monotone"
            yAxisId={axisId}
          />
        );
      }}
    />
  );
}
