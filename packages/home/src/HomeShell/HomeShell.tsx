import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { HomeMain } from "../primitives/HomeMain/index.js";
import type { HomeNavAction, HomeNavGroup } from "../primitives/HomeNav/index.js";
import { HomeNav } from "../primitives/HomeNav/index.js";
import styles from "./HomeShell.module.css";

export interface HomeShellProps {
  navGroups: readonly HomeNavGroup[];

  activeNavItem?: string | undefined;

  onNavigate: (id: string) => void;

  navLabel?: string | undefined;

  theme?: "light" | "dark" | undefined;

  density?: "compact" | "dense" | "large" | undefined;

  /**
   * `carbon` (default) is the look every app has today. `home` switches to
   * the friendly home surface: flat green-tinted ground, round cards, round
   * controls, no glass. It changes tokens only, so nothing else moves.
   */
  surface?: "carbon" | "home" | undefined;

  logo?: ReactNode | undefined;

  /** Icon buttons in the rail's footer, above logout — see `HomeNavAction`. */
  navActions?: readonly HomeNavAction[] | undefined;

  onLogout?: (() => void) | undefined;

  logoutLabel?: string | undefined;

  logoutConfirmTitle?: string | undefined;

  logoutConfirmMessage?: string | undefined;

  logoutConfirmText?: string | undefined;

  logoutCancelText?: string | undefined;

  children?: ReactNode | undefined;
}

export function HomeShell({
  navGroups,
  activeNavItem,
  onNavigate,
  navLabel,
  theme,
  density,
  surface,
  logo,
  navActions,
  onLogout,
  logoutLabel,
  logoutConfirmTitle,
  logoutConfirmMessage,
  logoutConfirmText,
  logoutCancelText,
  children,
}: HomeShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const home = surface === "home";

  // Select, Dropdown, DatePicker and other overlays render in a portal under
  // <body>, outside this root. The document element carries the surface too,
  // so they read the same tokens, the way an app already sets `data-theme`
  // there.
  useEffect(() => {
    if (!home) {
      return;
    }
    const root = document.documentElement;
    const before = root.getAttribute("data-surface");
    root.setAttribute("data-surface", "home");
    return () => {
      if (before === null) {
        root.removeAttribute("data-surface");
      } else {
        root.setAttribute("data-surface", before);
      }
    };
  }, [home]);

  return (
    <div
      className={styles.root}
      data-density={density}
      data-surface={home ? "home" : undefined}
      data-theme={theme}
      ref={rootRef}
    >
      <HomeNav
        actions={navActions}
        active={activeNavItem}
        container={rootRef}
        groups={navGroups}
        label={navLabel}
        logo={logo}
        logoutConfirmMessage={logoutConfirmMessage}
        logoutCancelText={logoutCancelText}
        logoutConfirmText={logoutConfirmText}
        logoutConfirmTitle={logoutConfirmTitle}
        logoutLabel={logoutLabel}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />
      <HomeMain>{children}</HomeMain>
    </div>
  );
}
