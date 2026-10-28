import type { ChartSeries } from "@odinscode/carbide-core";
import { LineChart } from "@odinscode/carbide-core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { HomeChartTile } from "./HomeChartTile.js";

interface DataPoint {
  at: number;
  probe1: number;
  probe2: number;
}

function measurementSeries(): DataPoint[] {
  let seed = 11;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const start = Date.UTC(2026, 8, 10, 0, 0);
  return Array.from({ length: 25 }, (_, index) => {
    const hour = index / 2;
    return {
      at: start + index * 30 * 60_000,
      probe1: 42 + 6 * Math.sin(hour / 3) + random() * 3,
      probe2: 55 + 5 * Math.sin(hour / 4 + 1) + random() * 3,
    };
  });
}

const DATA = measurementSeries();

const SERIES: ChartSeries<DataPoint>[] = [
  { id: "probe1", name: "Probe 1", slot: 1, accessorKey: "probe1", unit: "%" },
  { id: "probe2", name: "Probe 2", slot: 2, accessorKey: "probe2", unit: "%" },
];

const meta: Meta<typeof HomeChartTile> = {
  title: "Home/HomeChartTile",
  component: HomeChartTile,
  args: { id: "moisture", title: "Soil moisture" },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <HomeChartTile {...args}>
      <LineChart data={DATA} series={SERIES} />
    </HomeChartTile>
  ),
};
export default meta;

type Story = StoryObj<typeof HomeChartTile>;

export const Default: Story = {};

export const CustomHint: Story = {
  args: { rotateHint: "Turn your phone sideways to see the chart" },
};

export const Smartphone: Story = {
  decorators: [(Story) => <div style={{ inlineSize: "412px" }}>{Story()}</div>],
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <HomeChartTile {...args}>
      <div>Chart</div>
    </HomeChartTile>
  ),
};
