import { Menu as Ark } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { Fragment, type ReactElement, type ReactNode } from "react";
import styles from "./Menu.module.css";

export interface MenuItem {
  id: string;

  /** The entry's text; also what a screen reader and type-ahead use. */
  label: string;

  /** Shown instead of the label, e.g. a Tag; `label` stays the accessible name. */
  content?: ReactNode | undefined;

  /**
   * The accessible name when it has to say more than the visible text, e.g.
   * "Delete: Laptop" for a row's "Delete"; keep the visible text inside it.
   */
  name?: string | undefined;

  disabled?: boolean | undefined;

  danger?: boolean | undefined;

  /** Entries with the same group sit together; a separator divides the groups. */
  group?: string | undefined;
}

export interface MenuProps {
  /** The element that opens the menu; it receives the menu's ARIA attributes and handlers. */
  trigger: ReactElement;

  items: readonly MenuItem[];

  onItemSelect?: ((id: string) => void) | undefined;

  /**
   * The id of the current entry: it gets a check mark and is exposed as a
   * checked radio entry. Without it the entries are plain actions.
   */
  value?: string | undefined;

  placement?: "bottom-start" | "bottom-end" | undefined;

  id?: string | undefined;
}

function groupItems(items: readonly MenuItem[]): MenuItem[][] {
  const groups: MenuItem[][] = [];
  for (const item of items) {
    const lastGroup = groups.at(-1);
    const lastItem = lastGroup?.at(-1);
    if (lastGroup !== undefined && lastItem?.group === item.group) {
      lastGroup.push(item);
    } else {
      groups.push([item]);
    }
  }
  return groups;
}

export function Menu({
  trigger,
  items,
  onItemSelect,
  value,
  placement = "bottom-start",
  id,
}: MenuProps) {
  const groups = groupItems(items);
  const current = value !== undefined;

  return (
    <Ark.Root
      ids={id === undefined ? undefined : { trigger: id }}
      onSelect={(details) => onItemSelect?.(details.value)}
      positioning={{ placement }}
    >
      <Ark.Trigger asChild>{trigger}</Ark.Trigger>
      <Portal>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content className={styles.content}>
            {groups.map((block, index) => (
              <Fragment key={block[0]?.id ?? index}>
                {index > 0 && <Ark.Separator className={styles.separator} />}
                {current ? (
                  <Ark.RadioItemGroup value={value}>
                    {block.map((item) => (
                      <Ark.RadioItem
                        aria-label={item.name}
                        className={styles.item}
                        data-danger={item.danger ? "" : undefined}
                        disabled={item.disabled}
                        key={item.id}
                        value={item.id}
                        valueText={item.label}
                      >
                        <span className={styles.text}>{item.content ?? item.label}</span>
                        <Ark.ItemIndicator className={styles.indicator}>
                          <Check />
                        </Ark.ItemIndicator>
                      </Ark.RadioItem>
                    ))}
                  </Ark.RadioItemGroup>
                ) : (
                  <Ark.ItemGroup>
                    {block.map((item) => (
                      <Ark.Item
                        aria-label={item.name}
                        className={styles.item}
                        data-danger={item.danger ? "" : undefined}
                        disabled={item.disabled}
                        key={item.id}
                        value={item.id}
                        valueText={item.label}
                      >
                        <span className={styles.text}>{item.content ?? item.label}</span>
                      </Ark.Item>
                    ))}
                  </Ark.ItemGroup>
                )}
              </Fragment>
            ))}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
