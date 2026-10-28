import type { HTMLAttributes } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./InlineLoading.module.css";

export type InlineLoadingStatus = "active" | "finished" | "error";

export interface InlineLoadingProps extends HTMLAttributes<HTMLDivElement> {
  status?: InlineLoadingStatus | undefined;

  description?: string | undefined;
}

export function InlineLoading({
  status = "active",
  description,
  className,
  ...rest
}: InlineLoadingProps) {
  return (
    <div
      {...rest}
      aria-busy={status === "active" || undefined}
      className={joinClassNames(styles.root, className)}
      data-status={status}
      role="status"
    >
      <StatusIcon status={status} />
      {description === undefined ? null : <span className={styles.description}>{description}</span>}
    </div>
  );
}

function StatusIcon({ status }: { status: InlineLoadingStatus }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
    >
      <circle className={styles.track} cx="8" cy="8" r="6.5" />
      {status === "active" ? <circle className={styles.head} cx="8" cy="8" r="6.5" /> : null}
      {status === "finished" ? (
        <path className={styles.mark} d="M4.5 8.5l2.5 2.5 4.5-5" strokeLinecap="round" />
      ) : null}
      {status === "error" ? (
        <path className={styles.mark} d="M5.5 5.5l5 5m0-5l-5 5" strokeLinecap="round" />
      ) : null}
    </svg>
  );
}
