import { ScrollArea, t } from "@odinscode/carbide-core";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ShellPanel.module.css";

export interface ShellPanelProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  label?: string | undefined;
  children?: ReactNode | undefined;
}

export function ShellPanel({ label, children, ...rest }: ShellPanelProps) {
  return (
    <aside {...rest} aria-label={label ?? t("shellPanel.label")} className={styles.root}>
      <ScrollArea className={styles.scroll}>
        <div className={styles.content}>{children}</div>
      </ScrollArea>
    </aside>
  );
}
