// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FieldShell } from "./FieldShell.js";

const TABS = [
  { id: "monitoring", label: "Monitoring", icon: <span>M</span> },
  { id: "worklog", label: "Work log", icon: <span>W</span> },
];

afterEach(cleanup);

describe("FieldShell", () => {
  it("sets data-density large and leaves data-theme to the system", () => {
    const { container } = render(
      <FieldShell activeTab="monitoring" onTabChange={() => {}} tabs={TABS} title="Plant 3" />,
    );
    const root = container.firstElementChild;
    expect(root?.getAttribute("data-density")).toBe("large");
    expect(root?.getAttribute("data-theme")).toBeNull();
  });

  it("shows title, context and actions in the header bar", () => {
    render(
      <FieldShell
        actions={<button type="button">Export</button>}
        activeTab="monitoring"
        context="Line 2"
        onTabChange={() => {}}
        tabs={TABS}
        title="Plant 3"
      />,
    );
    expect(screen.getByText("Plant 3")).not.toBeNull();
    expect(screen.getByText("Line 2")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Export" })).not.toBeNull();
  });

  it("renders the active section's content", () => {
    render(
      <FieldShell activeTab="monitoring" onTabChange={() => {}} tabs={TABS} title="Plant 3">
        Content
      </FieldShell>,
    );
    expect(screen.getByText("Content")).not.toBeNull();
  });

  it("renders the tab bar and reports a change via onTabChange", () => {
    const onTabChange = vi.fn();
    render(
      <FieldShell activeTab="monitoring" onTabChange={onTabChange} tabs={TABS} title="Plant 3" />,
    );
    expect(screen.getByRole("button", { name: /Work log/ }).getAttribute("data-active")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Work log/ }));
    expect(onTabChange).toHaveBeenCalledExactlyOnceWith("worklog");
  });

  it("marks activeTab in the tab bar", () => {
    render(<FieldShell activeTab="worklog" onTabChange={() => {}} tabs={TABS} title="Plant 3" />);
    expect(screen.getByRole("button", { name: /Work log/ }).getAttribute("data-active")).toBe("");
  });

  it("lets tabBarLabel override the tab bar's catalog name", () => {
    render(
      <FieldShell
        activeTab="monitoring"
        onTabChange={() => {}}
        tabBarLabel="Areas"
        tabs={TABS}
        title="Plant 3"
      />,
    );
    expect(screen.getByRole("navigation", { name: "Areas" })).not.toBeNull();
  });
});
