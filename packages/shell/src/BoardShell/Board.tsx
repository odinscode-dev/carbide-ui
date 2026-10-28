import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Board.module.css";

export const BOARD_COLUMNS = 24;
export const BOARD_ROWS = 20;

export interface BoardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode | undefined;
}

export function Board({ children, ...rest }: BoardProps) {
  return (
    <div {...rest} className={styles.root}>
      {children}
    </div>
  );
}
