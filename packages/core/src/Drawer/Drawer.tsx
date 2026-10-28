import { Dialog as Ark } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import { ScrollArea } from "../ScrollArea/index.js";
import styles from "./Drawer.module.css";

export type DrawerSide = "start" | "end";

export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;

  side?: DrawerSide | undefined;

  size?: DrawerSize | undefined;

  modal?: boolean | undefined;

  closeOnInteractOutside?: boolean | undefined;

  persistentElements?: Array<() => Element | null> | undefined;

  title: ReactNode;

  footer?: ReactNode | undefined;
  children?: ReactNode | undefined;

  unpadded?: boolean | undefined;

  closeText?: string | undefined;

  container?: RefObject<HTMLElement | null> | undefined;
}

export function Drawer({
  open,
  onOpenChange,
  side = "end",
  size = "sm",
  modal = true,
  closeOnInteractOutside,
  persistentElements,
  title,
  footer,
  children,
  closeText,
  container,
  unpadded = false,
  id,
  className,
  ...rest
}: DrawerProps) {
  return (
    <Ark.Root
      closeOnInteractOutside={closeOnInteractOutside ?? modal}
      ids={id === undefined ? undefined : { content: id }}
      modal={modal}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      open={open}
      persistentElements={persistentElements}
    >
      <Portal container={container}>
        {modal && <Ark.Backdrop className={styles.backdrop} />}
        <Ark.Positioner className={styles.positioner} data-side={side}>
          <Ark.Content
            {...rest}
            className={joinClassNames(styles.content, className)}
            data-footer={footer === undefined ? undefined : ""}
            data-modal={modal ? "" : undefined}
            data-side={side}
            data-size={size}
          >
            <header className={styles.head}>
              <Ark.Title className={styles.title}>{title}</Ark.Title>
              <Ark.CloseTrigger aria-label={closeText ?? t("close")} className={styles.close}>
                <svg aria-hidden="true" className={styles.closeIcon} viewBox="0 0 16 16">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    fill="none"
                    stroke="currentcolor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </Ark.CloseTrigger>
            </header>
            {unpadded ? (
              <div className={styles.body}>{children}</div>
            ) : (
              <ScrollArea className={styles.body}>
                <div className={styles.bodyContent}>{children}</div>
              </ScrollArea>
            )}
            {footer !== undefined && <footer className={styles.foot}>{footer}</footer>}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}
