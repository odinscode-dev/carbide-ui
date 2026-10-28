import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Spinner } from "../Spinner/index.js";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonIconPosition = "start" | "end";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;

  loading?: boolean;

  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;

  ref?: Ref<HTMLButtonElement> | undefined;
}

export function Button({
  variant = "secondary",
  loading = false,
  icon,
  iconPosition = "end",
  type = "button",
  disabled = false,
  children,
  ref,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const iconOnly = children === undefined && icon !== undefined;

  const decoration = loading ? <Spinner /> : icon;

  return (
    <button
      data-variant={variant}
      {...(isDisabled ? { "data-disabled": "" } : {})}
      {...(loading ? { "data-loading": "" } : {})}
      {...(iconOnly ? { "data-icon-only": "" } : {})}
      data-icon-position={decoration === undefined ? undefined : iconPosition}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      ref={ref}
      type={type}
      {...rest}
      className={rest.className === undefined ? styles.root : `${styles.root} ${rest.className}`}
    >
      {decoration !== undefined && iconPosition === "start" && (
        <span aria-hidden="true" className={styles.icon}>
          {decoration}
        </span>
      )}
      {children}
      {decoration !== undefined && iconPosition === "end" && (
        <span aria-hidden="true" className={styles.icon}>
          {decoration}
        </span>
      )}
    </button>
  );
}
