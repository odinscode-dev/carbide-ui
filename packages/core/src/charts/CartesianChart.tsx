import { type ReactElement, useState } from "react";
import { CartesianGrid, ComposedChart } from "recharts";
import type { Unit } from "../format/quantities.js";
import { axesFromSeries, axisDomain, axisTicks } from "./axes.js";
import { Band } from "./Band.js";
import styles from "./CartesianChart.module.css";
import { CategoryAxis } from "./CategoryAxis.js";
import { CHART_GRID_STROKE, ChartContainer } from "./ChartContainer.js";
import { ChartLegend } from "./ChartLegend.js";
import { ChartTooltip } from "./ChartTooltip.js";
import { EventLine } from "./EventLine.js";
import { EventRange } from "./EventRange.js";
import { type ChartResolution, DAY_MS, dayTicks } from "./resolution.js";
import { Threshold } from "./Threshold.js";
import { TimeAxis } from "./TimeAxis.js";
import type { TooltipValueStyle } from "./tooltipFormat.js";
import type { ChartBand, ChartEvent, ChartSeries, ChartThreshold } from "./types.js";
import { isChartRangeEvent } from "./types.js";
import { ValueAxis } from "./ValueAxis.js";
import { type ChartZoomTexts, ZoomControls } from "./ZoomControls.js";
import { ZoomLayer } from "./ZoomLayer.js";
import {
  type ChartDomain,
  extentOf,
  isFullDomain,
  panBy,
  rowsInDomain,
  ticksInDomain,
  valueAt,
  type ZoomLimits,
  zoomAround,
} from "./zoom.js";

/** The narrowest stretch a zoom reaches: a few days for day values, a minute otherwise. */
const MIN_SPAN_DAY = 3 * DAY_MS;
const MIN_SPAN_TIME = 60_000;
/** How far one step of the buttons goes: half the shown stretch. */
const STEP = 0.5;

export interface ChartZoomProps {
  /**
   * The stretch of the time axis to show (epoch ms: from, to); omitted, the
   * whole data span. What lies outside is cut off, the value axes fit the rest.
   */
  domain?: ChartDomain | undefined;
  /**
   * Turns zoom on: dragging across the chart, a pinch or swipe on touch and the
   * zoom buttons report the stretch they ask for here -- null for "show it all
   * again". The chart shows what `domain` says, so keep it there.
   */
  onDomainChange?: ((domain: ChartDomain | null) => void) | undefined;
  /** Texts of the zoom buttons; each one left out comes from the catalog. */
  zoomTexts?: ChartZoomTexts | undefined;
}

export interface CartesianChartProps<TRow> extends ChartZoomProps {
  data: TRow[];
  series: ChartSeries<TRow>[];
  events?: ChartEvent[] | undefined;
  thresholds?: ChartThreshold[] | undefined;
  /** Target ranges: a filled stretch of a value axis, optionally only over part of the time axis. */
  bands?: ChartBand[] | undefined;
  /** The chart's own legend below the plot (default on); off when the page already names the lines. */
  legend?: boolean | undefined;
  height?: number | `${number}%` | undefined;
  /**
   * What an x value stands for. "day": `at` is the UTC midnight of a calendar day,
   * the axis and tooltip show dates, and there is one tick per row (thinned to fit).
   */
  resolution?: ChartResolution | undefined;
  /** BCP 47 tag for axis and tooltip labels; omitted, the browser language. */
  locale?: string | undefined;
  /** Exact time-axis ticks (epoch ms); omitted, the axis picks its own. */
  ticks?: readonly number[] | undefined;
  /** Value axes start at zero instead of fitting the data (bars). */
  axisFromZero?: boolean | undefined;
  /**
   * The field that names each row's category: the x axis then shows these
   * names instead of time. Time-bound props (`events`, `resolution`, `ticks`,
   * zoom, the `start`/`end` of bands) have no meaning there and are ignored.
   */
  categoryKey?: string | undefined;

  renderSeries: (entry: ChartSeries<TRow>, axisId: string) => ReactElement;
}

