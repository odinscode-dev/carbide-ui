import { Area } from "recharts";
import { drawKeyOf } from "./axes.js";
import { CartesianChart, type CartesianChartProps } from "./CartesianChart.js";
import { CHART_AREA_ALPHA } from "./ChartContainer.js";
import { colorOf, lineLook } from "./series.js";

export type AreaChartProps<TRow> = Omit<CartesianChartProps<TRow>, "renderSeries">;

export function AreaChart<TRow>(props: AreaChartProps<TRow>) {
  return (
    <CartesianChart
      {...props}
      renderSeries={(entry, axisId) => (
        <Area
          dataKey={drawKeyOf(entry)}
          fill={colorOf(entry)}
          fillOpacity={CHART_AREA_ALPHA}
          isAnimationActive={false}
          key={entry.id}
          name={entry.name}
          {...lineLook(entry)}
          type="monotone"
          yAxisId={axisId}
        />
      )}
    />
  );
}
