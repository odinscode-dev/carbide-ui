import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./LineChart.js";
import type { ChartSeries } from "./types.js";

interface NutrientSolution {
  at: number;
  pressure: number;
  flow: number;
  ec: number;
  ph: number;
  temperature: number;
}

function generateSeries(): NutrientSolution[] {
  const start = Date.UTC(2026, 8, 10, 6, 0);
  return Array.from({ length: 25 }, (_, index) => {
    const t = index / 4;
    return {
      at: start + index * 15 * 60_000,
      pressure: 2.2 + 0.2 * Math.sin(t),
      flow: 12 + 1.5 * Math.sin(t / 2 + 1),
      ec: 1.8 + 0.15 * Math.sin(t / 3 + 2),
      ph: 6.1 + 0.2 * Math.sin(t / 4 + 3),
      temperature: 21 + 1.2 * Math.sin(t / 5 + 4),
    };
  });
}

const DATA = generateSeries();

const SERIES: ChartSeries<NutrientSolution>[] = [
  {
    id: "pressure",
    name: "Pressure",
    slot: 1,
    accessorKey: "pressure",
    unit: "bar",
    axisId: "pressure",
  },
  {
    id: "flow",
    name: "Flow",
    slot: 2,
    accessorKey: "flow",
    unit: "l/min",
    axisId: "flow",
  },
  { id: "ec", name: "Conductivity", slot: 3, accessorKey: "ec", unit: "mS/cm", axisId: "ec" },
  { id: "ph", name: "pH", slot: 4, accessorKey: "ph", unit: "pH", axisId: "ph" },
  {
    id: "temperature",
    name: "Temperature",
    slot: 5,
    accessorKey: "temperature",
    unit: "°C",
    axisId: "temperature",
  },
];

const meta: Meta<typeof LineChart<NutrientSolution>> = {
  title: "Charts/MultiAxis",
  component: LineChart,
  args: { data: DATA, series: SERIES, height: 420 },
};
export default meta;

type Story = StoryObj<typeof LineChart<NutrientSolution>>;

export const Default: Story = {};

// Every axis fitted to its own data with 5 % of air, and hidden: the
// lines carry the movement, the tooltip carries the numbers.
export const FittedAndHidden: Story = {
  args: {
    series: SERIES.map((entry) => ({ ...entry, axisHidden: true, axisPadding: 0.05 })),
  },
};

// Tick labels stay, the unit titles beside the axes go: the legend names
// the units already.
export const WithoutTitles: Story = {
  args: { series: SERIES.map((entry) => ({ ...entry, axisTitle: false })) },
};