export function CartesianChart<TRow>({
  data,
  series,
  events = [],
  thresholds = [],
  bands = [],
  legend = true,
  height,
  resolution = "time",
  locale,
  ticks,
  axisFromZero = false,
  categoryKey,
  domain,
  onDomainChange,
  zoomTexts,
  renderSeries,
}: CartesianChartProps<TRow>) {
  const axes = axesFromSeries(series);
  const pad = resolution === "day" && axisFromZero ? DAY_MS / 2 : 0;

  const [live, setLive] = useState<ChartDomain | null>(null);
  const full = extentOf(data, "at", pad);
  const limits: ZoomLimits | undefined =
    full === undefined
      ? undefined
      : {
          full,
          minSpan: Math.min(resolution === "day" ? MIN_SPAN_DAY : MIN_SPAN_TIME, full[1] - full[0]),
        };
  const shown = live ?? domain;
  const windowed = shown === undefined ? undefined : rowsInDomain(data, shown);
  const chartData = windowed?.drawn ?? data;
  const axisData = windowed?.inside ?? data;
  const zoomable =
    categoryKey === undefined && onDomainChange !== undefined && limits !== undefined;

  const allTicks = ticks ?? (resolution === "day" ? dayTicks(chartData) : undefined);
  const visibleTicks =
    allTicks === undefined || shown === undefined ? allTicks : ticksInDomain(allTicks, shown);

  const firstAxis = axes[0]?.id ?? "value";
  const units: Record<string, Unit> = {};
  const valueStyles: Record<string, TooltipValueStyle> = {};
  for (const entry of series) {
    if (entry.unit !== undefined) {
      units[entry.name] = entry.unit;
    }
    if (entry.format !== undefined || entry.unitLabel !== undefined) {
      valueStyles[entry.name] = {
        unit: entry.unit,
        unitLabel: entry.unitLabel,
        format: entry.format,
      };
    }
  }

  const commit = (next: ChartDomain | null) => {
    setLive(null);
    onDomainChange?.(
      next !== null && limits !== undefined && isFullDomain(next, limits) ? null : next,
    );
  };

  const chart = (
    <ChartContainer height={height}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={CHART_GRID_STROKE} vertical={false} />
        {categoryKey === undefined ? (
          <TimeAxis
            locale={locale}
            pad={pad}
            resolution={resolution}
            span={(shown ?? full ?? [0, 0])[1] - (shown ?? full ?? [0, 0])[0]}
            ticks={visibleTicks}
            zoom={shown}
          />
        ) : (
          <CategoryAxis dataKey={categoryKey} />
        )}
        {axes.map((axis) => (
          <ValueAxis
            domain={axisDomain(axis, series, axisData, axisFromZero, bands)}
            hidden={axis.hidden}
            integers={axis.integers}
            id={axis.id}
            key={axis.id}
            orientation={axis.orientation}
            color={axes.length > 1 ? axis.color : undefined}
            slot={axes.length > 1 ? axis.slot : undefined}
            ticks={axisTicks(axis, series, axisData, axisFromZero, bands)}
            title={axis.title}
            unit={axis.unit}
            unitLabel={axis.unitLabel}
          />
        ))}
        <ChartTooltip
          locale={locale}
          resolution={resolution}
          showTextLabel={categoryKey !== undefined}
          units={units}
          valueStyles={valueStyles}
        />
        {legend && <ChartLegend />}
        {series.map((entry) => renderSeries(entry, entry.axisId ?? "value"))}
        {(categoryKey === undefined ? events : []).map((event) =>
          isChartRangeEvent(event) ? (
            <EventRange
              from={event.from}
              key={event.id}
              ifOverflow={shown === undefined ? undefined : "hidden"}
              label={event.label}
              tone={event.tone}
              to={event.to}
              yAxisId={firstAxis}
            />
          ) : (
            <EventLine at={event.at} key={event.id} label={event.label} yAxisId={firstAxis} />
          ),
        )}
        {bands.map((band) => (
          <Band
            color={band.color}
            end={categoryKey === undefined ? band.end : undefined}
            from={band.from}
            ifOverflow={shown === undefined ? undefined : "hidden"}
            key={band.id}
            label={band.label}
            start={categoryKey === undefined ? band.start : undefined}
            to={band.to}
            yAxisId={band.axisId ?? "value"}
          />
        ))}
        {thresholds.map((threshold) => (
          <Threshold
            key={threshold.id}
            kind={threshold.kind}
            label={threshold.label}
            value={threshold.value}
            yAxisId={threshold.axisId ?? "value"}
          />
        ))}
        {zoomable && (
          <ZoomLayer
            limits={limits}
            onCommit={commit}
            onLive={setLive}
            shown={shown ?? limits.full}
          />
        )}
      </ComposedChart>
    </ChartContainer>
  );

  if (!zoomable) {
    return chart;
  }

  const current = shown ?? limits.full;
  const middle = valueAt(current, 0.5);
  const step = (current[1] - current[0]) * STEP;
  const tolerance = (limits.full[1] - limits.full[0]) * 1e-9;
  return (
    <div
      className={styles.root}
      data-zoomed={shown === undefined ? undefined : ""}
      style={typeof height === "string" ? { blockSize: "100%" } : undefined}
    >
      <ZoomControls
        canPanLeft={current[0] > limits.full[0] + tolerance}
        canPanRight={current[1] < limits.full[1] - tolerance}
        canZoomIn={current[1] - current[0] > limits.minSpan + tolerance}
        onPanLeft={() => commit(panBy(current, limits, -step))}
        onPanRight={() => commit(panBy(current, limits, step))}
        onReset={() => commit(null)}
        onZoomIn={() => commit(zoomAround(current, limits, STEP, middle))}
        onZoomOut={() => commit(zoomAround(current, limits, 1 / STEP, middle))}
        texts={zoomTexts}
        zoomed={shown !== undefined}
      />
      <div className={styles.chart}>{chart}</div>
    </div>
  );
}
