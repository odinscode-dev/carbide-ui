import { Field } from "@ark-ui/react/field";
import type { InputHTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./TextInput.module.css";

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "value">;

export interface TextInputProps extends NativeInputProps {
  label: string;

  helperText?: string | undefined;

  errorText?: string | undefined;
  invalid?: boolean | undefined;

  prefix?: ReactNode | undefined;

  suffix?: ReactNode | undefined;
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

export function TextInput({
  label,
  helperText,
  errorText,
  invalid = false,
  prefix,
  suffix,
  value,
  onValueChange,
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  id,
  type = "text",
  className,
  ...rest
}: TextInputProps) {
  const isNumeric = type === "number";
  return (
    <Field.Root
      className={styles.root}
      data-prefix={prefix === undefined ? undefined : ""}
      data-suffix={suffix === undefined ? undefined : ""}
      data-numeric={isNumeric ? "" : undefined}
      disabled={disabled || undefined}
      id={id}
      invalid={invalid}
      readOnly={readOnly}
      required={required}
    >
      <Field.Label className={styles.label}>{label}</Field.Label>
      <div className={styles.control}>
        {prefix !== undefined && <span className={styles.prefix}>{prefix}</span>}
        <Field.Input
          {...rest}
          className={joinClassNames(styles.input, className)}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.currentTarget.value);
          }}
          type={type}
          value={value}
        />
        {suffix !== undefined && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {helperText !== undefined && !invalid && (
        <Field.HelperText className={styles.helper}>{helperText}</Field.HelperText>
      )}
      {errorText !== undefined && (
        <Field.ErrorText className={styles.error}>{errorText}</Field.ErrorText>
      )}
    </Field.Root>
  );
}
