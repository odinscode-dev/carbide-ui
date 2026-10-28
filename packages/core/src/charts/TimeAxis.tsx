import { XAxis } from "recharts";
import { CHART_AXIS_STROKE, CHART_AXIS_TEXT_FILL } from "./ChartContainer.js";
import { type ChartResolution, formatDayTick, formatMomentTick } from "./resolution.js";
import type { ChartDomain } from "./zoom.js";

export interface TimeAxisProps {
  dataKey?: string | undefined;

  seconds?: boolean | undefined;

  /** BCP 47 tag for the tick labels; omitted, the browser language. */
  locale?: string | undefined;

  /** What an x value stands for: a moment (default) or a calendar day. */
  resolution?: ChartResolution | undefined;

  /**
   * Exact ticks (epoch ms). For "time" every one is shown -- one per event,
   * say; for "day" they are the candidates the axis thins to what fits.
   */
  ticks?: readonly number[] | undefined;

  /** Air (ms) added on both ends of the data span, so edge bars are not cut in half. */
  pad?: number | undefined;
  /** The span (ms) the axis covers, which decides whether a tick shows the date too. */
  span?: number | undefined;
  /** A stretch to show instead of the whole data span; what lies outside is cut off. */
  zoom?: ChartDomain | undefined;
}

const MIN_TICK_GAP = 40;

export function TimeAxis({
  dataKey = "at",
  seconds,
  locale,
  resolution = "time",
  ticks,
  pad = 0,
  span,
  zoom,
}: TimeAxisProps) {
  const day = resolution === "day";
  return (
    <XAxis
      {...(zoom === undefined ? {} : { allowDataOverflow: true })}
      dataKey={dataKey}
      domain={
        zoom !== undefined
          ? [zoom[0], zoom[1]]
          : pad === 0
            ? ["dataMin", "dataMax"]
            : [(min) => min - pad, (max) => max + pad]
      }
      {...(ticks === undefined ? {} : { ticks: [...ticks] })}
      {...(ticks === undefined || day ? {} : { interval: 0 })}
      minTickGap={MIN_TICK_GAP}
      scale="time"
      stroke={CHART_AXIS_STROKE}
      tick={{ fill: CHART_AXIS_TEXT_FILL }}
      tickFormatter={(value: number) =>
        day ? formatDayTick(value, locale) : formatMomentTick(value, span ?? 0, { locale, seconds })
      }
      type="number"
    />
  );
}
