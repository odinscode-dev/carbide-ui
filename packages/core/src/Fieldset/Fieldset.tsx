import { Fieldset as Ark } from "@ark-ui/react/fieldset";
import type { ReactNode } from "react";
import styles from "./Fieldset.module.css";

export interface FieldsetProps {
  legend?: string | undefined;

  disabled?: boolean | undefined;
  children?: ReactNode | undefined;
}

export function Fieldset({ legend, disabled = false, children }: FieldsetProps) {
  return (
    <Ark.Root
      className={styles.root}
      data-legend={legend === undefined ? undefined : ""}
      disabled={disabled}
    >
      {legend !== undefined && <Ark.Legend className={styles.legend}>{legend}</Ark.Legend>}
      <div className={styles.fields}>{children}</div>
    </Ark.Root>
  );
}
