import type { CSSProperties, HTMLAttributes } from "react";
import { formatNumber } from "../format/number.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./MiniBars.module.css";

export interface MiniBarsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the bars for assistive tech. */
  label: string;
  /** One bar per value, null for a slot without data. */
  values: readonly (number | null)[];
  /** Names each slot ("14:00"), for the bar's tooltip and the readout. */
  slots?: readonly string[] | undefined;
  /** The value of a full bar; default the largest value. */
  max?: number | undefined;
  /** Any CSS colour; default the accent. */
  color?: string | undefined;
  format?: ((value: number) => string) | undefined;
}

interface MiniBarsCssVars extends CSSProperties {
  "--carbide-minibars-color"?: string;
}

/**
 * Counts per slot as a strip of bars without axes: pulses per hour, events
 * per day. Fills the height of its container.
 */
export function MiniBars({
  label,
  values,
  slots,
  max,
  color,
  format = (v) => formatNumber(v),
  className,
  style,
  ...rest
}: MiniBarsProps) {
  const top = max ?? Math.max(0, ...values.map((value) => value ?? 0));
  const vars: MiniBarsCssVars | undefined =
    color === undefined ? style : { ...style, "--carbide-minibars-color": color };
  const name = (i: number) => slots?.[i] ?? String(i + 1);
  const readout = values
    .map((value, i) => `${name(i)}: ${value === null ? "-" : format(value)}`)
    .join(", ");
  return (
    <div
      {...rest}
      aria-label={`${label}. ${readout}`}
      className={joinClassNames(styles.root, className)}
      role="img"
      style={vars}
    >
      {values.map((value, i) => (
        <span
          className={styles.bar}
          data-empty={value === null || value <= 0 ? "" : undefined}
          // biome-ignore lint/suspicious/noArrayIndexKey: the slots are fixed positions
          key={i}
          style={{
            blockSize: `${top > 0 && value !== null ? (Math.min(value, top) / top) * 100 : 0}%`,
          }}
          title={`${name(i)}: ${value === null ? "-" : format(value)}`}
        />
      ))}
    </div>
  );
}
