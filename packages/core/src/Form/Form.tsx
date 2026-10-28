import type { FormHTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Form.module.css";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children?: ReactNode | undefined;
}

export function Form({ children, className, ...rest }: FormProps) {
  return (
    <form {...rest} className={joinClassNames(styles.root, className)}>
      {children}
    </form>
  );
}
