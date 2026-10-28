import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { AreaChart } from "./AreaChart.js";
import { LineChart } from "./LineChart.js";
import type { ChartEvent, ChartSeries, ChartThreshold } from "./types.js";
import type { ChartDomain } from "./zoom.js";

interface Row {
  at: number;
  temperature: number;
  humidity: number;
}

const START = Date.UTC(2026, 8, 1, 0, 0);
const HOUR = 60 * 60_000;

// Seven days at 15-minute steps: too many points to read at once, which is what
// a zoom is for.
function generate(): Row[] {
  let seed = 5;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: 7 * 24 * 4 }, (_, index) => {
    const hour = index / 4;
    return {
      at: START + index * (HOUR / 4),
      temperature: 22 + 4 * Math.sin((hour / 24) * 2 * Math.PI) + random() * 0.6,
      humidity: 60 - 12 * Math.sin((hour / 24) * 2 * Math.PI) + random() * 1.5,
    };
  });
}

const DATA = generate();

const SERIES: ChartSeries<Row>[] = [
  {
    id: "temperature",
    name: "Temperature",
    slot: 1,
    accessorKey: "temperature",
    unit: "°C",
    axisId: "temperature",
  },
  {
    id: "humidity",
    name: "Humidity",
    slot: 2,
    accessorKey: "humidity",
    unit: "%",
    axisId: "humidity",
  },
];

const EVENTS: ChartEvent[] = [
  { id: "feed", label: "Feed change", at: START + 2 * 24 * HOUR + 9 * HOUR },
  {
    id: "lights",
    label: "Lights off",
    from: START + 4 * 24 * HOUR,
    to: START + 4 * 24 * HOUR + 6 * HOUR,
  },
];

const THRESHOLDS: ChartThreshold[] = [
  { id: "max", label: "Max", value: 27, kind: "negative", axisId: "temperature" },
];

interface DemoProps {
  area?: boolean;
  initial?: ChartDomain;
}

// The caller owns the stretch, as a real page does: it keeps what the chart
// reports and hands it back -- and is where finer data would be fetched.
function Demo({ area = false, initial }: DemoProps) {
  const [domain, setDomain] = useState<ChartDomain | undefined>(initial);
  const Chart = area ? AreaChart : LineChart;
  return (
    <div style={{ height: "20rem" }}>
      <Chart
        data={DATA}
        domain={domain}
        events={EVENTS}
        height="100%"
        onDomainChange={(next) => setDomain(next ?? undefined)}
        series={SERIES}
        thresholds={THRESHOLDS}
      />
    </div>
  );
}

const meta: Meta = { title: "Charts/Zoom" };
export default meta;

type Story = StoryObj;

export const Line: Story = { render: () => <Demo /> };

export const Area: Story = { render: () => <Demo area /> };

export const ZoomedFromTheStart: Story = {
  render: () => <Demo initial={[START + 3 * 24 * HOUR, START + 5 * 24 * HOUR]} />,
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => <Demo initial={[START + 3 * 24 * HOUR, START + 5 * 24 * HOUR]} />,
};
