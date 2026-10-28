import { Popover as Ark } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import type { CSSProperties, ReactNode, RefObject } from "react";
import styles from "./Popover.module.css";

export type PopoverPlacement = "top" | "right" | "bottom" | "left";

interface PopoverCssVars extends CSSProperties {
  "--carbide-popover-border-color"?: string;
  "--carbide-popover-width"?: string;
  "--carbide-popover-background"?: string;
}

export interface PopoverProps {
  content: ReactNode;

  placement?: PopoverPlacement | undefined;

  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;

  arrow?: boolean | undefined;

  borderColor?: string | undefined;

  /**
   * Background of the content and its arrow. Defaults to the first layer;
   * a popover over a dark board passes a lighter layer to stand off it.
   */
  background?: string | undefined;

  /**
   * Width of the content as a CSS length. Without it the content grows
   * with its text up to 22rem; a wide table or list passes its own width
   * and the cap goes.
   */
  width?: string | undefined;

  /**
   * Whether opening the popover moves focus into its content. Zag defaults
   * this to true. Set to false for hover-only, non-interactive content.
   */
  autoFocus?: boolean | undefined;

  container?: RefObject<HTMLElement | null> | undefined;

  children: ReactNode;
}

export function Popover({
  content,
  placement = "bottom",
  open,
  onOpenChange,
  arrow = true,
  borderColor,
  background,
  width,
  autoFocus,
  container,
  children,
}: PopoverProps) {
  const contentStyle: PopoverCssVars = {};
  if (borderColor) contentStyle["--carbide-popover-border-color"] = borderColor;
  if (width) contentStyle["--carbide-popover-width"] = width;
  if (background) contentStyle["--carbide-popover-background"] = background;

  return (
    <Ark.Root
      autoFocus={autoFocus}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      open={open}
      positioning={{ placement }}
    >
      <Ark.Trigger asChild>{children}</Ark.Trigger>
      <Portal container={container}>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content
            className={styles.content}
            data-background={background === undefined ? undefined : ""}
            data-width={width === undefined ? undefined : ""}
            style={contentStyle}
          >
            {arrow ? (
              <Ark.Arrow>
                <Ark.ArrowTip className={styles.arrowTip} />
              </Ark.Arrow>
            ) : null}
            {content}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}
