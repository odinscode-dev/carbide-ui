import type { HTMLAttributes, ReactNode } from "react";
import { IconChip } from "../IconChip/IconChip.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./StatusChip.module.css";

export type StatusChipTone = "neutral" | "success" | "warn" | "error";

export interface StatusChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The icon in a tinted chip at the start; see IconChip. */
  icon?: ReactNode | undefined;
  /** Colour of the icon chip; default the text colour. */
  color?: string | undefined;
  /** The figure, set in the mono font: "25.5 °C". */
  value: ReactNode;
  /** A few words after the value: "in band", "until 20:00". */
  caption?: ReactNode | undefined;
  tone?: StatusChipTone | undefined;
}

/**
 * One figure with its icon and a short caption, in a small sunken field:
 * the key readings of a page in its header bar.
 */
export function StatusChip({
  icon,
  color,
  value,
  caption,
  tone = "neutral",
  className,
  ...rest
}: StatusChipProps) {
  return (
    <span {...rest} className={joinClassNames(styles.root, className)} data-tone={tone}>
      {icon === undefined ? null : <IconChip color={color} icon={icon} size="sm" />}
      <span className={styles.value}>{value}</span>
      {caption === undefined ? null : <span className={styles.caption}>{caption}</span>}
    </span>
  );
}
