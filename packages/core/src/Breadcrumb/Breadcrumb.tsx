import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import type { MouseEvent } from "react";
import { t } from "../i18n/t.js";
import { Link } from "../Link/Link.js";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;

  href?: string | undefined;
}

export interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];

  onFollow?:
    | ((item: BreadcrumbItem, index: number, event: MouseEvent<HTMLAnchorElement>) => void)
    | undefined;

  label?: string | undefined;

  moreLabel?: string | undefined;
}

const MAX_INLINE = 4;

const TRAILING_COUNT = 2;

interface Slot {
  item: BreadcrumbItem;

  index: number;
}

export function Breadcrumb({ items, onFollow, label, moreLabel }: BreadcrumbProps) {
  const last = items.length - 1;
  const collapsed = items.length > MAX_INLINE;
  const trailingStart = collapsed ? items.length - TRAILING_COUNT : 1;

  const leading: Slot[] = items.slice(0, 1).map((item) => ({ item, index: 0 }));
  const hiddenItems: Slot[] = collapsed
    ? items.slice(1, trailingStart).map((item, position) => ({ item, index: position + 1 }))
    : [];
  const trailingItems: Slot[] = items
    .slice(trailingStart)
    .map((item, position) => ({ item, index: position + trailingStart }));

  const renderItem = ({ item, index }: Slot) => (
    <li className={styles.item} key={index}>
      {item.href === undefined || index === last ? (
        <span
          aria-current={index === last ? "page" : undefined}
          className={styles.current}
          data-current={index === last ? "" : undefined}
        >
          {item.label}
        </span>
      ) : (
        <Link href={item.href} onClick={(event) => onFollow?.(item, index, event)}>
          {item.label}
        </Link>
      )}
    </li>
  );

  return (
    <nav
      aria-label={label ?? t("breadcrumb.label")}
      className={styles.root}
      data-collapsed={collapsed ? "" : undefined}
    >
      <ol className={styles.list}>
        {leading.map(renderItem)}
        {collapsed && (
          <li className={styles.item} key="ellipsis">
            <Menu.Root>
              <Menu.Trigger aria-label={moreLabel ?? t("breadcrumb.more")} className={styles.more}>
                <span aria-hidden="true">&hellip;</span>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner className={styles.positioner}>
                  <Menu.Content className={styles.content}>
                    {hiddenItems.map(({ item, index }) => (
                      <Menu.Item asChild className={styles.menuItem} key={index} value={`${index}`}>
                        <a href={item.href} onClick={(event) => onFollow?.(item, index, event)}>
                          {item.label}
                        </a>
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </li>
        )}
        {trailingItems.map(renderItem)}
      </ol>
    </nav>
  );
}
