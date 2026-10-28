import type { HTMLAttributes } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./StatusLight.module.css";

export type StatusLightTone = "ok" | "warning" | "alarm" | "neutral" | "off";

export interface StatusLightProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** What the light says, e.g. "Sensor online"; its accessible name and tooltip. */
  label: string;
  tone: StatusLightTone;
  /** A ring pulses out of the light: the value behind it is live. */
  pulse?: boolean | undefined;
}

/** A small lamp in a signal colour that glows on its surface. */
export function StatusLight({ label, tone, pulse = false, className, ...rest }: StatusLightProps) {
  return (
    <span
      title={label}
      {...rest}
      aria-label={label}
      className={joinClassNames(styles.root, className)}
      data-pulse={pulse ? "" : undefined}
      data-tone={tone}
      role="img"
    />
  );
}
