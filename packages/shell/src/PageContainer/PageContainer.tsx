import type { HTMLAttributes, ReactNode } from "react";
import styles from "./PageContainer.module.css";

export interface PageContainerProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Columns of the 16-column PageGrid this container spans (1 to 16). */
  span: number;
  /**
   * A fixed height, for content that needs one in a flowing grid (a DataGrid
   * virtualises its rows and has no height of its own). In a filling grid the
   * row gives the height.
   */
  blockSize?: string | undefined;
  children?: ReactNode | undefined;
}

/** An opaque surface on the page grid: the first layer with a hairline, the content inset. */
export function PageContainer({ span, blockSize, style, children, ...rest }: PageContainerProps) {
  return (
    <section
      {...rest}
      className={styles.root}
      style={{ ...style, gridColumn: `span ${span}`, blockSize }}
    >
      <div className={styles.body}>{children}</div>
    </section>
  );
}
