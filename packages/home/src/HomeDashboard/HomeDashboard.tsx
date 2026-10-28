import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./HomeDashboard.module.css";

export interface HomeDashboardItem {
  id: string;

  columnSpan?: number;

  rowSpan?: number;
  content: ReactNode;
}

export interface HomeDashboardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: readonly HomeDashboardItem[];
}

interface HomeDashboardItemStyle extends CSSProperties {
  "--carbide-dashboard-item-column-span": number;
  "--carbide-dashboard-item-row-span": number;
}

export function HomeDashboard({ items, ...rest }: HomeDashboardProps) {
  return (
    <div {...rest} className={styles.root}>
      {items.map(({ id, columnSpan = 1, rowSpan = 1, content }) => {
        const style: HomeDashboardItemStyle = {
          "--carbide-dashboard-item-column-span": columnSpan,
          "--carbide-dashboard-item-row-span": rowSpan,
        };
        return (
          <div className={styles.item} data-home-dashboard-item-id={id} key={id} style={style}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
