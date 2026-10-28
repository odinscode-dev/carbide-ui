import { Dialog as Ark } from "@ark-ui/react/dialog";
import type { HTMLAttributes, RefObject } from "react";
import { Button } from "../Button/index.js";
import { t } from "../i18n/t.js";
import { Modal } from "../Modal/index.js";
import styles from "./Dialog.module.css";

export type DialogRole = "confirm" | "warning" | "critical" | "error" | "info";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "title"> {
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;

  role?: DialogRole | undefined;
  title: string;

  message: string;

  confirmText?: string | undefined;

  cancelText?: string | undefined;

  onConfirm?: (() => void) | undefined;

  onCancel?: (() => void) | undefined;

  danger?: boolean | undefined;

  container?: RefObject<HTMLElement | null> | undefined;
}

export function Dialog({
  open,
  onOpenChange,
  role = "confirm",
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  danger = false,
  container,
  ...rest
}: DialogProps) {
  const ariaRole =
    role === "warning" || role === "critical" || role === "error" ? "alertdialog" : "dialog";

  const cancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const confirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  return (
    <Modal
      {...rest}
      container={container}
      data-danger={danger ? "" : undefined}
      data-role={role}
      footer={
        <>
          <Button onClick={cancel} variant="secondary">
            {cancelText ?? t("dialog.cancel")}
          </Button>
          <Button onClick={confirm} variant={danger ? "danger" : "primary"}>
            {confirmText ?? t("dialog.confirm")}
          </Button>
        </>
      }
      onOpenChange={(isOpen) => (isOpen ? onOpenChange?.(true) : cancel())}
      open={open}
      role={ariaRole}
      size="sm"
      title={
        <>
          <span className={styles.icon}>
            <Icon role={role} />
          </span>
          {title}
        </>
      }
    >
      <Ark.Description className={styles.message}>{message}</Ark.Description>
    </Modal>
  );
}

function Icon({ role }: { role: DialogRole }) {
  if (role === "warning" || role === "critical") {
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

  if (role === "error") {
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

  if (role === "info") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentcolor"
        strokeWidth="1.5"
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="6.2" />
        <path d="M8 7.4v4M8 4.7v.01" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" stroke="currentcolor" strokeWidth="1.5" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.2" />
      <path
        d="M6.1 6.2a1.9 1.9 0 1 1 2 2v1.1M8 11.4v.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
