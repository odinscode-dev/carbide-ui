import { SegmentGroup as Ark } from "@ark-ui/react/segment-group";
import styles from "./ContentSwitcher.module.css";

export interface ContentSwitcherItem {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export interface ContentSwitcherProps {
  items: ContentSwitcherItem[];
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
}

export function ContentSwitcher({
  items,
  value,
  onValueChange,
  disabled = false,
  id,
}: ContentSwitcherProps) {
  return (
    <Ark.Root
      className={styles.root}
      disabled={disabled}
      ids={id === undefined ? undefined : { root: id }}
      onValueChange={(details) => {
        if (details.value !== null) {
          onValueChange?.(details.value);
        }
      }}
      orientation="horizontal"
      value={value}
    >
      <Ark.Indicator className={styles.indicator} />
      {items.map((item) => (
        <Ark.Item
          className={styles.item}
          disabled={item.disabled}
          key={item.value}
          value={item.value}
        >
          <Ark.ItemText>{item.label}</Ark.ItemText>
          <Ark.ItemHiddenInput />
        </Ark.Item>
      ))}
    </Ark.Root>
  );
}
