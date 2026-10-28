import { Field } from "@ark-ui/react/field";
import type { InputHTMLAttributes, KeyboardEvent } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Search.module.css";

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "type">;

export interface SearchProps extends NativeInputProps {
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;

  onSearch?: ((value: string) => void) | undefined;

  onClear?: (() => void) | undefined;

  placeholder?: string | undefined;

  clearLabel?: string | undefined;
}

export function Search({
  value = "",
  onValueChange,
  onSearch,
  onClear,
  placeholder,
  clearLabel,
  disabled = false,
  onChange,
  onKeyDown,
  id,
  "aria-label": ariaLabel,
  className,
  ...rest
}: SearchProps) {
  const filled = value !== "";

  return (
    <Field.Root
      className={styles.root}
      data-filled={filled ? "" : undefined}
      disabled={disabled || undefined}
      id={id}
    >
      <div className={styles.control}>
        <span aria-hidden="true" className={styles.icon}>
          <MagnifierIcon />
        </span>
        <Field.Input
          {...rest}
          aria-label={ariaLabel ?? t("search.label")}
          className={joinClassNames(styles.input, className)}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.currentTarget.value);
          }}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(event);
            if (event.key === "Enter") {
              onSearch?.(event.currentTarget.value);
            }
          }}
          placeholder={placeholder ?? t("search.placeholder")}
          type="search"
          value={value}
        />
        {filled && (
          <button
            aria-label={clearLabel ?? t("search.clear")}
            className={styles.clear}
            disabled={disabled}
            onClick={() => {
              onClear?.();
              onValueChange?.("");
            }}
            type="button"
          >
            <CrossIcon />
          </button>
        )}
      </div>
    </Field.Root>
  );
}

function MagnifierIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <circle cx="6.75" cy="6.75" r="4.25" stroke="currentcolor" strokeWidth="1.5" />
      <path d="M10 10l3.5 3.5" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentcolor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
