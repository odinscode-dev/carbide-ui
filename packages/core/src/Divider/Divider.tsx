import type { HTMLAttributes } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "default" | "error" | "warning" | "success";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: DividerOrientation | undefined;
  variant?: DividerVariant | undefined;
}

export function Divider({
  orientation = "horizontal",
  variant = "default",
  className,
  ...rest
}: DividerProps) {
  return (
    <hr
      {...rest}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      className={joinClassNames(styles.root, className)}
      data-orientation={orientation}
      data-variant={variant}
    />
  );
}
