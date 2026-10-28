import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { LineChart } from "./LineChart.js";
import type { PieChartSlice } from "./PieChart.js";
import { PieChart } from "./PieChart.js";
import type { ChartSeries } from "./types.js";

interface DataPoint {
  at: number;
  probe1: number;
  probe2: number;
}

function generateSeries(): DataPoint[] {
  const start = Date.UTC(2026, 8, 10, 0, 0);
  return Array.from({ length: 13 }, (_, index) => ({
    at: start + index * 60 * 60_000,
    probe1: 42 + 6 * Math.sin(index / 3),
    probe2: 55 + 5 * Math.sin(index / 4 + 1),
  }));
}

const DATA = generateSeries();

const SERIES: ChartSeries<DataPoint>[] = [
  { id: "probe1", name: "Probe 1", slot: 1, accessorKey: "probe1", unit: "%" },
  { id: "probe2", name: "Probe 2", slot: 2, accessorKey: "probe2", unit: "%" },
];

const HARVEST: PieChartSlice[] = [
  { id: "aurora", name: "Aurora", value: 3, slot: 1 },
  { id: "borealis", name: "Borealis", value: 2, slot: 2 },
  { id: "cascade", name: "Cascade", value: 1, slot: 3 },
];

const meta: Meta = {
  title: "Charts/Matrix",
};
export default meta;

type Story = StoryObj;

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", gap: "var(--carbide-sp-5)", width: "100%" }}>
      <div style={{ height: "16rem", width: "60%" }}>
        <LineChart
          data={DATA}
          series={SERIES}
          thresholds={[{ id: "max", label: "Max", value: 58, kind: "negative" }]}
        />
      </div>
      <div style={{ height: "16rem", width: "40%" }}>
        <PieChart data={HARVEST} />
      </div>
    </div>
  ),
};
