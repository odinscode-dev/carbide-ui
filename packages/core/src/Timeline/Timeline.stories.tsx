import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Timeline, type TimelineMark, type TimelineRange } from "./Timeline.js";

// Minutes of the day: light 08:00-20:00, humidifier locked from 19:00.
const H = 60;
const RANGES: TimelineRange[] = [
  { start: 8 * H, end: 19 * H, label: "Humidifier free", color: "var(--carbide-chart-series-5)" },
  {
    start: 19 * H,
    end: 20 * H,
    label: "Locked before light off",
    color: "var(--carbide-border-strong)",
  },
];
const MARKS: TimelineMark[] = [9.2, 10.5, 12.1, 14.8, 18.9].map((hour) => ({
  at: hour * H,
  label: `Dose ${Math.floor(hour)}:${String(Math.round((hour % 1) * 60)).padStart(2, "0")}`,
}));
const TICKS = [8, 12, 16, 20].map((hour) => ({ at: hour * H, label: `${hour}:00` }));

const meta: Meta<typeof Timeline> = {
  title: "Components/Timeline",
  component: Timeline,
  args: {
    label: "Humidifier today",
    from: 8 * H,
    to: 20 * H,
    ranges: RANGES,
    marks: MARKS,
    now: 19 * H + 20,
    ticks: TICKS,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {};

export const OhneMarken: Story = { args: { marks: [] } };

export const OhneJetzt: Story = { args: { now: undefined } };

export const OhneBeschriftung: Story = { args: { ticks: [] } };

export const Leer: Story = { args: { ranges: [], marks: [], now: undefined } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", width: "16rem" }}>
      <Timeline
        from={8 * H}
        label="Humidifier"
        marks={MARKS}
        now={19 * H + 20}
        ranges={RANGES}
        ticks={TICKS}
        to={20 * H}
      />
      <Timeline from={0} label="Empty" to={1} />
    </div>
  ),
};
