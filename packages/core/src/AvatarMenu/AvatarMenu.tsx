import { Menu as Ark } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import type { RefObject } from "react";
import { useState } from "react";
import { Avatar, type AvatarRole } from "../Avatar/index.js";
import { Dialog } from "../Dialog/index.js";
import { t } from "../i18n/t.js";
import styles from "./AvatarMenu.module.css";

const LOGOUT_VALUE = "logout";

export interface AvatarMenuItem {
  id: string;
  label: string;
  disabled?: boolean | undefined;

  danger?: boolean | undefined;
}

export interface AvatarMenuProps {
  name: string;

  src?: string | undefined;
  accountRole?: AvatarRole | undefined;
  items: AvatarMenuItem[];
  onItemSelect?: ((id: string) => void) | undefined;
  id?: string | undefined;

  container?: RefObject<HTMLElement | null> | undefined;

  onLogout?: (() => void) | undefined;

  logoutLabel?: string | undefined;

  logoutConfirmTitle?: string | undefined;

  logoutConfirmMessage?: string | undefined;

  logoutConfirmText?: string | undefined;

  /** Cancel button of the logout dialog; defaults to the catalog text. */
  logoutCancelText?: string | undefined;

  /**
   * Accessible name of the trigger button, the whole sentence; defaults to the
   * catalog text with the account name.
   */
  triggerLabel?: string | undefined;
}

export function AvatarMenu({
  name,
  src,
  accountRole,
  items,
  onItemSelect,
  id,
  container,
  onLogout,
  logoutLabel,
  logoutConfirmTitle,
  logoutConfirmMessage,
  logoutConfirmText,
  logoutCancelText,
  triggerLabel,
}: AvatarMenuProps) {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  return (
    <>
      <Ark.Root
        ids={id === undefined ? undefined : { trigger: id }}
        onSelect={(details) => {
          if (details.value === LOGOUT_VALUE) {
            setLogoutConfirmOpen(true);
            return;
          }
          onItemSelect?.(details.value);
        }}
        positioning={{ placement: "bottom-end" }}
      >
        <Ark.Trigger
          aria-label={triggerLabel ?? t("avatarMenu.trigger", { name })}
          className={styles.trigger}
        >
          <Avatar accountRole={accountRole} name={name} src={src} />
        </Ark.Trigger>
        <Portal>
          <Ark.Positioner className={styles.positioner}>
            <Ark.Content className={styles.content}>
              <Ark.ItemGroup>
                <Ark.ItemGroupLabel className={styles.accountLabel}>{name}</Ark.ItemGroupLabel>
              </Ark.ItemGroup>
              <Ark.Separator className={styles.separator} />
              {items.map((item) => (
                <Ark.Item
                  className={styles.item}
                  data-danger={item.danger ? "" : undefined}
                  disabled={item.disabled}
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </Ark.Item>
              ))}
              {onLogout !== undefined && (
                <Ark.Item className={styles.item} data-danger="" value={LOGOUT_VALUE}>
                  {logoutLabel ?? t("avatarMenu.logout.label")}
                </Ark.Item>
              )}
            </Ark.Content>
          </Ark.Positioner>
        </Portal>
      </Ark.Root>
      {onLogout !== undefined && (
        <Dialog
          cancelText={logoutCancelText}
          confirmText={logoutConfirmText ?? t("avatarMenu.logout.confirm")}
          container={container}
          danger
          message={logoutConfirmMessage ?? t("avatarMenu.logout.message")}
          onConfirm={onLogout}
          onOpenChange={setLogoutConfirmOpen}
          open={logoutConfirmOpen}
          title={logoutConfirmTitle ?? t("avatarMenu.logout.title")}
        />
      )}
    </>
  );
}
