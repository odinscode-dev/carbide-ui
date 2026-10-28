// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ShellNavGroup } from "./ShellNav.js";
import { ShellNav } from "./ShellNav.js";

const GROUPS: ShellNavGroup[] = [
  { items: [{ id: "overview", label: "Overview" }] },
  { label: "Administration", items: [{ id: "users", label: "Users" }] },
];

afterEach(cleanup);

describe("ShellNav", () => {
  it("renders groups with and without a heading", () => {
    render(<ShellNav groups={GROUPS} onNavigate={() => {}} />);
    expect(screen.getByText("Administration")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Overview" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Users" })).not.toBeNull();
  });

  it("carries the active entry as aria-current and data-active", () => {
    render(<ShellNav active="users" groups={GROUPS} onNavigate={() => {}} />);
    const activeButton = screen.getByRole("button", { name: "Users" });
    const inactiveButton = screen.getByRole("button", { name: "Overview" });
    expect(activeButton.getAttribute("aria-current")).toBe("page");
    expect(activeButton.getAttribute("data-active")).toBe("");
    expect(inactiveButton.getAttribute("aria-current")).toBeNull();
    expect(inactiveButton.getAttribute("data-active")).toBeNull();
  });

  it("calls onNavigate with the clicked entry's id", () => {
    const onNavigate = vi.fn();
    render(<ShellNav groups={GROUPS} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Users" }));
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("users");
  });

  it("shows an item's description when given one", () => {
    const groups: ShellNavGroup[] = [
      { items: [{ id: "overview", label: "Overview", description: "Plant-wide status" }] },
    ];
    render(<ShellNav groups={groups} onNavigate={() => {}} />);
    expect(screen.getByText("Plant-wide status")).not.toBeNull();
  });

  it("takes list as the default layout and carries it as data-layout", () => {
    const { container } = render(<ShellNav groups={GROUPS} onNavigate={() => {}} />);
    expect(container.querySelector("nav")?.getAttribute("data-layout")).toBe("list");
  });

  it("carries the grid layout as data-layout and renders the logo slot", () => {
    const { container } = render(
      <ShellNav groups={GROUPS} layout="grid" logo={<span>Plant 3</span>} onNavigate={() => {}} />,
    );
    expect(container.querySelector("nav")?.getAttribute("data-layout")).toBe("grid");
    expect(screen.getByText("Plant 3")).not.toBeNull();
  });

  it("carries a group's accent as a custom property on its list", () => {
    const groups: ShellNavGroup[] = [
      { accent: "rgb(1, 2, 3)", items: [{ id: "overview", label: "Overview" }] },
      { items: [{ id: "users", label: "Users" }] },
    ];
    render(<ShellNav groups={groups} onNavigate={() => {}} />);
    const accented = screen.getByRole("button", { name: "Overview" }).closest("ul");
    const plain = screen.getByRole("button", { name: "Users" }).closest("ul");
    expect(accented?.style.getPropertyValue("--shell-nav-accent")).toBe("rgb(1, 2, 3)");
    expect(plain?.style.getPropertyValue("--shell-nav-accent")).toBe("");
  });

  it("renders footer groups below the scrollable main groups and navigates the same way", () => {
    const onNavigate = vi.fn();
    const footerGroups: ShellNavGroup[] = [
      {
        items: [
          { id: "settings", label: "Settings" },
          { id: "logout", label: "Log out" },
        ],
      },
    ];
    render(<ShellNav footerGroups={footerGroups} groups={GROUPS} onNavigate={onNavigate} />);
    const logoutButton = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(logoutButton);
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("logout");
  });

  it("omits the footer entirely when no footer groups are given", () => {
    const { container } = render(<ShellNav groups={GROUPS} onNavigate={() => {}} />);
    expect(container.querySelector('[class*="footer"]')).toBeNull();
  });

  it("names the navigation from the catalog, overridable", () => {
    const { rerender } = render(<ShellNav groups={GROUPS} onNavigate={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).not.toBeNull();

    rerender(<ShellNav groups={GROUPS} label="Sections" onNavigate={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Sections" })).not.toBeNull();
  });
});
