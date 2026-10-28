import { Tooltip } from "recharts";
import type { Unit } from "../format/quantities.js";
import { CHART_AXIS_STROKE } from "./ChartContainer.js";
import styles from "./ChartTooltip.module.css";
import type { ChartResolution } from "./resolution.js";
import {
  formatTooltipLabel,
  formatTooltipRange,
  formatTooltipValue,
  type TooltipValueStyle,
} from "./tooltipFormat.js";

export interface ChartTooltipProps {
  units?: Readonly<Record<string, Unit>> | undefined;
  /** By series name: a custom number format and/or free unit text; wins over `units`. */
  valueStyles?: Readonly<Record<string, TooltipValueStyle>> | undefined;
  /** What the x value of the hovered point stands for; a day shows the date only. */
  resolution?: ChartResolution | undefined;
  /** BCP 47 tag for the label; omitted, the browser language. */
  locale?: string | undefined;
  /** A text label (a category) is shown on top like a moment; without it only numbers are. */
  showTextLabel?: boolean | undefined;
}

// What recharts hands a custom tooltip, typed as loosely as we read it so
// the content stays a plain function of the payload.
interface TooltipItem {
  name?: unknown;
  value?: unknown;
  color?: string | undefined;
}

interface TooltipContentProps {
  active?: boolean | undefined;
  payload?: readonly TooltipItem[] | undefined;
  label?: unknown;
  units: Readonly<Record<string, Unit>>;
  valueStyles: Readonly<Record<string, TooltipValueStyle>>;
  resolution: ChartResolution;
  locale: string | undefined;
  showTextLabel: boolean;
}

// The tooltip as a small popover: the moment on top, then one row per
// series -- its colour, its name, its reading in mono -- on the same
// surface, hairline and shadow as every other floating card, so a chart
// speaks the way the rest of the interface does.
function ChartTooltipContent({
  active,
  payload,
  label,
  units,
  valueStyles,
  resolution,
  locale,
  showTextLabel,
}: TooltipContentProps) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }
  return (
    <div className={styles.content}>
      {typeof label === "number" && (
        <div className={styles.label}>{formatTooltipLabel(label, resolution, locale)}</div>
      )}
      {showTextLabel && typeof label === "string" && label !== "" && (
        <div className={styles.label}>{label}</div>
      )}
      <div className={styles.rows}>
        {payload.map((item) => {
          const name = String(item.name ?? "");
          const pair = rangeOf(item.value);
          const value = typeof item.value === "number" ? item.value : Number(item.value);
          return (
            <div className={styles.row} key={name}>
              <span className={styles.swatch} style={{ background: item.color }} />
              <span className={styles.name}>{name}</span>
              <span className={styles.value}>
                {pair !== undefined
                  ? formatTooltipRange(pair[0], pair[1], name, units, valueStyles)
                  : Number.isNaN(value)
                    ? String(item.value ?? "")
                    : formatTooltipValue(value, name, units, valueStyles)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// The value of a range series: a pair of finite numbers, else undefined.
function rangeOf(value: unknown): [number, number] | undefined {
  if (!Array.isArray(value) || value.length !== 2) {
    return undefined;
  }
  const [low, high]: unknown[] = value;
  return typeof low === "number" &&
    typeof high === "number" &&
    Number.isFinite(low) &&
    Number.isFinite(high)
    ? [low, high]
    : undefined;
}

export function ChartTooltip({
  units = {},
  valueStyles = {},
  resolution = "time",
  locale,
  showTextLabel = false,
}: ChartTooltipProps) {
  return (
    <Tooltip
      content={(props) => (
        <ChartTooltipContent
          {...props}
          locale={locale}
          resolution={resolution}
          showTextLabel={showTextLabel}
          units={units}
          valueStyles={valueStyles}
        />
      )}
      cursor={{ stroke: CHART_AXIS_STROKE, fill: CHART_AXIS_STROKE, fillOpacity: 0.12 }}
      isAnimationActive={false}
      wrapperStyle={{ outline: "none", zIndex: "var(--carbide-z-dropdown)" }}
    />
  );
}
