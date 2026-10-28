// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu, type MenuItem } from "./Menu.js";

const ITEMS: MenuItem[] = [
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete", danger: true, group: "danger" },
];

const ROLES: MenuItem[] = [
  { id: "admin", label: "Admin", content: <em>Admin role</em> },
  { id: "user", label: "User" },
];

afterEach(cleanup);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function open() {
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
  await screen.findByRole("menu");
}

async function choose(role: "menuitem" | "menuitemradio", name: string) {
  const item = screen.getByRole(role, { name });
  fireEvent.pointerDown(item, { button: 0, isPrimary: true, pointerId: 1, pointerType: "mouse" });
  await delay(20);
  fireEvent.click(item);
}

describe("Menu", () => {
  it("opens from the element it is given as the trigger", async () => {
    render(<Menu items={ITEMS} trigger={<button type="button">Open</button>} />);
    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
    await open();
    expect(screen.getByRole("menuitem", { name: "Edit" })).not.toBeNull();
  });

  it("calls onItemSelect with the id of the chosen entry", async () => {
    const onItemSelect = vi.fn();
    render(
      <Menu
        items={ITEMS}
        onItemSelect={onItemSelect}
        trigger={<button type="button">Open</button>}
      />,
    );
    await open();
    await choose("menuitem", "Edit");
    expect(onItemSelect).toHaveBeenCalledExactlyOnceWith("edit");
  });

  it("marks a dangerous entry and divides the groups with a separator", async () => {
    render(<Menu items={ITEMS} trigger={<button type="button">Open</button>} />);
    await open();
    expect(screen.getByRole("menuitem", { name: "Delete" }).getAttribute("data-danger")).toBe("");
    expect(screen.getByRole("menu").querySelector('[data-part="separator"]')).not.toBeNull();
  });

  it("shows an entry's own content and keeps its label as the name", async () => {
    render(<Menu items={ROLES} trigger={<button type="button">Open</button>} value="user" />);
    await open();
    expect(screen.getByRole("menuitemradio", { name: "Admin role" }).textContent).toBe(
      "Admin role",
    );
  });

  it("checks the current entry and only that one", async () => {
    render(<Menu items={ROLES} trigger={<button type="button">Open</button>} value="user" />);
    await open();
    expect(screen.getByRole("menuitemradio", { name: "User" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(
      screen.getByRole("menuitemradio", { name: "Admin role" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("reports a choice among radio entries through onItemSelect", async () => {
    const onItemSelect = vi.fn();
    render(
      <Menu
        items={ROLES}
        onItemSelect={onItemSelect}
        trigger={<button type="button">Open</button>}
        value="user"
      />,
    );
    await open();
    await choose("menuitemradio", "Admin role");
    expect(onItemSelect).toHaveBeenCalledExactlyOnceWith("admin");
  });

  it("gives the menu a real z-index instead of an unset auto", async () => {
    render(<Menu items={ITEMS} trigger={<button type="button">Open</button>} />);
    await open();
    expect(getComputedStyle(screen.getByRole("menu")).zIndex).not.toBe("auto");
  });
});

describe("Menu entry names", () => {
  it("uses name as the accessible name while the text stays visible", async () => {
    render(
      <Menu
        items={[{ id: "delete", label: "Delete", name: "Delete: Laptop" }]}
        trigger={<button type="button">Open</button>}
      />,
    );
    await open();
    const item = screen.getByRole("menuitem", { name: "Delete: Laptop" });
    expect(item.textContent).toBe("Delete");
  });
});
