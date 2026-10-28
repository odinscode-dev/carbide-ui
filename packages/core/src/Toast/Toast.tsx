import { Portal } from "@ark-ui/react/portal";
import { Toast as Ark, Toaster as ArkToaster, createToaster } from "@ark-ui/react/toast";
import type { RefObject } from "react";
import styles from "./Toast.module.css";

export type ToastState = "info" | "success" | "warn" | "critical" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  state?: ToastState | undefined;
  action?: ToastAction | undefined;
}

const toaster = createToaster({
  placement: "bottom",
  duration: 4000,
  max: 3,
  overlap: false,
});

const ARK_TYPE: Record<ToastState, "info" | "success" | "warning" | "error"> = {
  info: "info",
  success: "success",
  warn: "warning",
  critical: "warning",
  error: "error",
};

export function toast(message: string, options: ToastOptions = {}): string {
  const state = options.state ?? "info";
  return toaster.create({
    title: message,
    type: ARK_TYPE[state],
    meta: { state },
    action: options.action,
  });
}

export interface ToasterProps {
  container?: RefObject<HTMLElement | null> | undefined;
}

export function Toaster({ container }: ToasterProps) {
  return (
    <Portal container={container}>
      <ArkToaster toaster={toaster}>
        {(item) => (
          <Ark.Root className={styles.root} data-state={toState(item.meta)}>
            <span aria-hidden="true" className={styles.icon}>
              <ToastIcon state={toState(item.meta)} />
            </span>
            <Ark.Title className={styles.title}>{item.title}</Ark.Title>
            {item.action === undefined ? null : (
              <Ark.ActionTrigger className={styles.action}>{item.action.label}</Ark.ActionTrigger>
            )}
          </Ark.Root>
        )}
      </ArkToaster>
    </Portal>
  );
}

function toState(meta: Record<string, unknown> | undefined): ToastState {
  const value = meta?.state;
  if (value === "success" || value === "warn" || value === "critical" || value === "error") {
    return value;
  }
  return "info";
}

export function ToastIcon({ state }: { state: ToastState }) {
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
