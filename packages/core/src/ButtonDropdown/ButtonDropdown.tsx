import { Menu as Ark } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { Fragment } from "react";
import { t } from "../i18n/t.js";
import styles from "./ButtonDropdown.module.css";

export type ButtonDropdownVariant = "primary" | "secondary" | "ghost";

export interface ButtonDropdownItem {
  id: string;
  label: string;
  disabled?: boolean | undefined;

  danger?: boolean | undefined;

  group?: string | undefined;
}

export interface ButtonDropdownProps {
  label: string;

  variant?: ButtonDropdownVariant | undefined;

  split?: boolean | undefined;

  onMainClick?: (() => void) | undefined;
  items: ButtonDropdownItem[];
  onItemSelect?: ((id: string) => void) | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
}

function groupItems(items: ButtonDropdownItem[]): ButtonDropdownItem[][] {
  const groups: ButtonDropdownItem[][] = [];
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

export function ButtonDropdown({
  label,
  variant = "secondary",
  split = false,
  onMainClick,
  items,
  onItemSelect,
  disabled = false,
  id,
}: ButtonDropdownProps) {
  const groups = groupItems(items);

  return (
    <Ark.Root
      ids={id === undefined ? undefined : { trigger: id }}
      onSelect={(details) => onItemSelect?.(details.value)}
      positioning={{ placement: "bottom-start" }}
    >
      <div className={styles.root} data-split={split ? "" : undefined} data-variant={variant}>
        {split && (
          <button className={styles.main} disabled={disabled} onClick={onMainClick} type="button">
            {label}
          </button>
        )}
        <Ark.Trigger
          aria-label={split ? t("buttonDropdown.moreActions", { label }) : undefined}
          className={styles.trigger}
          data-icon-only={split ? "" : undefined}
          disabled={disabled}
        >
          {!split && label}
          <ChevronIcon />
        </Ark.Trigger>
      </div>
      <Portal>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content className={styles.content}>
            {groups.map((block, index) => (
              <Fragment key={block[0]?.id ?? index}>
                {index > 0 && <Ark.Separator className={styles.separator} />}
                <Ark.ItemGroup>
                  {block.map((item) => (
                    <Ark.Item
                      className={styles.item}
                      data-danger={item.danger ? "" : undefined}
                      disabled={item.disabled}
                      key={item.id}
                      value={item.id}
                    >
                      {item.label}
                    </Ark.Item>
                  ))}
                </Ark.ItemGroup>
              </Fragment>
            ))}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className={styles.chevron} fill="none" viewBox="0 0 16 16">
      <path d="M4 6l4 4 4-4" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
