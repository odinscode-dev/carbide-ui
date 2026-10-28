import { Splitter, useSplitter } from "@ark-ui/react/splitter";
import type { ReactNode } from "react";
import { ShellHeader } from "../primitives/ShellHeader/index.js";
import { ShellMain, type ShellMainLayout } from "../primitives/ShellMain/index.js";
import type { ShellNavGroup } from "../primitives/ShellNav/index.js";
import { ShellNav } from "../primitives/ShellNav/index.js";
import { ShellPanel } from "../primitives/ShellPanel/index.js";
import styles from "./AdminShell.module.css";

const MAIN_MIN_SIZE = 30;
const PANEL_MIN_SIZE = 15;
const DEFAULT_PANEL_SIZE = 25;

const PANELS = [
  { id: "main", minSize: MAIN_MIN_SIZE },
  { id: "panel", minSize: PANEL_MIN_SIZE, collapsible: true, collapsedSize: 0 },
];

function startSizes(panelSize: number): number[] {
  const wanted = Number.isFinite(panelSize) ? panelSize : DEFAULT_PANEL_SIZE;
  const panel = Math.min(Math.max(wanted, PANEL_MIN_SIZE), 100 - MAIN_MIN_SIZE);
  return [100 - panel, panel];
}

export interface AdminShellProps {
  title: ReactNode;

  context?: ReactNode | undefined;

  /** Live status strip between the title and the actions, see ShellHeader. */
  status?: ReactNode | undefined;

  actions?: ReactNode | undefined;

  /** Brand mark or product name above the navigation, see ShellNav. */
  navLogo?: ReactNode | undefined;

  navGroups: readonly ShellNavGroup[];

  /** Groups pinned to the bottom of the navigation column, see ShellNav. */
  navFooterGroups?: readonly ShellNavGroup[] | undefined;

  activeNavItem?: string | undefined;

  onNavigate: (id: string) => void;

  /** How the main area holds its content, see ShellMain. */
  mainLayout?: ShellMainLayout | undefined;

  panel?: ReactNode | undefined;

  /**
   * Starting width of the side panel, in percent of the area next to the
   * navigation column (default 25). Held to what the splitter allows: at
   * least 15, and at most what leaves the main area its 30. Applied whenever
   * the panel appears; the splitter handle takes over from there.
   */
  panelSize?: number | undefined;

  panelLabel?: string | undefined;

  children?: ReactNode | undefined;
}

export function AdminShell({
  title,
  context,
  status,
  actions,
  navLogo,
  navGroups,
  navFooterGroups,
  activeNavItem,
  onNavigate,
  mainLayout,
  panel,
  panelSize = DEFAULT_PANEL_SIZE,
  panelLabel,
  children,
}: AdminShellProps) {
  const splitter = useSplitter({ defaultSize: startSizes(panelSize), panels: PANELS });

  return (
    <div className={styles.root} data-density="compact">
      <ShellHeader actions={actions} context={context} status={status} title={title} />
      <div className={styles.body}>
        <ShellNav
          active={activeNavItem}
          footerGroups={navFooterGroups}
          groups={navGroups}
          logo={navLogo}
          onNavigate={onNavigate}
        />
        {panel === undefined ? (
          <div className={styles.mainOnly}>
            <ShellMain layout={mainLayout}>{children}</ShellMain>
          </div>
        ) : (
          <Splitter.RootProvider className={styles.splitter} value={splitter}>
            <Splitter.Panel className={styles.panel} id="main">
              <ShellMain layout={mainLayout}>{children}</ShellMain>
            </Splitter.Panel>
            <Splitter.ResizeTrigger className={styles.resizeTrigger} id="main:panel" />
            <Splitter.Panel className={styles.panel} id="panel">
              <ShellPanel label={panelLabel}>{panel}</ShellPanel>
            </Splitter.Panel>
          </Splitter.RootProvider>
        )}
      </div>
    </div>
  );
}
