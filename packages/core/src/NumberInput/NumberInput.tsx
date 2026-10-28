import { useFieldsetContext } from "@ark-ui/react/fieldset";
import { NumberInput as Ark } from "@ark-ui/react/number-input";
import { useState } from "react";
import { parseNumber } from "../format/number.js";
import { t } from "../i18n/t.js";
import styles from "./NumberInput.module.css";

export type NumberInputStep = 0.1 | 1 | 10 | 100 | 1000;

export interface NumberInputProps {
  label: string;

  value?: number | undefined;

  onValueChange?: ((value: number | null) => void) | undefined;

  step?: NumberInputStep | undefined;
  min?: number | undefined;
  max?: number | undefined;

  unit?: string | undefined;
  invalid?: boolean | undefined;

  errorText?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;

  id?: string | undefined;

  incrementLabel?: string | undefined;
  decrementLabel?: string | undefined;
}

export function NumberInput({
  label,
  value,
  onValueChange,
  step = 1,
  min,
  max,
  unit,
  invalid = false,
  errorText,
  disabled = false,
  readOnly = false,
  id,
  incrementLabel,
  decrementLabel,
}: NumberInputProps) {
  const fieldset = useFieldsetContext();
  const locked = disabled || fieldset?.disabled === true;

  const [text, setText] = useState(() => (value === undefined ? "" : String(value)));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);

    if (value !== (parseNumber(text) ?? undefined)) {
      setText(value === undefined ? "" : String(value));
    }
  }

  return (
    <Ark.Root
      className={styles.root}
      allowOverflow={false}
      data-readonly={readOnly ? "" : undefined}
      data-unit={unit === undefined ? undefined : ""}
      disabled={locked}
      ids={id === undefined ? undefined : { input: id, root: `numberInput::${id}` }}
      invalid={invalid}
      max={max}
      min={min}
      onValueChange={(details) => {
        const normalized = details.value.replaceAll(",", ".");
        setText(normalized);
        onValueChange?.(parseNumber(normalized));
      }}
      pattern="-?[0-9]*[.,]?[0-9]*"
      readOnly={readOnly}
      step={step}
      translations={{
        decrementLabel: decrementLabel ?? t("numberInput.decrement"),
        incrementLabel: incrementLabel ?? t("numberInput.increment"),
      }}
      value={text}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <Ark.Control className={styles.control}>
        <Ark.Input className={styles.input} />
        {unit !== undefined && <span className={styles.unit}>{unit}</span>}
        <span className={styles.trigger}>
          <Ark.DecrementTrigger className={styles.button}>
            <MinusIcon />
          </Ark.DecrementTrigger>
          <Ark.IncrementTrigger className={styles.button}>
            <PlusIcon />
          </Ark.IncrementTrigger>
        </span>
      </Ark.Control>
      {invalid && errorText !== undefined && <span className={styles.error}>{errorText}</span>}
    </Ark.Root>
  );
}

function MinusIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path d="M3.5 8h9" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
