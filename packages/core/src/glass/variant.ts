import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./glass.module.css";

/** `"glass"` turns a component's own surface into a glass pane. */
export type Variant = "default" | "glass";

/**
 * The class list for a component root, its own class first so the pane's
 * rules read as the addition they are. `string | undefined` because that is
 * what a CSS module hands out (`css-modules.d.ts`) — the class names are
 * only known at build time.
 */
export function glassClassName(
  own: string | undefined,
  variant: Variant,
  extra?: string | undefined,
): string | undefined {
  return joinClassNames(own, variant === "glass" ? styles.pane : undefined, extra);
}

/**
 * The attribute that carries the variant into CSS. `undefined` for the
 * default, so a plain component keeps its markup free of it.
 */
export function variantAttribute(variant: Variant): "glass" | undefined {
  return variant === "glass" ? "glass" : undefined;
}
