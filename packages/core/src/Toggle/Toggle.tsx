import { useFieldsetContext } from "@ark-ui/react/fieldset";
import { Switch as Ark } from "@ark-ui/react/switch";
import { t } from "../i18n/t.js";
import styles from "./Toggle.module.css";

export type ToggleLabelPosition = "start" | "end";

export interface ToggleProps {
  label: string;
  checked?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;

  labelPosition?: ToggleLabelPosition | undefined;
  disabled?: boolean | undefined;

  onText?: string | undefined;
  offText?: string | undefined;
  id?: string | undefined;
  name?: string | undefined;
}

export function Toggle({
  label,
  checked = false,
  onCheckedChange,
  labelPosition = "start",
  disabled = false,
  onText,
  offText,
  id,
  name,
}: ToggleProps) {
  const fieldset = useFieldsetContext();
  const locked = disabled || fieldset?.disabled === true;
  const stateText = checked ? (onText ?? t("toggle.on")) : (offText ?? t("toggle.off"));

  return (
    <Ark.Root
      checked={checked}
      className={styles.root}
      data-label-position={labelPosition}
      disabled={locked}
      ids={id === undefined ? undefined : { hiddenInput: id }}
      name={name}
      onCheckedChange={(details) => onCheckedChange?.(details.checked)}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <span className={styles.field}>
        <Ark.Control className={styles.control}>
          <Ark.Thumb className={styles.thumb} />
        </Ark.Control>
        <span aria-hidden="true" className={styles.state}>
          {stateText}
        </span>
        <Ark.HiddenInput className={styles.hiddenInput} role="switch" />
      </span>
    </Ark.Root>
  );
}
