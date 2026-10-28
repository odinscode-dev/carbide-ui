import type { HTMLAttributes, ReactNode } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Tag.module.css";

export type TagState = "neutral" | "accent" | "success" | "warn" | "critical" | "error" | "manual";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  state?: TagState;

  onRemove?: () => void;

  removeLabel?: string;
  children: ReactNode;
}

export function Tag({
  state = "neutral",
  onRemove,
  removeLabel,
  children,
  className,
  ...rest
}: TagProps) {
  return (
    <span
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-removable={onRemove === undefined ? undefined : ""}
      data-state={state}
    >
      <span className={styles.label}>{children}</span>
      {onRemove !== undefined && (
        <button
          aria-label={removeLabel ?? t("tag.remove")}
          className={styles.remove}
          onClick={() => onRemove()}
          type="button"
        >
          <svg aria-hidden="true" className={styles.removeIcon} viewBox="0 0 16 16">
            <path
              d="M4 4l8 8m0-8l-8 8"
              fill="none"
              stroke="currentcolor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
