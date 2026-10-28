import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart.js";
import type { ChartSeries } from "./types.js";

interface HourlyIrrigation {
  at: number;
  zone1: number;
  zone2: number;
  zone3: number;
}

function generateHours(): HourlyIrrigation[] {
  let seed = 5;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const start = Date.UTC(2026, 8, 10, 6, 0);
  return Array.from({ length: 7 }, (_, index) => ({
    at: start + index * 60 * 60_000,
    zone1: Math.round(2 + random() * 6),
    zone2: Math.round(1 + random() * 5),
    zone3: Math.round(3 + random() * 5),
  }));
}

const DATA = generateHours();

const SERIES: ChartSeries<HourlyIrrigation>[] = [
  { id: "zone1", name: "Zone 1", slot: 1, accessorKey: "zone1" },
  { id: "zone2", name: "Zone 2", slot: 2, accessorKey: "zone2" },
  { id: "zone3", name: "Zone 3", slot: 3, accessorKey: "zone3" },
];

const meta: Meta<typeof BarChart<HourlyIrrigation>> = {
  title: "Charts/BarChart",
  component: BarChart,
  args: { data: DATA, series: SERIES },
};
export default meta;

type Story = StoryObj<typeof BarChart<HourlyIrrigation>>;

export const Default: Story = {};

// Discrete events, one tick each: the bars stay slim and every shot is
// labelled on the axis instead of whatever spacing recharts picks.
export const OneTickPerEvent: Story = {
  args: { barSize: 8, ticks: DATA.map((row) => row.at) },
};

const DAILY: HourlyIrrigation[] = Array.from({ length: 14 }, (_, index) => ({
  at: Date.UTC(2026, 8, 16 + index),
  zone1: 3 + ((index * 3) % 7),
  zone2: 2 + ((index * 5) % 6),
  zone3: 4 + ((index * 2) % 5),
}));

// One bar per calendar day, several series stacked into it.
export const StackedPerDay: Story = {
  args: { data: DAILY, resolution: "day", stacked: true, locale: "de-DE" },
};

interface LevelShare {
  level: string;
  share: number;
}

const LEVELS: LevelShare[] = [
  { level: "15-30 %", share: 46 },
  { level: "30-60 %", share: 24 },
  { level: "60-90 %", share: 19 },
  { level: "90-100 %", share: 11 },
];

// Categories instead of time: the share of the day an exhaust fan spent in each level band.
export const Kategorien: StoryObj<typeof BarChart<LevelShare>> = {
  args: {
    categoryKey: "level",
    data: LEVELS,
    series: [{ id: "share", name: "Share of day", slot: 1, accessorKey: "share", unitLabel: "%" }],
  },
};

interface DayRange {
  at: number;
  min: number;
  max: number;
}

const DAY_RANGES: DayRange[] = Array.from({ length: 10 }, (_, index) => ({
  at: Date.UTC(2026, 9, 1 + index),
  min: 19 + (index % 3) * 0.6,
  max: 25.5 + (index % 4) * 0.5,
}));

// A floating bar per day from its lowest to its highest value.
export const Bereich: StoryObj<typeof BarChart<DayRange>> = {
  args: {
    data: DAY_RANGES,
    resolution: "day",
    series: [
      {
        id: "range",
        name: "Min – max",
        slot: 1,
        rangeFn: (row) => [row.min, row.max],
        unit: "°C",
      },
    ],
  },
};
