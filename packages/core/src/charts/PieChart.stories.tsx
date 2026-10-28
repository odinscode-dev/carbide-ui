import type { Meta, StoryObj } from "@storybook/react-vite";
import type { PieChartSlice } from "./PieChart.js";
import { PieChart } from "./PieChart.js";

const HARVEST: PieChartSlice[] = [
  { id: "aurora", name: "Aurora", value: 1240, slot: 1 },
  { id: "borealis", name: "Borealis", value: 860, slot: 2 },
  { id: "cascade", name: "Cascade", value: 640, slot: 3 },
  { id: "dune", name: "Dune", value: 420, slot: 4 },
];

const meta: Meta<typeof PieChart> = {
  title: "Charts/PieChart",
  component: PieChart,
  args: { data: HARVEST },
};
export default meta;

type Story = StoryObj<typeof PieChart>;

export const Default: Story = {};

// Slices in colours of their own, e.g. the colour each consumer has in the rest of a page.
export const FreieFarben: Story = {
  args: {
    data: [
      { id: "lamp", name: "Lamp", value: 2.58, slot: 1, color: "var(--carbide-signal-warning)" },
      { id: "fan", name: "Exhaust", value: 0.41, slot: 2, color: "var(--carbide-signal-ok)" },
      { id: "heater", name: "Heater", value: 0.12, slot: 3, color: "var(--carbide-signal-alarm)" },
      { id: "humidifier", name: "Humidifier", value: 0.03, slot: 4 },
    ],
  },
};

// A table beside the chart names the slices already.
export const OhneLegende: Story = { args: { legend: false } };
