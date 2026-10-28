import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkline } from "./Sparkline.js";
import { seriesColor } from "./series.js";

interface DataPoint {
  at: number;
  value: number;
}

function measurementSeries(): DataPoint[] {
  let seed = 7;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const start = Date.UTC(2026, 8, 13, 12, 0);
  return Array.from({ length: 31 }, (_, index) => ({
    at: start + index * 30_000,
    value: 23.5 + Math.sin(index / 6) * 0.8 + random() * 0.3,
  }));
}

const DATA = measurementSeries();

const meta: Meta<typeof Sparkline<DataPoint>> = {
  title: "Charts/Sparkline",
  component: Sparkline,
  args: {
    data: DATA,
    accessorKey: "value",
    stroke: seriesColor(1),
    domainPadding: 0.5,
    height: 80,
  },
};
export default meta;

type Story = StoryObj<typeof Sparkline<DataPoint>>;

export const Default: Story = {};

export const CustomColor: Story = {
  args: { stroke: "var(--carbide-red-500)" },
};

export const TightPadding: Story = {
  args: { domainPadding: 0.1 },
};

export const WidePadding: Story = {
  args: { domainPadding: 5 },
};
