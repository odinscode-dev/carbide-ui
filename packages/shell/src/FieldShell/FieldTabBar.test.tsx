// @vitest-environment jsdom

import "../../../token/src/tokens.css";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { htmlOf, must } from "../test/dom.js";
import { FieldTabBar } from "./FieldTabBar.js";

const TABS = [
  { id: "monitoring", label: "Monitoring", icon: <span>M</span> },
  { id: "worklog", label: "Work log", icon: <span>W</span> },
  { id: "alarms", label: "Alarms", icon: <span>A</span> },
];

afterEach(cleanup);

describe("FieldTabBar", () => {
  it("renders every tab with an icon and a caption", () => {
    render(<FieldTabBar active="monitoring" onChange={() => {}} tabs={TABS} />);
    expect(screen.getByText("Monitoring")).not.toBeNull();
    expect(screen.getByText("Work log")).not.toBeNull();
    expect(screen.getByText("Alarms")).not.toBeNull();
    expect(screen.getByText("M")).not.toBeNull();
  });

  it("marks the active tab via data-active and aria-current", () => {
    render(<FieldTabBar active="worklog" onChange={() => {}} tabs={TABS} />);
    const activeButton = screen.getByRole("button", { name: /Work log/ });
    const inactiveButton = screen.getByRole("button", { name: /Monitoring/ });
    expect(activeButton.getAttribute("data-active")).toBe("");
    expect(activeButton.getAttribute("aria-current")).toBe("page");
    expect(inactiveButton.getAttribute("data-active")).toBeNull();
    expect(inactiveButton.getAttribute("aria-current")).toBeNull();
  });

  it("reports a click via onChange with the tab's id", () => {
    const onChange = vi.fn();
    render(<FieldTabBar active="monitoring" onChange={onChange} tabs={TABS} />);
    fireEvent.click(screen.getByRole("button", { name: /Alarms/ }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("alarms");
  });

  it("takes Sections from the catalog as the default name for the bar, overridable", () => {
    render(<FieldTabBar active="monitoring" onChange={() => {}} tabs={TABS} />);
    expect(screen.getByRole("navigation", { name: "Sections" })).not.toBeNull();

    cleanup();
    render(<FieldTabBar active="monitoring" label="Areas" onChange={() => {}} tabs={TABS} />);
    expect(screen.getByRole("navigation", { name: "Areas" })).not.toBeNull();
  });

  it("ties the taps' minimum size to --carbide-touch-min, which is 44px under large", () => {
    const { container } = render(
      <div data-density="large">
        <FieldTabBar active="monitoring" onChange={() => {}} tabs={TABS} />
      </div>,
    );
    const root = htmlOf(container.firstElementChild);
    expect(getComputedStyle(root).getPropertyValue("--carbide-touch-min").trim()).toBe("44px");

    const button = must(screen.getAllByRole("button")[0]);
    const style = getComputedStyle(button);
    expect(style.minBlockSize).toBe("var(--carbide-touch-min)");
    expect(style.minInlineSize).toBe("var(--carbide-touch-min)");
  });
});
