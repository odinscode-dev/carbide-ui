import { Dialog as Ark } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { glassClassName, type Variant, variantAttribute } from "../glass/index.js";
import { t } from "../i18n/t.js";
import { ScrollArea } from "../ScrollArea/index.js";
import styles from "./Modal.module.css";

export type ModalSize = "sm" | "md" | "lg";

export type ModalRole = "dialog" | "alertdialog";

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children" | "role"> {
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;

  title: ReactNode;

  size?: ModalSize | undefined;

  /**
   * `"glass"` makes the modal a glass pane instead of an opaque surface:
   * for an app whose pages sit on a background image, where an opaque
   * dialog would be the only flat thing on screen. `--carbide-glass-glow`
   * takes an extra shadow layer if the dialog has to carry an accent
   * color on top of that.
   */
  variant?: Variant | undefined;

  role?: ModalRole | undefined;

  footer?: ReactNode | undefined;
  children?: ReactNode | undefined;

  closeText?: string | undefined;

  container?: RefObject<HTMLElement | null> | undefined;
}

export function Modal({
  open,
  onOpenChange,
  title,
  size = "md",
  variant = "default",
  role,
  footer,
  children,
  closeText,
  container,
  id,
  className,
  ...rest
}: ModalProps) {
  return (
    <Ark.Root
      onOpenChange={(details) => onOpenChange?.(details.open)}
      open={open}
      role={role}
      ids={id === undefined ? undefined : { content: id }}
    >
      <Portal container={container}>
        <Ark.Backdrop className={styles.backdrop} />
        <Ark.Positioner className={styles.positioner}>
          <Ark.Content
            {...rest}
            className={glassClassName(styles.content, variant, className)}
            data-variant={variantAttribute(variant)}
            data-footer={footer === undefined ? undefined : ""}
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
            <ScrollArea className={styles.body}>
              <div className={styles.bodyContent}>{children}</div>
            </ScrollArea>
            {footer !== undefined && <footer className={styles.foot}>{footer}</footer>}
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
    </Ark.Root>
  );
}
