import { Button, t } from "@odinscode/carbide-core";
import type { ReactNode, Ref } from "react";
import styles from "./ShellHeader.module.css";

export interface ShellHeaderProps {
  title: ReactNode;

  context?: ReactNode | undefined;

  /**
   * Live status between the title and the actions: the figures an operator
   * keeps an eye on all day (open tasks, plant health, the latest alarm).
   * Takes the width the title leaves; the title shrinks to its content.
   */
  status?: ReactNode | undefined;

  actions?: ReactNode | undefined;

  onMenuClick?: (() => void) | undefined;

  menuOpen?: boolean | undefined;

  menuText?: string | undefined;

  menuButtonRef?: Ref<HTMLButtonElement> | undefined;
}

export function ShellHeader({
  title,
  context,
  status,
  actions,
  onMenuClick,
  menuOpen = false,
  menuText,
  menuButtonRef,
}: ShellHeaderProps) {
  return (
    <header
      className={styles.root}
      data-actions={actions === undefined ? undefined : ""}
      data-context={context === undefined ? undefined : ""}
      data-menu={onMenuClick === undefined ? undefined : ""}
      data-status={status === undefined ? undefined : ""}
    >
      {onMenuClick !== undefined && (
        <Button
          aria-expanded={menuOpen}
          aria-label={menuText ?? t("shellHeader.menu")}
          icon={<MenuIcon />}
          onClick={onMenuClick}
          ref={menuButtonRef}
          variant="ghost"
        />
      )}
      <div className={styles.titles}>
        <div className={styles.title} title={typeof title === "string" ? title : undefined}>
          {title}
        </div>
        {context !== undefined && (
          <div className={styles.context} title={typeof context === "string" ? context : undefined}>
            {context}
          </div>
        )}
      </div>
      {status !== undefined && <div className={styles.status}>{status}</div>}
      {actions !== undefined && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className={styles.menuIcon} viewBox="0 0 16 16">
      <path
        d="M2 4h12M2 8h12M2 12h12"
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
