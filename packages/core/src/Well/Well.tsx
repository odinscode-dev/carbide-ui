import type { HTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Well.module.css";

export interface WellProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** A caption line above the content, small and quiet. */
  title?: ReactNode | undefined;
  /** A figure at the end of the caption line, in the mono font. */
  value?: ReactNode | undefined;
  children?: ReactNode;
}

/**
 * A field sunk into its surface, for a sparkline, a small chart or a time
 * line inside a tile: sets it apart from the text around it.
 */
export function Well({ title, value, className, children, ...rest }: WellProps) {
  const head = title !== undefined || value !== undefined;
  return (
    <div {...rest} className={joinClassNames(styles.root, className)}>
      {head ? (
        <div className={styles.head}>
          <span>{title}</span>
          {value === undefined ? null : <span className={styles.value}>{value}</span>}
        </div>
      ) : null}
      {children}
    </div>
  );
}
