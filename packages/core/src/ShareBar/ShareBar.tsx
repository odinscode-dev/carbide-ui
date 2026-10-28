import type { HTMLAttributes } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./ShareBar.module.css";

export interface ShareBarPart {
  label: string;
  /** Any non-negative weight; the parts are drawn as shares of their sum. */
  value: number;
  /** Any CSS colour. */
  color: string;
}

export interface ShareBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the bar for assistive tech; the parts and their shares follow. */
  label: string;
  parts: readonly ShareBarPart[];
}

/** Each part's share of the whole, in percent; all zero when the sum is. */
export function shares(parts: readonly ShareBarPart[]): number[] {
  const sum = parts.reduce((total, part) => total + Math.max(part.value, 0), 0);
  return parts.map((part) => (sum > 0 ? (Math.max(part.value, 0) / sum) * 100 : 0));
}

/** The parts of a whole side by side in one bar: what a day was spent on. */
export function ShareBar({ label, parts, className, ...rest }: ShareBarProps) {
  const percent = shares(parts);
  const text = parts.map((part, i) => `${part.label} ${Math.round(percent[i] ?? 0)} %`).join(", ");
  return (
    <div
      {...rest}
      aria-label={`${label}: ${text}`}
      className={joinClassNames(styles.root, className)}
      role="img"
    >
      {parts.map((part, i) => (
        <span
          className={styles.part}
          // biome-ignore lint/suspicious/noArrayIndexKey: parts may repeat a label, their order is fixed
          key={i}
          style={{ inlineSize: `${percent[i] ?? 0}%`, background: part.color }}
          title={`${part.label} ${Math.round(percent[i] ?? 0)} %`}
        />
      ))}
    </div>
  );
}
