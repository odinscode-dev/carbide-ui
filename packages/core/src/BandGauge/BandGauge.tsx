import type { CSSProperties, HTMLAttributes } from "react";
import { useId } from "react";
import { formatNumber } from "../format/number.js";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./BandGauge.module.css";

export type BandGaugeTone = "alarm" | "warning" | "ok" | "neutral";

/** One coloured stretch of the scale, e.g. the target band or the zones around it. */
export interface BandGaugeZone {
  from: number;
  to: number;
  tone: BandGaugeTone;
}

export interface BandGaugeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the gauge; shown above the scale unless `hideLabel`, always its accessible name. */
  label: string;
  hideLabel?: boolean | undefined;

  /** The ends of the scale. */
  min: number;
  max: number;

  /** The reading; null when there is none (sensor gone), drawn without a marker. */
  value: number | null;

  /** Coloured stretches in any order; what they leave uncovered stays neutral. */
  zones: readonly BandGaugeZone[];

  /** A second reading drawn as a hollow marker, e.g. a forecast. */
  secondary?: number | undefined;
  /** What the second marker stands for; default from the catalog ("Forecast"). */
  secondaryLabel?: string | undefined;

  /** Values labelled below the scale, e.g. the band's limits. */
  ticks?: readonly number[] | undefined;

  /** Turns a value into text for ticks and the accessible reading. */
  format?: ((value: number) => string) | undefined;
}

// Position of a value on the scale in percent, clamped to its ends.
export function gaugePosition(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }
  const share = (Math.min(Math.max(value, min), max) - min) / (max - min);
  return share * 100;
}

/**
 * A reading against coloured zones on a horizontal scale: where a value
 * stands relative to a target band, and where it is heading.
 */
export function BandGauge({
  label,
  hideLabel = false,
  min,
  max,
  value,
  zones,
  secondary,
  secondaryLabel,
  ticks = [],
  format = (v) => formatNumber(v),
  className,
  ...rest
}: BandGaugeProps) {
  const labelId = useId();
  const sorted = [...zones].sort((a, b) => a.from - b.from);
  const reading = value === null ? t("bandGauge.noValue") : format(value);
  const second = secondaryLabel ?? t("bandGauge.secondary");
  const valueText =
    secondary === undefined ? reading : `${reading}, ${second} ${format(secondary)}`;

  return (
    <div
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-empty={value === null ? "" : undefined}
    >
      <span className={styles.label} data-hidden={hideLabel ? "" : undefined} id={labelId}>
        {label}
      </span>
      {/* The native meter carries the semantics; the drawing beside it is decoration. */}
      <meter
        aria-labelledby={labelId}
        aria-valuetext={valueText}
        className={styles.meter}
        max={max}
        min={min}
        {...(value === null ? {} : { value })}
      />
      <div aria-hidden="true" className={styles.scale}>
        <div className={styles.track}>
          {sorted.map((zone) => (
            <span
              className={styles.zone}
              data-tone={zone.tone}
              key={`${zone.from}-${zone.to}`}
              style={span(zone.from, zone.to, min, max)}
            />
          ))}
        </div>
        {value === null ? null : <span className={styles.marker} style={at(value, min, max)} />}
        {secondary === undefined ? null : (
          <span className={styles.secondary} style={at(secondary, min, max)} title={second} />
        )}
      </div>
      {ticks.length === 0 ? null : (
        <div aria-hidden="true" className={styles.ticks}>
          {ticks.map((tick) => (
            <span className={styles.tick} key={tick} style={at(tick, min, max)}>
              {format(tick)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function at(value: number, min: number, max: number): CSSProperties {
  return { insetInlineStart: `${gaugePosition(value, min, max)}%` };
}

function span(from: number, to: number, min: number, max: number): CSSProperties {
  const start = gaugePosition(from, min, max);
  return { insetInlineStart: `${start}%`, inlineSize: `${gaugePosition(to, min, max) - start}%` };
}
