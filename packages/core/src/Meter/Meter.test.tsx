// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Meter, meterShare } from "./Meter.js";

afterEach(cleanup);

describe("meterShare", () => {
  it("maps a value onto the scale and clamps it", () => {
    expect(meterShare(40, 0, 100)).toBe(40);
    expect(meterShare(150, 0, 100)).toBe(100);
    expect(meterShare(-1, 0, 100)).toBe(0);
    expect(meterShare(3, 2, 2)).toBe(0);
  });
});

describe("Meter", () => {
  it("is a native meter named by its label", () => {
    render(<Meter format={(v) => `${v} %`} label="Exhaust" value={40} />);
    const meter = screen.getByRole("meter", { name: "Exhaust" });
    if (!(meter instanceof HTMLMeterElement)) throw new Error("not a native meter");
    expect([meter.value, meter.min, meter.max]).toEqual([40, 0, 100]);
    expect(meter.getAttribute("aria-valuetext")).toBe("40 %");
  });

  it("draws marks with their label and the colour as a custom property", () => {
    const { container } = render(
      <Meter color="red" label="Exhaust" marks={[{ value: 20, label: "Minimum" }]} value={40} />,
    );
    const root = container.firstElementChild;
    if (!(root instanceof HTMLElement)) throw new Error("no root");
    expect(root.style.getPropertyValue("--carbide-meter-color")).toBe("red");
    expect(container.querySelector("[title='Minimum 20']")).not.toBeNull();
  });
});
