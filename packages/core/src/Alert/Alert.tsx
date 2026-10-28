import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../Button/index.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Alert.module.css";

export type AlertState = "info" | "success" | "warn" | "critical" | "error";

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  state?: AlertState | undefined;

  title?: string | undefined;
  children: ReactNode;
  action?: AlertAction | undefined;
}

export function Alert({ state = "info", title, children, action, className, ...rest }: AlertProps) {
  return (
    <div
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-state={state}
      role="alert"
    >
      <span aria-hidden="true" className={styles.icon}>
        <AlertIcon state={state} />
      </span>
      <div className={styles.body}>
        {title === undefined ? null : <p className={styles.title}>{title}</p>}
        <div className={styles.message}>{children}</div>
      </div>
      {action === undefined ? null : (
        <div className={styles.action}>
          <Button onClick={action.onClick} variant="secondary">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

function AlertIcon({ state }: { state: AlertState }) {
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
