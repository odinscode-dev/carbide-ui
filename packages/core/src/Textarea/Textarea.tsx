import { Field } from "@ark-ui/react/field";
import type { TextareaHTMLAttributes } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Textarea.module.css";

type NativeTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value">;

export interface TextareaProps extends NativeTextareaProps {
  label: string;

  helperText?: string | undefined;

  errorText?: string | undefined;
  invalid?: boolean | undefined;
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

export function Textarea({
  label,
  helperText,
  errorText,
  invalid = false,
  value,
  onValueChange,
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  id,
  rows = 4,
  className,
  ...rest
}: TextareaProps) {
  return (
    <Field.Root
      className={styles.root}
      disabled={disabled || undefined}
      id={id}
      invalid={invalid}
      readOnly={readOnly}
      required={required}
    >
      <Field.Label className={styles.label}>{label}</Field.Label>
      <div className={styles.control}>
        <Field.Textarea
          {...rest}
          className={joinClassNames(styles.textarea, className)}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.currentTarget.value);
          }}
          rows={rows}
          value={value}
        />
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
