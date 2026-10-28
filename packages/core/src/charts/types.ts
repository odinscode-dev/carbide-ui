import type { Unit } from "../format/quantities.js";
import type { SeriesSlot } from "./series.js";

export interface ChartSeries<TRow> {
  id: string;

  name: string;
  slot: SeriesSlot;

  accessorKey?: (keyof TRow & string) | undefined;
  accessorFn?: ((row: TRow) => number | null) | undefined;

  // A stretch per row instead of one value: [low, high], or null for none.
  // Line and area charts fill the band between the two, bar charts draw a
  // floating bar from low to high; the axis fits both ends and the tooltip
  // shows "low - high". It wins over accessorKey/accessorFn for drawing.
  // With a second, plain series for the mean this gives min/mean/max per day.
  rangeFn?: ((row: TRow) => readonly [number, number] | null) | undefined;

  unit?: Unit | undefined;
  axisId?: string | undefined;

  // Any CSS colour (a token like `var(--my-tone)` or a value) instead of the
  // slot's. The axis this series introduces follows it, same as the slot.
  color?: string | undefined;

  // Draws the line dashed, so series stay apart without their colour.
  dashed?: boolean | undefined;

  // One series stands out, the rest step back: "strong" draws it thicker,
  // "muted" fades it. Without either, all series look alike.
  emphasis?: ChartEmphasis | undefined;

  // Turns a value into the text the tooltip shows, for a decimal mark or a
  // number of digits the unit's default does not give. Without it, `unit`
  // formats the value and a bare number falls back to the locale's default.
  format?: ((value: number) => string) | undefined;

  // Free text shown as the unit -- on the axis and after the value in the
  // tooltip -- for units `Unit` does not list (kPa, ppm). It wins over `unit`
  // in labelling; `unit` alone still formats the value.
  unitLabel?: string | undefined;

  // Which side this series' axis stands on. Without it, axes alternate left,
  // right, left ... in the order their series appear. Read from the first
  // series that introduces a given axisId, same as slot/unit.
  axisSide?: "left" | "right" | undefined;

  // Hides the tick labels and unit label of this series' axis. Read from
  // the first series that introduces a given axisId, same as slot/unit.
  axisHidden?: boolean | undefined;

  // false leaves out the axis title (the unit beside the axis) and keeps the
  // tick labels -- when a legend or the tile already names the units. Read
  // from the first series that introduces a given axisId, same as axisHidden.
  axisTitle?: boolean | undefined;

  // Fits this series' axis to its data instead of starting at zero: the
  // axis runs from the smallest value minus this fraction of the data's
  // span to the largest plus the same. 0.05 leaves 5 % of air above and
  // below, so small movements stay visible. Read from the first series
  // that introduces a given axisId, same as axisHidden.
  axisPadding?: number | undefined;

  // Counts (searches, events): the axis shows whole numbers only, never a
  // tick like 0.5. Read from the first series that introduces a given axisId,
  // same as axisHidden.
  axisIntegers?: boolean | undefined;
}

export type ChartEmphasis = "strong" | "muted";

export interface ChartPointEvent {
  id: string;
  label?: string | undefined;
  at: number;
}

export type ChartRangeTone = "accent" | "neutral";

export interface ChartRangeEvent {
  id: string;
  label?: string | undefined;
  from: number;
  to: number;
  // "accent" (default) stands for something that happened, "neutral" for a
  // stretch that is merely a backdrop -- night, a gap in the data.
  tone?: ChartRangeTone | undefined;
}

export type ChartEvent = ChartPointEvent | ChartRangeEvent;

export function isChartRangeEvent(event: ChartEvent): event is ChartRangeEvent {
  return "from" in event;
}

export type ThresholdKind = "negative" | "positive" | "info" | "neutral";

export interface ChartThreshold {
  id: string;
  label?: string | undefined;
  value: number;
  kind: ThresholdKind;
  axisId?: string | undefined;
}

// A filled stretch of one value axis -- a target range. With `start`/`end` it
// covers only that stretch of the time axis (a night band differing from the
// day band); without, the whole width.
export interface ChartBand {
  id: string;
  label?: string | undefined;
  from: number;
  to: number;
  axisId?: string | undefined;
  color?: string | undefined;
  start?: number | undefined;
  end?: number | undefined;
}
