// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { Bar, ComposedChart, YAxis } from "recharts";
import { afterEach, describe, expect, it } from "vitest";
import { CategoryAxis } from "./CategoryAxis.js";

afterEach(cleanup);

const DATA = [
  { level: "low", share: 46 },
  { level: "mid", share: 24 },
  { level: "high", share: 11 },
];

describe("CategoryAxis", () => {
  it("labels every row with its category, in data order", () => {
    const { container } = render(
      <ComposedChart data={DATA} height={200} width={600}>
        <CategoryAxis dataKey="level" />
        <YAxis yAxisId="value" />
        <Bar dataKey="share" yAxisId="value" />
      </ComposedChart>,
    );
    const labels = [
      ...container.querySelectorAll(
        ".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value",
      ),
    ].map((node) => node.textContent);
    expect(labels).toEqual(["low", "mid", "high"]);
  });
});
