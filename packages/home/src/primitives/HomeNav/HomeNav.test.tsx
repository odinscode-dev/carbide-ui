// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buttonOf } from "../../test/dom.js";
import type { HomeNavGroup } from "./HomeNav.js";
import { HomeNav } from "./HomeNav.js";

const GROUPS: HomeNavGroup[] = [
  { label: "General", items: [{ id: "overview", label: "Overview", icon: <span /> }] },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users", icon: <span /> },
      { id: "settings", label: "Settings", icon: <span /> },
    ],
  },
];

afterEach(cleanup);

describe("HomeNav", () => {
  it("renders every group as aria-label, never as visible text", () => {
    render(<HomeNav groups={GROUPS} onNavigate={() => {}} />);
    expect(screen.getByRole("group", { name: "General" })).not.toBeNull();
    expect(screen.getByRole("group", { name: "Administration" })).not.toBeNull();
    expect(screen.queryByText("General")).toBeNull();
  });

  it("renders every entry as a button with aria-label, the button itself carries no visible text", () => {
    render(<HomeNav groups={GROUPS} onNavigate={() => {}} />);
    const overview = screen.getByRole("button", { name: "Overview" });
    const users = screen.getByRole("button", { name: "Users" });
    expect(overview.textContent).toBe("");
    expect(users.textContent).toBe("");
  });

  it("carries the active entry as aria-current and data-active", () => {
    render(<HomeNav active="users" groups={GROUPS} onNavigate={() => {}} />);
    const activeButton = screen.getByRole("button", { name: "Users" });
    const inactiveButton = screen.getByRole("button", { name: "Overview" });
    expect(activeButton.getAttribute("aria-current")).toBe("page");
    expect(activeButton.getAttribute("data-active")).toBe("");
    expect(inactiveButton.getAttribute("aria-current")).toBeNull();
    expect(inactiveButton.getAttribute("data-active")).toBeNull();
  });

  it("calls onNavigate with the clicked entry's id", () => {
    const onNavigate = vi.fn();
    render(<HomeNav groups={GROUPS} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("settings");
  });

  it("names the navigation from the catalog, overridable", () => {
    const { rerender } = render(<HomeNav groups={GROUPS} onNavigate={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).not.toBeNull();

    rerender(<HomeNav groups={GROUPS} label="Sections" onNavigate={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Sections" })).not.toBeNull();
  });

  it("renders footer actions as icon buttons above logout, with tone and click", () => {
    const onClick = vi.fn();
    render(
      <HomeNav
        actions={[
          { id: "vault", label: "Unlock vault", icon: <span />, onClick, tone: "warn" },
          { id: "off", label: "Maintenance", icon: <span />, onClick: () => {}, disabled: true },
        ]}
        groups={GROUPS}
        onLogout={() => {}}
        onNavigate={() => {}}
      />,
    );
    const vault = screen.getByRole("button", { name: "Unlock vault" });
    const logout = screen.getByRole("button", { name: "Log out" });
    expect(vault.getAttribute("data-tone")).toBe("warn");
    expect(vault.textContent).toBe("");
    expect(vault.compareDocumentPosition(logout) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(buttonOf(screen.getByRole("button", { name: "Maintenance" })).disabled).toBe(true);

    fireEvent.click(vault);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders the footer with actions alone, without a logout button", () => {
    render(
      <HomeNav
        actions={[{ id: "vault", label: "Unlock vault", icon: <span />, onClick: () => {} }]}
        groups={GROUPS}
        onNavigate={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Unlock vault" }).getAttribute("data-tone")).toBe(
      "neutral",
    );
    expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();
  });

  it("renders no logo and no logout button without the respective prop", () => {
    render(<HomeNav groups={GROUPS} onNavigate={() => {}} />);
    expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();
  });

  it("renders the logo when `logo` is set", () => {
    render(<HomeNav groups={GROUPS} logo={<span>Logo</span>} onNavigate={() => {}} />);
    expect(screen.getByText("Logo")).not.toBeNull();
  });

  it("asks before logging out: onLogout only runs after confirmation, not on cancel", async () => {
    const onLogout = vi.fn();
    render(<HomeNav groups={GROUPS} onLogout={onLogout} onNavigate={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(onLogout).not.toHaveBeenCalled();

    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(onLogout).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    const secondDialog = await screen.findByRole("dialog", { name: "Log out?" });
    fireEvent.click(within(secondDialog).getByRole("button", { name: "Log out" }));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("shows the logout dialog's catalog texts without an override", async () => {
    render(<HomeNav groups={GROUPS} onLogout={() => {}} onNavigate={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    expect(within(dialog).getByText("You will be signed out of this session.")).not.toBeNull();
    expect(within(dialog).getByRole("button", { name: "Log out" })).not.toBeNull();
  });

  it("overrides title, message and confirm text of the logout dialog individually", async () => {
    render(
      <HomeNav
        groups={GROUPS}
        logoutConfirmMessage="You will be logged out of this session."
        logoutConfirmText="Log out"
        logoutConfirmTitle="Log out?"
        onLogout={() => {}}
        onNavigate={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    expect(within(dialog).getByText("You will be logged out of this session.")).not.toBeNull();
    expect(within(dialog).getByRole("button", { name: "Log out" })).not.toBeNull();
  });

  it("overrides the cancel button of the logout dialog", async () => {
    render(
      <HomeNav
        groups={GROUPS}
        logoutCancelText="Abbrechen"
        onLogout={() => {}}
        onNavigate={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Abbrechen" })).not.toBeNull();
    expect(within(dialog).queryByRole("button", { name: "Cancel" })).toBeNull();
  });

  it("carries the group color as data-color", () => {
    const coloredGroups: HomeNavGroup[] = [
      {
        color: "blue",
        label: "General",
        items: [{ id: "overview", label: "Overview", icon: <span /> }],
      },
    ];
    render(<HomeNav groups={coloredGroups} onNavigate={() => {}} />);
    expect(screen.getByRole("group", { name: "General" }).getAttribute("data-color")).toBe("blue");
  });

  it("leaves out data-color when the group has no color", () => {
    render(<HomeNav groups={GROUPS} onNavigate={() => {}} />);
    expect(screen.getByRole("group", { name: "General" }).hasAttribute("data-color")).toBe(false);
  });

  it("moves focus with arrow down/up across groups, wrapping around", () => {
    render(<HomeNav groups={GROUPS} onNavigate={() => {}} />);
    const overview = screen.getByRole("button", { name: "Overview" });
    const users = screen.getByRole("button", { name: "Users" });
    const settings = screen.getByRole("button", { name: "Settings" });

    overview.focus();
    fireEvent.keyDown(overview, { key: "ArrowDown" });
    expect(document.activeElement).toBe(users);

    fireEvent.keyDown(users, { key: "ArrowDown" });
    expect(document.activeElement).toBe(settings);

    fireEvent.keyDown(settings, { key: "ArrowDown" });
    expect(document.activeElement).toBe(overview);

    fireEvent.keyDown(overview, { key: "ArrowUp" });
    expect(document.activeElement).toBe(settings);
  });
});
