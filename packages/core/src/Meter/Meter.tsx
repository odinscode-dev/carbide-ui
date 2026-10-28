import type { CSSProperties, HTMLAttributes } from "react";
import { formatNumber } from "../format/number.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Meter.module.css";

export interface MeterMark {
  value: number;
  /** What the mark stands for ("minimum"); its tooltip. */
  label: string;
}

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the meter for assistive tech; it has no visible text of its own. */
  label: string;
  value: number;
  min?: number | undefined;
  max?: number | undefined;
  /** Lines across the track at fixed values: a minimum, a limit. */
  marks?: readonly MeterMark[] | undefined;
  /** Any CSS colour for the fill; default the accent. */
  color?: string | undefined;
  /** Turns the value into text for assistive tech. */
  format?: ((value: number) => string) | undefined;
}

interface MeterCssVars extends CSSProperties {
  "--carbide-meter-color"?: string;
}

// Share of the scale in percent, clamped to its ends.
export function meterShare(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }
  return ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
}

/**
 * How full something is, as a slim glowing bar: a level, a load, a share.
 * Smaller than ProgressBar and without text of its own, for tables and tiles.
 */
export function Meter({
  label,
  value,
  min = 0,
  max = 100,
  marks = [],
  color,
  format = (v) => formatNumber(v),
  className,
  style,
  ...rest
}: MeterProps) {
  const vars: MeterCssVars | undefined =
    color === undefined ? style : { ...style, "--carbide-meter-color": color };
  return (
    <div {...rest} className={joinClassNames(styles.root, className)} style={vars}>
      <meter
        aria-label={label}
        aria-valuetext={format(value)}
        className={styles.meter}
        max={max}
        min={min}
        value={value}
      />
      <span
        aria-hidden="true"
        className={styles.fill}
        style={{ inlineSize: `${meterShare(value, min, max)}%` }}
      />
      {marks.map((mark) => (
        <span
          aria-hidden="true"
          className={styles.mark}
          key={`${mark.label}-${mark.value}`}
          style={{ insetInlineStart: `${meterShare(mark.value, min, max)}%` }}
          title={`${mark.label} ${format(mark.value)}`}
        />
      ))}
    </div>
  );
}
