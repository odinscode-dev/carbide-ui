import type { HTMLAttributes } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./CellStrip.module.css";

export type CellStripTone = "ok" | "warning" | "alarm" | "neutral";

export interface CellStripCell {
  /** What the cell stands for and says: "Mon 26.10.: 94 % in band". */
  label: string;
  tone: CellStripTone;
}

export interface CellStripProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the strip for assistive tech. */
  label: string;
  cells: readonly CellStripCell[];
}

/** A row of equal cells in signal colours: how each day of a week went. */
export function CellStrip({ label, cells, className, style, ...rest }: CellStripProps) {
  return (
    <div
      {...rest}
      aria-label={`${label}. ${cells.map((cell) => cell.label).join(", ")}`}
      className={joinClassNames(styles.root, className)}
      role="img"
      style={{ ...style, gridTemplateColumns: `repeat(${Math.max(cells.length, 1)}, 1fr)` }}
    >
      {cells.map((cell, i) => (
        <span
          className={styles.cell}
          data-tone={cell.tone}
          // biome-ignore lint/suspicious/noArrayIndexKey: the cells are fixed positions
          key={i}
          title={cell.label}
        />
      ))}
    </div>
  );
}
