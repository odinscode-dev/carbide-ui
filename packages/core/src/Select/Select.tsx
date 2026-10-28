import { useFieldsetContext } from "@ark-ui/react/fieldset";
import { Portal } from "@ark-ui/react/portal";
import { Select as Ark, createListCollection } from "@ark-ui/react/select";
import { useMemo } from "react";
import { Divider, type DividerVariant } from "../Divider/index.js";
import { t } from "../i18n/t.js";
import styles from "./Select.module.css";

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export interface SelectDivider {
  divider: true;
  variant?: DividerVariant | undefined;
}

export type SelectEntry = SelectItem | SelectDivider;

function isDivider(entry: SelectEntry): entry is SelectDivider {
  return "divider" in entry;
}

export interface SelectProps {
  label: string;
  items: readonly SelectEntry[];

  value?: string | null | undefined;
  onValueChange?: ((value: string) => void) | undefined;

  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;

  emptyText?: string | undefined;

  name?: string | undefined;

  id?: string | undefined;
}

export function Select({
  label,
  items,
  value = null,
  onValueChange,
  placeholder,
  disabled = false,
  invalid = false,
  emptyText,
  name,
  id,
}: SelectProps) {
  const fieldset = useFieldsetContext();
  const locked = disabled || fieldset?.disabled === true;

  const selectable = useMemo(
    () => items.filter((entry): entry is SelectItem => !isDivider(entry)),
    [items],
  );

  const withKey = useMemo(() => {
    let previous = "start";
    return items.map((entry) => {
      if (isDivider(entry)) {
        return { entry, key: `divider-after-${previous}` };
      }
      previous = entry.value;
      return { entry, key: entry.value };
    });
  }, [items]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: selectable,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => item.disabled === true,
      }),
    [selectable],
  );

  return (
    <Ark.Root
      className={styles.root}
      collection={collection}
      data-disabled={locked ? "" : undefined}
      data-empty={selectable.length === 0 ? "" : undefined}
      disabled={locked}
      ids={id === undefined ? undefined : { trigger: id }}
      invalid={invalid}
      name={name}
      onValueChange={(details) => {
        const [nextValue] = details.value;
        if (nextValue !== undefined) {
          onValueChange?.(nextValue);
        }
      }}
      positioning={{ sameWidth: true }}
      value={value === null ? [] : [value]}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <Ark.Control className={styles.control}>
        <Ark.Trigger className={styles.trigger}>
          <Ark.ValueText
            className={styles.value}
            placeholder={placeholder ?? t("select.placeholder")}
          />
          <Ark.Indicator className={styles.indicator}>
            <Chevron />
          </Ark.Indicator>
        </Ark.Trigger>
      </Ark.Control>
      <Portal>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content className={styles.content}>
            {selectable.length === 0 ? (
              <div className={styles.empty}>{emptyText ?? t("select.empty")}</div>
            ) : (
              withKey.map(({ entry, key }) =>
                isDivider(entry) ? (
                  <Divider className={styles.itemDivider} key={key} variant={entry.variant} />
                ) : (
                  <Ark.Item className={styles.item} item={entry} key={key}>
                    <Ark.ItemText className={styles.itemText}>{entry.label}</Ark.ItemText>
                    <Ark.ItemIndicator className={styles.itemIndicator}>
                      <Check />
                    </Ark.ItemIndicator>
                  </Ark.Item>
                ),
              )
            )}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
      <Ark.HiddenSelect />
    </Ark.Root>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path d="M4 6l4 4 4-4" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
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
