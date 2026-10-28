import type { HTMLAttributes, ReactNode } from "react";
import styles from "./BoardWidget.module.css";

export type BoardWidgetState = "info" | "success" | "warn" | "critical" | "error";

export interface BoardWidgetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "style"> {
  x: number;

  y: number;

  w: number;

  h: number;

  state?: BoardWidgetState | undefined;
  children?: ReactNode | undefined;
}

export function BoardWidget({ x, y, w, h, state, children, ...rest }: BoardWidgetProps) {
  return (
    <div
      {...rest}
      className={styles.root}
      data-state={state}
      style={{ gridColumn: `${x} / span ${w}`, gridRow: `${y} / span ${h}` }}
    >
      {state !== undefined && <div aria-hidden="true" className={styles.bar} />}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
