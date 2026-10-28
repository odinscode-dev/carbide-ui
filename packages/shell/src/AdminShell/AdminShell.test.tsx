// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminShell } from "./AdminShell.js";
import styles from "./AdminShell.module.css";

const GROUPS = [{ items: [{ id: "overview", label: "Overview" }] }];

afterEach(cleanup);

describe("AdminShell", () => {
  it("sets data-density compact and leaves data-theme to the system", () => {
    const { container } = render(
      <AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />,
    );
    const root = container.firstElementChild;
    expect(root?.getAttribute("data-density")).toBe("compact");
    expect(root?.getAttribute("data-theme")).toBeNull();
  });

  it("shows title, context and actions in the header bar", () => {
    render(
      <AdminShell
        actions={<button type="button">Export</button>}
        context="Site 12"
        navGroups={GROUPS}
        onNavigate={() => {}}
        title="Plant 3"
      />,
    );
    expect(screen.getByText("Plant 3")).not.toBeNull();
    expect(screen.getByText("Site 12")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Export" })).not.toBeNull();
  });

  it("shows the status strip in the header bar", () => {
    render(
      <AdminShell
        navGroups={GROUPS}
        onNavigate={() => {}}
        status={<span>3 awaiting approval</span>}
        title="Plant 3"
      />,
    );
    expect(screen.getByText("3 awaiting approval")).not.toBeNull();
    expect(screen.getByRole("banner").hasAttribute("data-status")).toBe(true);
  });

  it("leaves the status strip out without the status prop", () => {
    render(<AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />);
    expect(screen.getByRole("banner").hasAttribute("data-status")).toBe(false);
  });

  it("renders the nav logo above the navigation entries", () => {
    render(
      <AdminShell
        navGroups={GROUPS}
        navLogo={<span>Brand</span>}
        onNavigate={() => {}}
        title="Plant 3"
      />,
    );
    const nav = screen.getByRole("navigation");
    expect(nav.firstElementChild?.textContent).toBe("Brand");
  });

  it("pins the footer groups below the entries and reports their clicks", () => {
    const onNavigate = vi.fn();
    render(
      <AdminShell
        navFooterGroups={[{ items: [{ id: "sign-out", label: "Sign out" }] }]}
        navGroups={GROUPS}
        onNavigate={onNavigate}
        title="Plant 3"
      />,
    );
    const signOut = screen.getByRole("button", { name: "Sign out" });
    expect(screen.getByRole("navigation").lastElementChild?.contains(signOut)).toBe(true);
    fireEvent.click(signOut);
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("sign-out");
  });

  it("renders the navigation and reports a click via onNavigate", () => {
    const onNavigate = vi.fn();
    render(<AdminShell navGroups={GROUPS} onNavigate={onNavigate} title="Plant 3" />);
    fireEvent.click(screen.getByRole("button", { name: "Overview" }));
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("overview");
  });

  it("scrolls the main area by default and fills it with mainLayout fill", () => {
    const { rerender } = render(
      <AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />,
    );
    expect(screen.getByRole("main").getAttribute("data-layout")).toBe("scroll");
    rerender(
      <AdminShell mainLayout="fill" navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />,
    );
    expect(screen.getByRole("main").getAttribute("data-layout")).toBe("fill");
  });

  it("renders the content in the main area", () => {
    render(
      <AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3">
        Content
      </AdminShell>,
    );
    expect(screen.getByText("Content")).not.toBeNull();
  });

  it("leaves out the panel and the splitter without the panel prop", () => {
    render(<AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />);
    expect(screen.queryByRole("separator")).toBeNull();
    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("gives the main area its own flex sizing when there is no panel", () => {
    // Without this, ShellMain -- a plain flex: 0 1 auto child next to
    // ShellNav's fixed 256px -- shrink-wraps to its content instead of
    // filling the row, and a DataGrid inside asking for 100% of that
    // undetermined width collapses to 0. Only reproduces under real
    // layout, so this pins the DOM structure the fix depends on rather
    // than pixel widths jsdom cannot compute.
    render(<AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />);
    const main = screen.getByRole("main");
    expect(main.parentElement?.className).toBe(styles.mainOnly);
  });

  it("renders panel and a splitter handle with the panel prop", () => {
    render(
      <AdminShell navGroups={GROUPS} onNavigate={() => {}} panel="Details" title="Plant 3">
        Content
      </AdminShell>,
    );
    expect(screen.getByRole("complementary")).not.toBeNull();
    expect(screen.getByText("Details")).not.toBeNull();

    const handle = screen.getByRole("separator");
    expect(handle.getAttribute("aria-orientation")).toBe("horizontal");
    expect(handle.getAttribute("tabindex")).toBe("0");
    expect(handle.getAttribute("aria-controls")).toMatch(/:main .*:panel|:panel .*:main/);
  });
});

describe("AdminShell panelSize", () => {
  const mainShare = (panelSize?: number) => {
    render(
      <AdminShell
        navGroups={GROUPS}
        onNavigate={() => {}}
        panel="Details"
        panelSize={panelSize}
        title="Plant 3"
      />,
    );
    const value = screen.getByRole("separator").getAttribute("aria-valuenow");
    cleanup();
    return value;
  };

  it("starts the panel at 25 percent by default", () => {
    expect(mainShare()).toBe("75");
  });

  it("starts the panel at the given share", () => {
    expect(mainShare(40)).toBe("60");
  });

  it("starts a panel that appears later at its own size, not the mount's", () => {
    const { rerender } = render(
      <AdminShell navGroups={GROUPS} onNavigate={() => {}} title="Plant 3" />,
    );
    rerender(
      <AdminShell
        navGroups={GROUPS}
        onNavigate={() => {}}
        panel="Details"
        panelSize={40}
        title="Plant 3"
      />,
    );
    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe("60");
  });

  it("holds the start to the splitter's limits", () => {
    expect(mainShare(90)).toBe("30");
    expect(mainShare(5)).toBe("85");
    expect(mainShare(Number.NaN)).toBe("75");
  });
});
