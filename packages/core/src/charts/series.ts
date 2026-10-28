import type { ChartSeries } from "./types.js";

export type SeriesSlot = 1 | 2 | 3 | 4 | 5 | 6;

const SERIES_COLOR: Readonly<Record<SeriesSlot, string>> = {
  1: "var(--carbide-chart-series-1)",
  2: "var(--carbide-chart-series-2)",
  3: "var(--carbide-chart-series-3)",
  4: "var(--carbide-chart-series-4)",
  5: "var(--carbide-chart-series-5)",
  6: "var(--carbide-chart-series-6)",
};

export function seriesColor(slot: SeriesSlot): string {
  return SERIES_COLOR[slot];
}

/** The colour a series is drawn in: its own, or its slot's. */
export function colorOf<TRow>(entry: ChartSeries<TRow>): string {
  return entry.color ?? seriesColor(entry.slot);
}

// A line's look as recharts props: dashes, thickness and fading follow the
// series' own settings and its emphasis.
export interface LineLook {
  stroke: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

const DASH = "8 5";
const STRONG_WIDTH = 3;
const MUTED_OPACITY = 0.4;

export function lineLook<TRow>(entry: ChartSeries<TRow>): LineLook {
  return {
    stroke: colorOf(entry),
    ...(entry.dashed === true ? { strokeDasharray: DASH } : {}),
    ...(entry.emphasis === "strong" ? { strokeWidth: STRONG_WIDTH } : {}),
    ...(entry.emphasis === "muted" ? { strokeOpacity: MUTED_OPACITY } : {}),
  };
}
