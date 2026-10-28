import { ScrollArea } from "@odinscode/carbide-core";
import type { ReactNode } from "react";
import { ShellHeader } from "../primitives/ShellHeader/index.js";
import styles from "./FieldShell.module.css";
import type { FieldTab } from "./FieldTabBar.js";
import { FieldTabBar } from "./FieldTabBar.js";

export interface FieldShellProps {
  title: ReactNode;

  context?: ReactNode | undefined;

  actions?: ReactNode | undefined;

  tabs: readonly FieldTab[];

  activeTab: string;
  onTabChange: (id: string) => void;

  tabBarLabel?: string | undefined;

  children?: ReactNode | undefined;
}

export function FieldShell({
  title,
  context,
  actions,
  tabs,
  activeTab,
  onTabChange,
  tabBarLabel,
  children,
}: FieldShellProps) {
  return (
    <div className={styles.root} data-density="large">
      <ShellHeader actions={actions} context={context} title={title} />
      <ScrollArea className={styles.scroll}>
        <div className={styles.content}>{children}</div>
      </ScrollArea>
      <FieldTabBar active={activeTab} label={tabBarLabel} onChange={onTabChange} tabs={tabs} />
    </div>
  );
}
