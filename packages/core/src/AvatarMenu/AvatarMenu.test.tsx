// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AvatarMenu, type AvatarMenuItem } from "./AvatarMenu.js";

const ITEMS: AvatarMenuItem[] = [{ id: "settings", label: "Settings" }];

afterEach(cleanup);

async function openMenu(name = "Ada Lovelace") {
  fireEvent.click(screen.getByRole("button", { name: `Account menu for ${name}` }));
  await screen.findByRole("menu");
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function selectItem(name: string) {
  const item = screen.getByRole("menuitem", { name });
  fireEvent.pointerDown(item, { button: 0, isPrimary: true, pointerId: 1, pointerType: "mouse" });
  await delay(20);
  fireEvent.click(item);
}

describe("AvatarMenu", () => {
  it("renders the avatar and the item labels", async () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" />);
    expect(screen.getByRole("button", { name: "Account menu for Ada Lovelace" }).textContent).toBe(
      "Ada Lovelace",
    );
    await openMenu();
    expect(screen.getByRole("menuitem", { name: "Settings" })).not.toBeNull();
  });

  it("shows the account name above a separator, before the other entries", async () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" />);
    await openMenu();
    const menu = screen.getByRole("menu");
    expect(within(menu).getByText("Ada Lovelace")).not.toBeNull();
    expect(menu.querySelector('[data-part="separator"]')).not.toBeNull();
  });

  it("gives the trigger an accessible name naming the account", () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" />);
    expect(screen.getByRole("button", { name: "Account menu for Ada Lovelace" })).not.toBeNull();
  });

  it("calls onItemSelect with the clicked entry's id", async () => {
    const onItemSelect = vi.fn();
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" onItemSelect={onItemSelect} />);
    await openMenu();
    await selectItem("Settings");
    expect(onItemSelect).toHaveBeenCalledExactlyOnceWith("settings");
  });

  it("marks a dangerous entry with data-danger", async () => {
    render(
      <AvatarMenu
        items={[{ id: "delete", label: "Delete account", danger: true }]}
        name="Ada Lovelace"
      />,
    );
    await openMenu();
    expect(
      screen.getByRole("menuitem", { name: "Delete account" }).getAttribute("data-danger"),
    ).toBe("");
  });

  it("shows a disabled entry as aria-disabled", async () => {
    render(
      <AvatarMenu
        items={[{ id: "settings", label: "Settings", disabled: true }]}
        name="Ada Lovelace"
      />,
    );
    await openMenu();
    expect(screen.getByRole("menuitem", { name: "Settings" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it.each(["admin", "client"] as const)(
    "forwards accountRole %s to the avatar as data-role",
    (accountRole) => {
      render(<AvatarMenu accountRole={accountRole} items={ITEMS} name="Ada Lovelace" />);
      expect(
        screen
          .getByRole("button", { name: "Account menu for Ada Lovelace" })
          .querySelector('[data-part="root"]')
          ?.getAttribute("data-role"),
      ).toBe(accountRole);
    },
  );

  it("gives the menu content a real z-index instead of an unset auto", async () => {
    // @zag-js/popper copies the content's *computed* z-index onto the
    // positioner the first time it positions the menu — "auto" (nothing
    // else sets one) would make the positioner "auto" too, and a host
    // page's own positioned, z-indexed header would then paint above it.
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" />);
    await openMenu();
    expect(getComputedStyle(screen.getByRole("menu")).zIndex).not.toBe("auto");
  });

  it("renders no logout entry without onLogout", async () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" />);
    await openMenu();
    expect(screen.queryByRole("menuitem", { name: "Log out" })).toBeNull();
  });

  it("renders logout as the last entry, marked dangerous, when onLogout is set", async () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" onLogout={() => {}} />);
    await openMenu();
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems.at(-1)?.textContent).toBe("Log out");
    expect(menuItems.at(-1)?.getAttribute("data-danger")).toBe("");
  });

  it("asks before logging out: onLogout only runs after confirmation, not on cancel", async () => {
    const onLogout = vi.fn();
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" onLogout={onLogout} />);

    await openMenu();
    await selectItem("Log out");
    expect(onLogout).not.toHaveBeenCalled();

    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(onLogout).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    await openMenu();
    await selectItem("Log out");
    const secondDialog = await screen.findByRole("dialog", { name: "Log out?" });
    fireEvent.click(within(secondDialog).getByRole("button", { name: "Log out" }));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("shows the logout dialog's catalog texts without an override", async () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" onLogout={() => {}} />);
    await openMenu();
    await selectItem("Log out");

    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    expect(within(dialog).getByText("You will be signed out of this session.")).not.toBeNull();
  });

  it("overrides the logout label and dialog texts individually", async () => {
    render(
      <AvatarMenu
        items={ITEMS}
        logoutConfirmMessage="Custom message."
        logoutConfirmText="Custom confirm"
        logoutConfirmTitle="Custom title"
        logoutLabel="Custom label"
        name="Ada Lovelace"
        onLogout={() => {}}
      />,
    );
    await openMenu();
    await selectItem("Custom label");

    const dialog = await screen.findByRole("dialog", { name: "Custom title" });
    expect(within(dialog).getByText("Custom message.")).not.toBeNull();
    expect(within(dialog).getByRole("button", { name: "Custom confirm" })).not.toBeNull();
  });
});

describe("AvatarMenu: texts of the logout dialog and the trigger", () => {
  it("overrides the cancel button of the logout dialog", async () => {
    const onLogout = vi.fn();
    render(
      <AvatarMenu
        items={ITEMS}
        logoutCancelText="Custom cancel"
        name="Ada Lovelace"
        onLogout={onLogout}
      />,
    );
    await openMenu();
    await selectItem("Log out");
    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    expect(within(dialog).queryByRole("button", { name: "Cancel" })).toBeNull();
    fireEvent.click(within(dialog).getByRole("button", { name: "Custom cancel" }));
    expect(onLogout).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("overrides the accessible name of the trigger, as a whole", () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" triggerLabel="Custom account menu" />);
    expect(screen.getByRole("button", { name: "Custom account menu" }).textContent).toBe(
      "Ada Lovelace",
    );
    expect(screen.queryByRole("button", { name: "Account menu for Ada Lovelace" })).toBeNull();
  });

  it("keeps the catalog texts without the overrides", async () => {
    render(<AvatarMenu items={ITEMS} name="Ada Lovelace" onLogout={() => {}} />);
    await openMenu();
    await selectItem("Log out");
    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    expect(within(dialog).getByRole("button", { name: "Cancel" })).not.toBeNull();
  });
});
