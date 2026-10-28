import { Progress as Ark } from "@ark-ui/react/progress";
import type { HTMLAttributes } from "react";
import { useId } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./ProgressBar.module.css";

export type ProgressBarState = "ok" | "alarm";

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> {
  value?: number | undefined;

  max?: number | undefined;

  indeterminate?: boolean | undefined;

  label: string;

  helperText?: string | undefined;

  state?: ProgressBarState | undefined;
}

export function ProgressBar({
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  helperText,
  state,
  id,
  className,
  ...rest
}: ProgressBarProps) {
  const helperId = useId();

  return (
    <Ark.Root
      {...rest}
      aria-describedby={helperText === undefined ? undefined : helperId}
      className={joinClassNames(styles.root, className)}
      data-status={state}
      ids={id === undefined ? undefined : { root: id }}
      max={max}
      value={indeterminate ? null : value}
    >
      <div className={styles.header}>
        <Ark.Label className={styles.label}>{label}</Ark.Label>
        {state === undefined ? null : <StatusIcon state={state} />}
      </div>
      <Ark.Track className={styles.track}>
        <Ark.Range className={styles.range} />
      </Ark.Track>
      {helperText === undefined ? null : (
        <p className={styles.helper} id={helperId}>
          {helperText}
        </p>
      )}
    </Ark.Root>
  );
}

function StatusIcon({ state }: { state: ProgressBarState }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      fill="none"
      stroke="currentcolor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 16 16"
    >
      {state === "ok" ? <path d="M3 8.5l3.5 3.5L13 4.5" /> : <path d="M4 4l8 8m0-8l-8 8" />}
    </svg>
  );
}
