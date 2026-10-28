// @vitest-environment jsdom

import { t } from "@odinscode/carbide-core";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomeChartTile } from "./HomeChartTile.js";

afterEach(cleanup);

describe("HomeChartTile", () => {
  it("shows the title in the rotate hint", () => {
    render(
      <HomeChartTile id="moisture" title="Soil moisture">
        <div>Chart</div>
      </HomeChartTile>,
    );
    expect(screen.getByText("Soil moisture")).not.toBeNull();
  });

  it("shows the hint text from the catalog, overridable via a prop", () => {
    const { rerender } = render(
      <HomeChartTile id="moisture" title="Soil moisture">
        <div>Chart</div>
      </HomeChartTile>,
    );
    expect(screen.getByText(t("homeChartTile.rotateHint"))).not.toBeNull();

    rerender(
      <HomeChartTile id="moisture" rotateHint="Turn your phone" title="Soil moisture">
        <div>Chart</div>
      </HomeChartTile>,
    );
    expect(screen.getByText("Turn your phone")).not.toBeNull();
    expect(screen.queryByText(t("homeChartTile.rotateHint"))).toBeNull();
  });

  it("renders the given chart component unchanged, even when portrait hides it via CSS", () => {
    render(
      <HomeChartTile id="moisture" title="Soil moisture">
        <div data-testid="chart">Chart</div>
      </HomeChartTile>,
    );
    expect(screen.getByTestId("chart")).not.toBeNull();
  });

  it("carries the tile id as a data attribute for scroll restoration", () => {
    const { container } = render(
      <HomeChartTile id="moisture" title="Soil moisture">
        <div>Chart</div>
      </HomeChartTile>,
    );
    expect(container.querySelector('[data-home-chart-tile-id="moisture"]')).not.toBeNull();
  });
});
