import { RadioGroup as Ark } from "@ark-ui/react/radio-group";
import type { ReactNode } from "react";
import styles from "./RadioButton.module.css";

export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioGroupProps {
  label: string;

  children: ReactNode;

  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;

  orientation?: RadioGroupOrientation | undefined;

  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  id?: string | undefined;
  name?: string | undefined;
}

export function RadioGroup({
  label,
  children,
  value,
  onValueChange,
  orientation = "vertical",
  disabled = false,
  invalid = false,
  id,
  name,
}: RadioGroupProps) {
  return (
    <Ark.Root
      className={styles.root}
      disabled={disabled}
      ids={id === undefined ? undefined : { root: id }}
      invalid={invalid}
      name={name}
      onValueChange={(details) => {
        if (details.value !== null) {
          onValueChange?.(details.value);
        }
      }}
      orientation={orientation}
      value={value ?? null}
    >
      <Ark.Label className={styles.groupLabel}>{label}</Ark.Label>
      <div className={styles.options}>{children}</div>
    </Ark.Root>
  );
}

export interface RadioButtonProps {
  value: string;
  label: string;
  disabled?: boolean | undefined;
}

export function RadioButton({ value, label, disabled }: RadioButtonProps) {
  return (
    <Ark.Item className={styles.item} disabled={disabled} value={value}>
      <Ark.ItemControl className={styles.control} />
      <Ark.ItemText className={styles.label}>{label}</Ark.ItemText>
      <Ark.ItemHiddenInput className={styles.hiddenInput} />
    </Ark.Item>
  );
}
