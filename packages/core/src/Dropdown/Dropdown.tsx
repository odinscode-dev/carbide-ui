import { Combobox as Ark, createListCollection } from "@ark-ui/react/combobox";
import { useFieldsetContext } from "@ark-ui/react/fieldset";
import { Portal } from "@ark-ui/react/portal";
import { useMemo, useState } from "react";
import { t } from "../i18n/t.js";
import type { SelectItem } from "../Select/Select.js";
import styles from "./Dropdown.module.css";

export type DropdownFilter = (item: SelectItem, query: string) => boolean;

export interface DropdownProps {
  label: string;
  items: readonly SelectItem[];

  value?: string | null | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;

  filter?: DropdownFilter | undefined;

  emptyText?: string | undefined;

  noMatchesText?: string | undefined;

  openText?: string | undefined;

  name?: string | undefined;

  id?: string | undefined;
}

const containsQuery: DropdownFilter = (item, query) =>
  item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase());

export function Dropdown({
  label,
  items,
  value = null,
  onValueChange,
  placeholder,
  disabled = false,
  invalid = false,
  filter = containsQuery,
  emptyText,
  noMatchesText,
  openText,
  name,
  id,
}: DropdownProps) {
  const fieldset = useFieldsetContext();
  const locked = disabled || fieldset?.disabled === true;
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () => (query === "" ? [...items] : items.filter((item) => filter(item, query))),
    [items, query, filter],
  );
  const collection = useMemo(
    () =>
      createListCollection({
        items: visible,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => item.disabled === true,
      }),
    [visible],
  );

  return (
    <Ark.Root
      className={styles.root}
      collection={collection}
      data-disabled={locked ? "" : undefined}
      data-empty={items.length === 0 ? "" : undefined}
      disabled={locked}
      ids={id === undefined ? undefined : { input: id }}
      inputBehavior="autohighlight"
      invalid={invalid}
      name={name}
      onInputValueChange={(details) => {
        const accepted = details.reason === "item-select" || details.reason === "clear-trigger";
        setQuery(accepted ? "" : details.inputValue);
      }}
      onValueChange={(details) => {
        const [nextValue] = details.value;
        if (nextValue !== undefined) {
          onValueChange?.(nextValue);
        }
      }}
      openOnClick
      placeholder={placeholder ?? t("select.placeholder")}
      positioning={{ sameWidth: true }}
      translations={{ triggerLabel: openText ?? t("dropdown.open") }}
      value={value === null ? [] : [value]}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <Ark.Control className={styles.control}>
        <Ark.Input className={styles.input} />
        <Ark.Trigger className={styles.trigger}>
          <Chevron />
        </Ark.Trigger>
      </Ark.Control>
      <Portal>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content className={styles.content}>
            <Ark.Empty className={styles.empty}>
              {items.length === 0
                ? (emptyText ?? t("select.empty"))
                : (noMatchesText ?? t("dropdown.noMatches"))}
            </Ark.Empty>
            {visible.map((item) => (
              <Ark.Item className={styles.item} item={item} key={item.value}>
                <Ark.ItemText className={styles.itemText}>{item.label}</Ark.ItemText>
                <Ark.ItemIndicator className={styles.itemIndicator}>
                  <Check />
                </Ark.ItemIndicator>
              </Ark.Item>
            ))}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
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
