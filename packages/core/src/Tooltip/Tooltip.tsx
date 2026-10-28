import { Portal } from "@ark-ui/react/portal";
import { Tooltip as Ark } from "@ark-ui/react/tooltip";
import type { ReactNode, RefObject } from "react";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

const DELAY_MS = 110;

export interface TooltipProps {
  content: ReactNode;

  placement?: TooltipPlacement | undefined;

  defaultOpen?: boolean | undefined;

  container?: RefObject<HTMLElement | null> | undefined;

  children: ReactNode;
}

export function Tooltip({
  content,
  placement = "top",
  defaultOpen,
  container,
  children,
}: TooltipProps) {
  return (
    <Ark.Root
      closeDelay={DELAY_MS}
      defaultOpen={defaultOpen}
      openDelay={DELAY_MS}
      positioning={{ placement }}
    >
      <Ark.Trigger asChild>{children}</Ark.Trigger>
      <Portal container={container}>
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content className={styles.content}>
            <Ark.Arrow>
              <Ark.ArrowTip />
            </Ark.Arrow>
            {content}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}
