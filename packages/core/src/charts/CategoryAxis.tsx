import { XAxis } from "recharts";
import { CHART_AXIS_STROKE, CHART_AXIS_TEXT_FILL } from "./ChartContainer.js";

export interface CategoryAxisProps {
  /** The field of a row that names its category. */
  dataKey: string;
}

// An x axis of named categories (levels, zones, products) instead of moments:
// one tick per row, in the order of the data, every label shown.
export function CategoryAxis({ dataKey }: CategoryAxisProps) {
  return (
    <XAxis
      dataKey={dataKey}
      interval={0}
      stroke={CHART_AXIS_STROKE}
      tick={{ fill: CHART_AXIS_TEXT_FILL }}
      type="category"
    />
  );
}
