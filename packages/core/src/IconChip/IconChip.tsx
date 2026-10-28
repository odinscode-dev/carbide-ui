import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./IconChip.module.css";

export type IconChipSize = "sm" | "md";

export interface IconChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The icon, sized by the chip's font size (`1em`). */
  icon: ReactNode;
  /** Names the chip for assistive tech; without it the chip is decoration. */
  label?: string | undefined;
  /** Any CSS colour for icon and tint; default the text colour. */
  color?: string | undefined;
  size?: IconChipSize | undefined;
}

interface IconChipCssVars extends CSSProperties {
  "--carbide-chip-color"?: string;
}

/** An icon on a square tinted in its colour: names a quantity or a device at a glance. */
export function IconChip({
  icon,
  label,
  color,
  size = "md",
  className,
  style,
  ...rest
}: IconChipProps) {
  const vars: IconChipCssVars | undefined =
    color === undefined ? style : { ...style, "--carbide-chip-color": color };
  return (
    <span
      {...rest}
      {...(label === undefined ? { "aria-hidden": true } : { "aria-label": label, role: "img" })}
      className={joinClassNames(styles.root, className)}
      data-size={size}
      style={vars}
    >
      {icon}
    </span>
  );
}
