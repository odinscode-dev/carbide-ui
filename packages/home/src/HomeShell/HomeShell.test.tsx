// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { HomeNavGroup } from "../primitives/HomeNav/index.js";
import { HomeShell } from "./HomeShell.js";

const GROUPS: HomeNavGroup[] = [
  { label: "General", items: [{ id: "overview", label: "Overview", icon: <span /> }] },
];

afterEach(cleanup);

describe("HomeShell", () => {
  it("leaves data-theme and data-density unset without a prop", () => {
    const { container } = render(<HomeShell navGroups={GROUPS} onNavigate={() => {}} />);
    const root = container.firstElementChild;
    expect(root?.getAttribute("data-theme")).toBeNull();
    expect(root?.getAttribute("data-density")).toBeNull();
  });

  it("sets data-theme and data-density from the props", () => {
    const { container } = render(
      <HomeShell density="large" navGroups={GROUPS} onNavigate={() => {}} theme="dark" />,
    );
    const root = container.firstElementChild;
    expect(root?.getAttribute("data-theme")).toBe("dark");
    expect(root?.getAttribute("data-density")).toBe("large");
  });

  it("leaves data-surface unset by default and for carbon", () => {
    const { container, rerender } = render(<HomeShell navGroups={GROUPS} onNavigate={() => {}} />);
    expect(container.firstElementChild?.getAttribute("data-surface")).toBeNull();
    rerender(<HomeShell navGroups={GROUPS} onNavigate={() => {}} surface="carbon" />);
    expect(container.firstElementChild?.getAttribute("data-surface")).toBeNull();
  });

  it("sets data-surface=home for the home surface", () => {
    const { container } = render(
      <HomeShell navGroups={GROUPS} onNavigate={() => {}} surface="home" />,
    );
    expect(container.firstElementChild?.getAttribute("data-surface")).toBe("home");
  });

  it("mirrors the home surface on the document element for portaled overlays, and cleans up", () => {
    const { unmount } = render(
      <HomeShell navGroups={GROUPS} onNavigate={() => {}} surface="home" />,
    );
    expect(document.documentElement.getAttribute("data-surface")).toBe("home");
    unmount();
    expect(document.documentElement.getAttribute("data-surface")).toBeNull();
  });

  it("does not touch the document element without the home surface", () => {
    render(<HomeShell navGroups={GROUPS} onNavigate={() => {}} />);
    expect(document.documentElement.getAttribute("data-surface")).toBeNull();
  });

  it("renders the navigation and reports a click via onNavigate", () => {
    const onNavigate = vi.fn();
    render(<HomeShell navGroups={GROUPS} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Overview" }));
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("overview");
  });

  it("passes logo and onLogout through to the navigation", async () => {
    const onLogout = vi.fn();
    render(
      <HomeShell
        logo={<span>Logo</span>}
        navGroups={GROUPS}
        onLogout={onLogout}
        onNavigate={() => {}}
      />,
    );
    expect(screen.getByText("Logo")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Log out" }));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("passes the logout dialog's texts through to the navigation", async () => {
    render(
      <HomeShell
        logoutConfirmMessage="You will be logged out of this session."
        logoutConfirmText="Log out"
        logoutConfirmTitle="Log out?"
        navGroups={GROUPS}
        onLogout={() => {}}
        onNavigate={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    const dialog = await screen.findByRole("dialog", { name: "Log out?" });
    expect(within(dialog).getByText("You will be logged out of this session.")).not.toBeNull();
    expect(within(dialog).getByRole("button", { name: "Log out" })).not.toBeNull();
  });

  it("passes navActions through to the navigation", () => {
    const onClick = vi.fn();
    render(
      <HomeShell
        navActions={[{ id: "vault", label: "Unlock vault", icon: <span />, onClick }]}
        navGroups={GROUPS}
        onNavigate={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Unlock vault" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders the content in the main area", () => {
    render(
      <HomeShell navGroups={GROUPS} onNavigate={() => {}}>
        Content
      </HomeShell>,
    );
    expect(screen.getByText("Content")).not.toBeNull();
  });
});
