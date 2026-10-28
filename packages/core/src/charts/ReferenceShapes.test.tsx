// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { ComposedChart, Line, XAxis, YAxis } from "recharts";
import { afterEach, describe, expect, it } from "vitest";
import { Band } from "./Band.js";
import { EventLine } from "./EventLine.js";
import { EventRange } from "./EventRange.js";
import { Threshold } from "./Threshold.js";

afterEach(cleanup);

const DATA = [
  { at: 0, value: 1 },
  { at: 1000, value: 2 },
];

// A backdrop that catches the pointer would swallow the drag that starts a zoom
// wherever a night, a gap or a target band lies under it.
describe("reference shapes", () => {
  it("never take the pointer from the zoom layer above the plot", () => {
    const { container } = render(
      <ComposedChart data={DATA} height={200} width={600}>
        <XAxis dataKey="at" type="number" />
        <YAxis yAxisId="value" />
        <Line dataKey="value" yAxisId="value" />
        <EventRange from={100} to={900} tone="neutral" yAxisId="value" />
        <Band from={1} to={2} yAxisId="value" />
        <EventLine at={500} yAxisId="value" />
        <Threshold kind="negative" value={1.5} yAxisId="value" />
      </ComposedChart>,
    );
    const shapes = container.querySelectorAll(
      ".recharts-reference-area-rect, .recharts-reference-line-line",
    );
    expect(shapes.length).toBe(4);
    for (const shape of shapes) {
      expect(shape.getAttribute("pointer-events")).toBe("none");
    }
  });
});
