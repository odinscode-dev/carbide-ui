import {
  Bar,
  CartesianGrid,
  LabelList,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "../format/number.js";
import type { Unit } from "../format/quantities.js";
import { formatQuantity } from "../format/quantity.js";
import {
  CHART_AXIS_STROKE,
  CHART_AXIS_TEXT_FILL,
  CHART_GRID_STROKE,
  ChartContainer,
} from "./ChartContainer.js";
import { ChartTooltip } from "./ChartTooltip.js";
import { RankingLabel } from "./RankingLabel.js";
import type { SeriesSlot } from "./series.js";
import { seriesColor } from "./series.js";

export interface RankingChartItem {
  id: string;
  label: string;
  value: number;
}

export interface RankingChartProps {
  /** In the order to show, top first; the chart does not sort. */
  items: RankingChartItem[];
  /** What the values are called, shown in the tooltip. */
  name: string;
  unit?: Unit | undefined;
  slot?: SeriesSlot | undefined;
  /** Width in px reserved for the labels on the left. */
  labelWidth?: number | undefined;
}

const ROW_HEIGHT = 26;
const CHROME_HEIGHT = 24;
const BAR_SIZE = 14;
const TICK = { fill: CHART_AXIS_TEXT_FILL, fontSize: 11 };
const LABEL_FONT_SIZE = 11;

// A ranking as horizontal bars: one row per item, its label on the left and its
// value printed at the end of the bar, so the exact number reads without
// hovering. The height follows the number of rows.
export function RankingChart({ items, name, unit, slot = 1, labelWidth = 130 }: RankingChartProps) {
  const rows = items.map((item) => ({ label: item.label, [name]: item.value }));
  const format = (value: number) =>
    unit === undefined ? formatNumber(value) : formatQuantity(value, unit);
  return (
    <ChartContainer height={Math.max(items.length, 1) * ROW_HEIGHT + CHROME_HEIGHT}>
      <RechartsBarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 32, bottom: 0, left: 0 }}
      >
        <CartesianGrid horizontal={false} stroke={CHART_GRID_STROKE} />
        <XAxis allowDecimals={false} stroke={CHART_AXIS_STROKE} tick={TICK} type="number" />
        <YAxis
          dataKey="label"
          interval={0}
          stroke={CHART_AXIS_STROKE}
          tick={
            <RankingLabel
              fontSize={LABEL_FONT_SIZE}
              labelWidth={labelWidth}
              rowHeight={ROW_HEIGHT}
            />
          }
          type="category"
          width={labelWidth}
        />
        <ChartTooltip showTextLabel units={unit === undefined ? {} : { [name]: unit }} />
        <Bar barSize={BAR_SIZE} dataKey={name} fill={seriesColor(slot)} isAnimationActive={false}>
          <LabelList
            dataKey={name}
            fill={CHART_AXIS_TEXT_FILL}
            fontSize={11}
            formatter={(value: unknown) => (typeof value === "number" ? format(value) : "")}
            position="right"
          />
        </Bar>
      </RechartsBarChart>
    </ChartContainer>
  );
}
