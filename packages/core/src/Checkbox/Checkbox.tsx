import { Checkbox as Ark } from "@ark-ui/react/checkbox";
import { useFieldsetContext } from "@ark-ui/react/fieldset";
import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  label: string;

  hideLabel?: boolean | undefined;
  checked?: boolean | undefined;

  indeterminate?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;

  id?: string | undefined;
  name?: string | undefined;
  value?: string | undefined;
}

export function Checkbox({
  label,
  hideLabel = false,
  checked,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  invalid = false,
  id,
  name,
  value,
}: CheckboxProps) {
  const fieldset = useFieldsetContext();
  const isDisabled = disabled || fieldset?.disabled === true;

  return (
    <Ark.Root
      checked={indeterminate ? "indeterminate" : checked}
      className={styles.root}
      disabled={isDisabled}
      ids={id === undefined ? undefined : { hiddenInput: id }}
      invalid={invalid}
      name={name}
      onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
      value={value}
    >
      <Ark.Control className={styles.control}>
        {}
        <Ark.Indicator className={styles.indicator}>
          <CheckIcon />
        </Ark.Indicator>
        <Ark.Indicator className={styles.indicator} indeterminate>
          <DashIcon />
        </Ark.Indicator>
      </Ark.Control>
      {hideLabel ? null : <Ark.Label className={styles.label}>{label}</Ark.Label>}
      <Ark.HiddenInput aria-label={hideLabel ? label : undefined} className={styles.hiddenInput} />
    </Ark.Root>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path d="M4 8h8" stroke="currentcolor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
