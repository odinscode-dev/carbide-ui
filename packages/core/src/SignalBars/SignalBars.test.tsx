// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SignalBars, signalLevel } from "./SignalBars.js";

afterEach(cleanup);

describe("signalLevel", () => {
  it("lights one bar for any signal and one more per level reached", () => {
    expect(signalLevel(null)).toBe(0);
    expect(signalLevel(-90)).toBe(1);
    expect(signalLevel(-75)).toBe(2);
    expect(signalLevel(-60)).toBe(3);
    expect(signalLevel(-40)).toBe(4);
    expect(signalLevel(-60, [-60, -50, -40])).toBe(2);
  });
});

describe("SignalBars", () => {
  it("names the signal and lights its bars", () => {
    render(<SignalBars dbm={-62.4} />);
    const root = screen.getByRole("img", { name: "Signal: -62 dBm" });
    expect(root.dataset.level).toBe("3");
    expect(root.querySelectorAll("[data-lit]")).toHaveLength(3);
  });

  it("says so without a signal", () => {
    render(<SignalBars dbm={null} />);
    expect(screen.getByRole("img", { name: "No signal" }).dataset.level).toBe("0");
  });
});
