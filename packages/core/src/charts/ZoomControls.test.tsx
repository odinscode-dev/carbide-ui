// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LineChart } from "./LineChart.js";
import type { ChartSeries } from "./types.js";
import type { ChartDomain } from "./zoom.js";

interface Row {
  at: number;
  value: number;
}

const DATA: Row[] = Array.from({ length: 11 }, (_, index) => ({
  at: index * 100_000_000,
  value: index,
}));
const SERIES: ChartSeries<Row>[] = [{ id: "v", name: "Value", slot: 1, accessorKey: "value" }];

afterEach(cleanup);

function chart(domain: ChartDomain | undefined, onDomainChange = vi.fn()) {
  render(<LineChart data={DATA} domain={domain} onDomainChange={onDomainChange} series={SERIES} />);
  return onDomainChange;
}

describe("zoom controls", () => {
  it("offers none without onDomainChange", () => {
    render(<LineChart data={DATA} series={SERIES} />);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("zooms in around the middle by halving the stretch", () => {
    const onDomainChange = chart(undefined);
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(onDomainChange).toHaveBeenCalledExactlyOnceWith([250_000_000, 750_000_000]);
  });

  it("has nothing to zoom out or reset while it shows everything", () => {
    chart(undefined);
    expect(screen.getByRole("button", { name: "Zoom out" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Reset zoom" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Move left" })).toBeNull();
  });

  it("shows the reset button and the panning buttons once zoomed, and marks the state", () => {
    chart([250_000_000, 750_000_000]);
    expect(screen.getByRole("button", { name: "Reset zoom" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Move left" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Move right" })).not.toBeNull();
    expect(screen.getByRole("toolbar").parentElement?.getAttribute("data-zoomed")).toBe("");
  });

  it("takes the zoom back with null", () => {
    const onDomainChange = chart([250_000_000, 750_000_000]);
    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));
    expect(onDomainChange).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("zooms out to everything as null, not as the whole span", () => {
    const onDomainChange = chart([250_000_000, 750_000_000]);
    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(onDomainChange).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("moves half a stretch sideways", () => {
    const onDomainChange = chart([200_000_000, 600_000_000]);
    fireEvent.click(screen.getByRole("button", { name: "Move right" }));
    expect(onDomainChange).toHaveBeenCalledExactlyOnceWith([400_000_000, 800_000_000]);
  });

  it("cannot move past the ends of the data", () => {
    chart([0, 400_000_000]);
    expect(screen.getByRole("button", { name: "Move left" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Move right" }).hasAttribute("disabled")).toBe(false);
  });

  it("uses the texts it is given", () => {
    render(
      <LineChart
        data={DATA}
        domain={[250_000_000, 750_000_000]}
        onDomainChange={() => {}}
        series={SERIES}
        zoomTexts={{ reset: "Show everything", zoomIn: "Enlarge" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Show everything" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Enlarge" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Zoom out" })).not.toBeNull();
  });

  it("stops zooming in at the narrowest stretch", () => {
    chart([500_000_000, 500_000_000 + 60_000]);
    expect(screen.getByRole("button", { name: "Zoom in" }).hasAttribute("disabled")).toBe(true);
  });
});
