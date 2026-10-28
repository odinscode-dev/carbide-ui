import { Label, YAxis } from "recharts";
import type { Unit } from "../format/quantities.js";
import type { AxisDomain } from "./axes.js";
import { CHART_AXIS_STROKE, CHART_AXIS_TEXT_FILL } from "./ChartContainer.js";
import type { SeriesSlot } from "./series.js";
import { seriesColor } from "./series.js";

export type ValueAxisOrientation = "left" | "right";

export interface ValueAxisProps {
  id: string;
  orientation?: ValueAxisOrientation | undefined;

  slot?: SeriesSlot | undefined;

  // Tints the axis in any CSS colour instead of the slot's.
  color?: string | undefined;

  unit?: Unit | undefined;

  // Free text for the axis label, for units `Unit` does not list; it wins over `unit`.
  unitLabel?: string | undefined;

  // Hides tick labels and the unit label while keeping the series on its
  // own scale -- for dashboards with more lines than legible axes.
  hidden?: boolean | undefined;

  // false leaves out the unit label beside the axis, keeping the tick labels.
  title?: boolean | undefined;

  // Whole-number ticks only, for counts.
  integers?: boolean | undefined;

  // Fixed [min, max], or recharts' own scale.
  domain?: AxisDomain | undefined;

  // Exact tick values, for a fixed domain whose ticks recharts would spread evenly.
  ticks?: readonly number[] | undefined;
}

export function ValueAxis({
  id,
  orientation = "left",
  slot,
  color: tint,
  unit,
  unitLabel,
  hidden = false,
  title = true,
  integers = false,
  domain,
  ticks,
}: ValueAxisProps) {
  const own = tint ?? (slot === undefined ? undefined : seriesColor(slot));
  const color = own ?? CHART_AXIS_STROKE;
  const textColor = own ?? CHART_AXIS_TEXT_FILL;
  const label = unitLabel ?? unit;
  return (
    <YAxis
      {...(domain === undefined ? {} : { domain })}
      allowDecimals={!integers}
      hide={hidden}
      orientation={orientation}
      {...(ticks === undefined ? {} : { ticks: [...ticks] })}
      stroke={color}
      tick={{ fill: textColor }}
      yAxisId={id}
    >
      {label === undefined || hidden || !title ? null : (
        <Label
          angle={-90}
          fill={textColor}
          position={orientation === "left" ? "insideLeft" : "insideRight"}
          value={label}
        />
      )}
    </YAxis>
  );
}
