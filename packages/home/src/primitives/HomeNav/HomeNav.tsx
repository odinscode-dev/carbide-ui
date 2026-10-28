import { Dialog, ScrollArea, Tooltip, t } from "@odinscode/carbide-core";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
import { useRef, useState } from "react";
import styles from "./HomeNav.module.css";

export interface HomeNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export type HomeNavGroupColor = "blue" | "orange" | "green" | "yellow" | "slate";

export interface HomeNavGroup {
  label: string;
  items: readonly HomeNavItem[];

  color?: HomeNavGroupColor | undefined;
}

export type HomeNavActionTone = "neutral" | "success" | "warn" | "error";

/**
 * An icon button in the footer of the rail, above the logout button —
 * for app-wide state the user flips regardless of the page they are on
 * (an encrypted area to lock and unlock, a maintenance mode). Not a
 * navigation entry: it neither has a route nor an active state.
 */
export interface HomeNavAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Colors the icon in the matching status role; `neutral` inherits. */
  tone?: HomeNavActionTone | undefined;
  disabled?: boolean | undefined;
}

export interface HomeNavProps {
  groups: readonly HomeNavGroup[];

  active?: string | undefined;
  onNavigate: (id: string) => void;

  label?: string | undefined;

  container?: RefObject<HTMLElement | null> | undefined;

  logo?: ReactNode | undefined;

  actions?: readonly HomeNavAction[] | undefined;

  onLogout?: (() => void) | undefined;

  logoutLabel?: string | undefined;

  logoutConfirmTitle?: string | undefined;

  logoutConfirmMessage?: string | undefined;

  logoutConfirmText?: string | undefined;

  logoutCancelText?: string | undefined;
}

export function HomeNav({
  groups,
  active,
  onNavigate,
  label,
  container,
  logo,
  actions,
  onLogout,
  logoutLabel,
  logoutConfirmTitle,
  logoutConfirmMessage,
  logoutConfirmText,
  logoutCancelText,
}: HomeNavProps) {
  const hasActions = actions !== undefined && actions.length > 0;
  const navRef = useRef<HTMLElement>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = Array.from(
      navRef.current?.querySelectorAll<HTMLButtonElement>(`.${styles.item}`) ?? [],
    );
    const active = document.activeElement;
    const currentIndex = active instanceof HTMLButtonElement ? items.indexOf(active) : -1;
    if (currentIndex === -1) return;
    event.preventDefault();
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + delta + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  return (
    <nav
      aria-label={label ?? t("homeNav.label")}
      className={styles.root}
      onKeyDown={handleKeyDown}
      ref={navRef}
    >
      <ScrollArea className={styles.scroll}>
        <div className={styles.list}>
          {logo !== undefined && (
            <>
              <div className={styles.logo}>{logo}</div>
              <div aria-hidden="true" className={styles.logoSpacer} />
            </>
          )}
          {groups.map((group) => (
            <fieldset
              aria-label={group.label}
              className={styles.group}
              data-color={group.color}
              key={group.label}
            >
              <ul className={styles.groupList}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Tooltip container={container} content={item.label} placement="right">
                      <button
                        aria-current={item.id === active ? "page" : undefined}
                        aria-label={item.label}
                        className={styles.item}
                        data-active={item.id === active ? "" : undefined}
                        onClick={() => onNavigate(item.id)}
                        type="button"
                      >
                        <span aria-hidden="true" className={styles.icon}>
                          {item.icon}
                        </span>
                      </button>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </fieldset>
          ))}
        </div>
      </ScrollArea>
      {(hasActions || onLogout !== undefined) && (
        <div className={styles.footer}>
          {hasActions && (
            <ul className={styles.actions}>
              {actions.map((action) => (
                <li key={action.id}>
                  <Tooltip container={container} content={action.label} placement="right">
                    <button
                      aria-label={action.label}
                      className={`${styles.item} ${styles.actionButton}`}
                      data-tone={action.tone ?? "neutral"}
                      disabled={action.disabled}
                      onClick={action.onClick}
                      type="button"
                    >
                      <span aria-hidden="true" className={styles.icon}>
                        {action.icon}
                      </span>
                    </button>
                  </Tooltip>
                </li>
              ))}
            </ul>
          )}
          {onLogout !== undefined && (
            <>
              <Tooltip
                container={container}
                content={logoutLabel ?? t("homeNav.logout.label")}
                placement="right"
              >
                <button
                  aria-label={logoutLabel ?? t("homeNav.logout.label")}
                  className={`${styles.item} ${styles.logoutButton}`}
                  onClick={() => setLogoutConfirmOpen(true)}
                  type="button"
                >
                  <span aria-hidden="true" className={styles.icon}>
                    <LogoutIcon />
                  </span>
                </button>
              </Tooltip>
              <Dialog
                container={container}
                danger
                cancelText={logoutCancelText}
                confirmText={logoutConfirmText ?? t("homeNav.logout.confirm")}
                message={logoutConfirmMessage ?? t("homeNav.logout.message")}
                onConfirm={onLogout}
                onOpenChange={setLogoutConfirmOpen}
                open={logoutConfirmOpen}
                title={logoutConfirmTitle ?? t("homeNav.logout.title")}
              />
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentcolor" strokeWidth="1.5" viewBox="0 0 16 16">
      <path d="M6.5 2H3.5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" strokeLinecap="round" />
      <path
        d="M6.5 8H14M14 8l-2.5-2.5M14 8l-2.5 2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
