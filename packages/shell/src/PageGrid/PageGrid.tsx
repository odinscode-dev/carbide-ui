import type { HTMLAttributes, ReactNode } from "react";
import styles from "./PageGrid.module.css";

export interface PageGridProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Fill the height of the main area (AdminShell `mainLayout="fill"`): the
   * rows share it and the containers scroll their own content. Without it the
   * grid flows and the main area scrolls.
   */
  fill?: boolean | undefined;
  children?: ReactNode | undefined;
}

/**
 * The page grid of the AdminShell's main area: 16 columns with a 32px gutter
 * (72px columns at 1664px). The 16px outer margin comes from ShellMain itself.
 * Children span columns through PageContainer.
 */
export function PageGrid({ fill = false, children, ...rest }: PageGridProps) {
  return (
    <div {...rest} className={styles.grid} data-fill={fill ? "" : undefined}>
      {children}
    </div>
  );
}
