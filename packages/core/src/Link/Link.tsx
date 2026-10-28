import type { AnchorHTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;

  inline?: boolean;

  icon?: ReactNode;

  disabled?: boolean;
}

export function Link({
  href,
  inline = false,
  icon,
  disabled = false,
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <a
      {...rest}
      aria-disabled={disabled || undefined}
      className={joinClassNames(styles.root, className)}
      data-disabled={disabled ? "" : undefined}
      data-inline={inline ? "" : undefined}
      href={disabled ? undefined : href}
    >
      {children}
      {icon !== undefined && (
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      )}
    </a>
  );
}
