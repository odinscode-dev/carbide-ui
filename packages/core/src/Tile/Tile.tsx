import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { glassClassName, type Variant, variantAttribute } from "../glass/index.js";
import styles from "./Tile.module.css";

export type TileElevation = "flat" | "raised";

export interface TileProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  clickable?: boolean;

  /**
   * `"glass"` makes the tile a glass pane instead of an opaque surface:
   * for a tile that sits on a photo or another background image. Hover
   * and selected feedback stay as they are — a clickable glass tile still
   * goes opaque under the pointer.
   */
  variant?: Variant;

  /**
   * `"raised"` lifts the tile out of the page: a surface with a light top
   * edge and a shadow that grows under the pointer — for instrument tiles
   * on a dashboard. `"flat"` (default) lies in the page.
   */
  elevation?: TileElevation;

  /**
   * Any CSS colour that names what the tile shows (a quantity, a device):
   * a bar along the top edge, a tint in the corner and in the border. The
   * colour is also `--carbide-tile-accent` for the tile's content.
   */
  accent?: string | undefined;

  selected?: boolean;

  onSelect?: (selected: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function Tile({
  clickable = false,
  variant = "default",
  elevation = "flat",
  accent,
  selected = false,
  onSelect,
  disabled = false,
  onClick,
  className,
  style,
  children,
  ...rest
}: TileProps) {
  const selectable = onSelect !== undefined;
  const sharedProps = {
    style: accentStyle(accent, style),
    "data-elevation": elevation === "raised" ? "raised" : undefined,
    "data-accent": accent === undefined ? undefined : "",
    className: glassClassName(styles.root, variant, className),
    "data-variant": variantAttribute(variant),
    "data-clickable": clickable ? "" : undefined,
    "data-selectable": selectable ? "" : undefined,
    "data-selected": selected ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
  };

  if (!(clickable || selectable)) {
    return (
      <div {...rest} {...sharedProps} aria-disabled={disabled || undefined}>
        {children}
      </div>
    );
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    onSelect?.(!selected);
  };

  return (
    <button
      {...rest}
      {...sharedProps}
      aria-pressed={selectable ? selected : undefined}
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
}

interface TileCssVars extends CSSProperties {
  "--carbide-tile-accent"?: string;
}

function accentStyle(
  accent: string | undefined,
  style: CSSProperties | undefined,
): TileCssVars | undefined {
  if (accent === undefined) {
    return style;
  }
  return { ...style, "--carbide-tile-accent": accent };
}
