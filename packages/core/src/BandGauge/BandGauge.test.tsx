// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BandGauge, type BandGaugeZone, gaugePosition } from "./BandGauge.js";

afterEach(cleanup);

const ZONES: BandGaugeZone[] = [
  { from: 25, to: 30, tone: "alarm" },
  { from: 0, to: 20, tone: "alarm" },
  { from: 20, to: 25, tone: "ok" },
];

describe("gaugePosition", () => {
  it("maps a value onto the scale and clamps it to the ends", () => {
    expect(gaugePosition(15, 0, 30)).toBe(50);
    expect(gaugePosition(-5, 0, 30)).toBe(0);
    expect(gaugePosition(40, 0, 30)).toBe(100);
    expect(gaugePosition(5, 10, 10)).toBe(0);
  });
});

describe("BandGauge", () => {
  it("is a meter named by its label, with the reading as text", () => {
    render(<BandGauge label="Temperature" max={30} min={0} value={22.5} zones={ZONES} />);
    const meter = screen.getByRole("meter", { name: "Temperature" });
    if (!(meter instanceof HTMLMeterElement)) throw new Error("not a native meter");
    expect([meter.value, meter.min, meter.max]).toEqual([22.5, 0, 30]);
    expect(meter.getAttribute("aria-valuetext")).toBe("22.5");
  });

  it("draws the zones in scale order with their tone", () => {
    const { container } = render(<BandGauge label="T" max={30} min={0} value={1} zones={ZONES} />);
    const tones = [...container.querySelectorAll("[data-tone]")].map((zone) =>
      zone.getAttribute("data-tone"),
    );
    expect(tones).toEqual(["alarm", "ok", "alarm"]);
  });

  it("names the second reading in the accessible text, with an overridable label", () => {
    render(
      <BandGauge
        format={(v) => `${v} °C`}
        label="T"
        max={30}
        min={0}
        secondary={26}
        value={25}
        zones={ZONES}
      />,
    );
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("25 °C, Forecast 26 °C");
    cleanup();
    render(
      <BandGauge
        label="T"
        max={30}
        min={0}
        secondary={26}
        secondaryLabel="Prognose"
        value={25}
        zones={ZONES}
      />,
    );
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("25, Prognose 26");
  });

  it("without a reading marks the root empty and says so", () => {
    const { container } = render(
      <BandGauge label="T" max={30} min={0} value={null} zones={ZONES} />,
    );
    expect(container.firstElementChild?.hasAttribute("data-empty")).toBe(true);
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("No reading");
    expect(screen.getByRole("meter").hasAttribute("value")).toBe(false);
  });

  it("labels the given ticks", () => {
    render(<BandGauge label="T" max={30} min={0} ticks={[20, 25]} value={22} zones={ZONES} />);
    expect(screen.getByText("20")).toBeTruthy();
    expect(screen.getByText("25")).toBeTruthy();
  });
});
