import type { HTMLAttributes, ReactNode } from "react";
import { InlineLoading } from "../InlineLoading/index.js";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Flashbar.module.css";

export type FlashbarState = "info" | "success" | "warn" | "critical" | "error";

export interface FlashbarItem {
  id: string;
  state: FlashbarState;
  title: string;
  content: ReactNode;

  loading?: boolean | undefined;
  onDismiss: () => void;
}

export interface FlashbarProps extends HTMLAttributes<HTMLDivElement> {
  items: FlashbarItem[];

  closeText?: string | undefined;
}

export function Flashbar({ items, closeText, className, ...rest }: FlashbarProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div {...rest} aria-live="polite" className={joinClassNames(styles.root, className)}>
      {items.map((item) => (
        <div
          className={styles.item}
          data-state={item.state}
          key={item.id}
          role={item.loading === true ? undefined : "status"}
        >
          {item.loading === true ? (
            <InlineLoading status="active" />
          ) : (
            <span aria-hidden="true" className={styles.icon}>
              <FlashbarIcon state={item.state} />
            </span>
          )}
          <div className={styles.body}>
            <p className={styles.title}>{item.title}</p>
            <div className={styles.message}>{item.content}</div>
          </div>
          <button
            aria-label={closeText ?? t("close")}
            className={styles.close}
            onClick={item.onDismiss}
            type="button"
          >
            <svg aria-hidden="true" className={styles.closeIcon} viewBox="0 0 16 16">
              <path
                d="M4 4l8 8M12 4l-8 8"
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

function FlashbarIcon({ state }: { state: FlashbarState }) {
  if (state === "warn" || state === "critical") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentcolor"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
      >
        <path d="M8 2.4l6.1 10.7H1.9z" strokeLinejoin="round" />
        <path d="M8 6.3v3.1M8 11.5v.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (state === "error") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentcolor"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="6.2" />
        <path d="M5.9 5.9l4.2 4.2M10.1 5.9l-4.2 4.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (state === "success") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentcolor"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="6.2" />
        <path d="M5 8.3l2.1 2.1L11.2 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" stroke="currentcolor" strokeWidth="1.5" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 7.4v4M8 4.7v.01" strokeLinecap="round" />
    </svg>
  );
}
