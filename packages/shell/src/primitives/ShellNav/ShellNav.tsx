import { ScrollArea, t } from "@odinscode/carbide-core";
import type { CSSProperties, ReactNode } from "react";
import styles from "./ShellNav.module.css";

export interface ShellNavItem {
  id: string;
  label: string;
  icon?: ReactNode | undefined;
  description?: string | undefined;
}

export interface ShellNavGroup {
  label?: string | undefined;
  items: readonly ShellNavItem[];

  accent?: string | undefined;
}

export type ShellNavLayout = "list" | "grid";

export interface ShellNavProps {
  groups: readonly ShellNavGroup[];

  active?: string | undefined;
  onNavigate: (id: string) => void;

  label?: string | undefined;

  layout?: ShellNavLayout | undefined;

  logo?: ReactNode | undefined;

  footerGroups?: readonly ShellNavGroup[] | undefined;
}

// A style object that also carries a custom property for the stylesheet.
type CustomProperties = CSSProperties & Record<`--${string}`, string>;

function accentStyle(accent: string | undefined): CustomProperties | undefined {
  return accent === undefined ? undefined : { "--shell-nav-accent": accent };
}

function renderGroup(
  group: ShellNavGroup,
  key: string,
  active: string | undefined,
  onNavigate: (id: string) => void,
) {
  return (
    <div className={styles.group} key={key}>
      {group.label !== undefined && <div className={styles.groupLabel}>{group.label}</div>}
      <ul className={styles.list} style={accentStyle(group.accent)}>
        {group.items.map((item) => (
          <li key={item.id}>
            <button
              aria-current={item.id === active ? "page" : undefined}
              className={styles.item}
              data-active={item.id === active ? "" : undefined}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.icon !== undefined && (
                <span aria-hidden="true" className={styles.icon}>
                  {item.icon}
                </span>
              )}
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                {item.description !== undefined && (
                  <span className={styles.itemDescription}>{item.description}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ShellNav({
  groups,
  active,
  onNavigate,
  label,
  layout = "list",
  logo,
  footerGroups,
}: ShellNavProps) {
  return (
    <nav aria-label={label ?? t("shellNav.label")} className={styles.root} data-layout={layout}>
      {logo !== undefined && <div className={styles.logo}>{logo}</div>}
      <ScrollArea className={styles.scroll}>
        {groups.map((group, index) =>
          renderGroup(group, group.label ?? `group-${index}`, active, onNavigate),
        )}
      </ScrollArea>
      {footerGroups !== undefined && footerGroups.length > 0 && (
        <div className={styles.footer}>
          {footerGroups.map((group, index) =>
            renderGroup(group, group.label ?? `footer-group-${index}`, active, onNavigate),
          )}
        </div>
      )}
    </nav>
  );
}
