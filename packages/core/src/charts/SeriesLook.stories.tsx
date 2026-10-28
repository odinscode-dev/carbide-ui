import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { LineChart } from "./LineChart.js";
import type { ChartBand, ChartEvent, ChartSeries } from "./types.js";

interface Reading {
  at: number;
  air: number;
  leaf: number;
  humidity: number;
  vpd: number;
  outside: number;
}

const START = Date.UTC(2026, 8, 29, 12, 0);
const MINUTE = 60_000;

// A day and a half at 15-minute steps; the lights go off at 20:00 and on at
// 08:00, and every reading follows that.
function generate(): Reading[] {
  return Array.from({ length: 6 * 16 }, (_, index) => {
    const at = START + index * 15 * MINUTE;
    const hour = new Date(at).getUTCHours() + new Date(at).getUTCMinutes() / 60;
    const day = hour >= 8 && hour < 20 ? 1 : 0;
    const wave = Math.sin(index / 9);
    return {
      at,
      air: 21.5 + 3 * day + 0.4 * wave,
      leaf: 20.2 + 3.2 * day + 0.3 * wave,
      humidity: 61 - 4 * day + wave,
      vpd: 1.0 + 0.25 * day + 0.03 * wave,
      outside: 14 + 5 * Math.sin((index - 20) / 12),
    };
  });
}

const DATA = generate();

const SERIES: ChartSeries<Reading>[] = [
  {
    id: "air",
    name: "Air temperature",
    slot: 1,
    color: "#db0000",
    accessorKey: "air",
    axisId: "temperature",
    axisSide: "left",
    unitLabel: "°C",
    format: (value) => value.toFixed(1),
  },
  {
    id: "leaf",
    name: "Leaf temperature",
    slot: 2,
    color: "#00802f",
    accessorKey: "leaf",
    axisId: "temperature",
    unitLabel: "°C",
    format: (value) => value.toFixed(1),
  },
  {
    id: "humidity",
    name: "Humidity",
    slot: 3,
    color: "#006ce0",
    accessorKey: "humidity",
    axisId: "humidity",
    axisSide: "right",
    unitLabel: "%",
    format: (value) => value.toFixed(1),
  },
  {
    id: "vpd",
    name: "VPD",
    slot: 4,
    color: "#cc0a87",
    accessorKey: "vpd",
    axisId: "vpd",
    axisSide: "right",
    unitLabel: "kPa",
    format: (value) => value.toFixed(2),
  },
  {
    id: "outside",
    name: "Outside temperature",
    slot: 5,
    color: "#962eff",
    dashed: true,
    accessorKey: "outside",
    axisId: "temperature",
    unitLabel: "°C",
    format: (value) => value.toFixed(1),
  },
];

// Lights off 20:00-08:00, as a backdrop rather than an event.
const NIGHT: ChartEvent = {
  id: "night",
  label: "Night",
  tone: "neutral",
  from: Date.UTC(2026, 8, 29, 20, 0),
  to: Date.UTC(2026, 8, 30, 8, 0),
};

const BANDS: ChartBand[] = [
  {
    id: "air-day",
    label: "Target 22.0 – 26.0 °C",
    from: 22,
    to: 26,
    axisId: "temperature",
    color: "#db0000",
    start: Date.UTC(2026, 8, 30, 8, 0),
  },
  {
    id: "air-night",
    from: 19,
    to: 23,
    axisId: "temperature",
    color: "#db0000",
    start: Date.UTC(2026, 8, 29, 20, 0),
    end: Date.UTC(2026, 8, 30, 8, 0),
  },
  {
    id: "humidity",
    label: "Target 55.0 – 65.0 %",
    from: 55,
    to: 65,
    axisId: "humidity",
    color: "#006ce0",
  },
];

const meta: Meta<typeof LineChart<Reading>> = {
  title: "Charts/SeriesLook",
  component: LineChart,
  args: {
    data: DATA,
    series: SERIES,
    events: [NIGHT],
    bands: BANDS,
    legend: false,
    height: 420,
    locale: "de",
  },
};
export default meta;

type Story = StoryObj<typeof LineChart<Reading>>;

// Own colours, a dashed outdoor line, targets as bands, the night as a
// grey backdrop, values with a dot and fixed digits.
export const Standard: Story = {};

// One line stands out (an entry from a tapped tile), the rest step back.
export const Hervorhebung: Story = {
  args: {
    series: SERIES.map((entry) => ({
      ...entry,
      emphasis: entry.id === "humidity" ? "strong" : "muted",
    })),
  },
};

export const MitLegende: Story = { args: { legend: true } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
};
