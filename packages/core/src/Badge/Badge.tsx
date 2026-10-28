import type { HTMLAttributes, ReactNode } from "react";
import { formatNumber } from "../format/number.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Badge.module.css";

export type BadgeState =
  | "neutral"
  | "accent"
  | "success"
  | "warn"
  | "critical"
  | "error"
  | "manual";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  state?: BadgeState;

  count?: number;
  children?: ReactNode;
}

export function Badge({ state = "neutral", count, children, className, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-count={count === undefined ? undefined : ""}
      data-state={state}
    >
      {count === undefined ? children : formatNumber(count)}
    </span>
  );
}
