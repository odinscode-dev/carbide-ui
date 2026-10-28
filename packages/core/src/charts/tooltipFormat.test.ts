import { describe, expect, it } from "vitest";
import { formatDateTime } from "../format/date.js";
import { formatNumber } from "../format/number.js";
import { formatQuantity } from "../format/quantity.js";
import { formatTooltipLabel, formatTooltipRange, formatTooltipValue } from "./tooltipFormat.js";

describe("formatTooltipValue", () => {
  it("without a unit, like formatNumber", () => {
    expect(formatTooltipValue(12.5, "Probe 1", {})).toBe(formatNumber(12.5));
  });

  it("with a unit, like formatQuantity", () => {
    expect(formatTooltipValue(2.4, "Pressure", { Pressure: "bar" })).toBe(
      formatQuantity(2.4, "bar"),
    );
  });

  it("the unit applies only to its own series name", () => {
    expect(formatTooltipValue(12.5, "Probe 1", { Pressure: "bar" })).toBe(formatNumber(12.5));
  });
});

describe("formatTooltipValue, own style", () => {
  it("a format function wins over the unit's digits", () => {
    expect(
      formatTooltipValue(
        24.55,
        "Air",
        { Air: "°C" },
        { Air: { unit: "°C", format: (v) => v.toFixed(2) } },
      ),
    ).toBe("24.55");
  });

  it("the unit label follows the value", () => {
    expect(
      formatTooltipValue(
        1.28,
        "VPD",
        {},
        { VPD: { format: (v) => v.toFixed(2), unitLabel: "kPa" } },
      ),
    ).toBe("1.28 kPa");
  });

  it("a unit label alone labels the locale's default number", () => {
    expect(formatTooltipValue(812, "CO2", {}, { CO2: { unitLabel: "ppm" } })).toBe(
      `${formatNumber(812)} ppm`,
    );
  });

  it("a series without a style keeps its unit", () => {
    expect(formatTooltipValue(2.4, "Pressure", { Pressure: "bar" }, { Other: {} })).toBe(
      formatQuantity(2.4, "bar"),
    );
  });
});

describe("formatTooltipLabel", () => {
  it("formats epoch milliseconds like formatDateTime", () => {
    const at = Date.UTC(2026, 8, 10, 14, 30);
    expect(formatTooltipLabel(at)).toBe(formatDateTime(new Date(at)));
  });
});

describe("formatTooltipLabel by resolution", () => {
  it("a day shows the date only", () => {
    expect(formatTooltipLabel(Date.UTC(2026, 8, 29), "day", "de-DE")).toBe("29.09.2026");
  });

  it("a moment honours the locale", () => {
    const at = Date.UTC(2026, 8, 10, 14, 30);
    expect(formatTooltipLabel(at, "time", "en-US")).toBe(
      formatDateTime(new Date(at), { locale: "en-US" }),
    );
  });
});

describe("formatTooltipRange", () => {
  it("shows both ends in the series' own format", () => {
    const styles = { T: { format: (value: number) => value.toFixed(1), unitLabel: "°C" } };
    expect(formatTooltipRange(18, 26.4, "T", {}, styles)).toBe("18.0 °C – 26.4 °C");
  });
});
