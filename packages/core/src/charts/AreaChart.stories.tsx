import type { Meta, StoryObj } from "@storybook/react-vite";
import { AreaChart } from "./AreaChart.js";
import type { ChartSeries } from "./types.js";

interface TankLevel {
  at: number;
  tank1: number;
  tank2: number;
}

function generateTankLevels(): TankLevel[] {
  const start = Date.UTC(2026, 8, 10, 0, 0);
  return Array.from({ length: 25 }, (_, index) => ({
    at: start + index * 60 * 60_000,
    tank1: 90 - ((index * 3) % 70),
    tank2: 80 - ((index * 2.4) % 60),
  }));
}

const DATA = generateTankLevels();

const SERIES: ChartSeries<TankLevel>[] = [
  { id: "tank1", name: "Tank 1", slot: 1, accessorKey: "tank1", unit: "%" },
  { id: "tank2", name: "Tank 2", slot: 2, accessorKey: "tank2", unit: "%" },
];

const meta: Meta<typeof AreaChart<TankLevel>> = {
  title: "Charts/AreaChart",
  component: AreaChart,
  args: { data: DATA, series: SERIES },
};
export default meta;

type Story = StoryObj<typeof AreaChart<TankLevel>>;

export const Default: Story = {};

const DAILY: TankLevel[] = Array.from({ length: 30 }, (_, index) => ({
  at: Date.UTC(2026, 8, 1 + index),
  tank1: 40 + ((index * 7) % 35),
  tank2: 30 + ((index * 5) % 30),
}));

// One value per calendar day: ticks and tooltip show dates, not "00:00".
export const PerDay: Story = {
  args: { data: DAILY, resolution: "day", locale: "de-DE" },
};
