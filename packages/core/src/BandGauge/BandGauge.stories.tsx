import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import type { BandGaugeZone } from "./BandGauge.js";
import { BandGauge } from "./BandGauge.js";

// A target band of 22-25 °C split into quarters: the outer quarters warn,
// beyond the band is an alarm.
const TEMPERATURE: BandGaugeZone[] = [
  { from: 18, to: 22, tone: "alarm" },
  { from: 22, to: 22.75, tone: "warning" },
  { from: 22.75, to: 24.25, tone: "ok" },
  { from: 24.25, to: 25, tone: "warning" },
  { from: 25, to: 29, tone: "alarm" },
];

const celsius = (value: number) => `${value.toFixed(1)} °C`;

const meta: Meta<typeof BandGauge> = {
  title: "Components/BandGauge",
  component: BandGauge,
  args: {
    label: "Temperature inside",
    min: 18,
    max: 29,
    value: 23.6,
    zones: TEMPERATURE,
    ticks: [22, 25],
    format: celsius,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof BandGauge>;

export const Default: Story = {};

// Above the band, heading further up.
export const MitPrognose: Story = { args: { value: 25.4, secondary: 25.9 } };

// The reading beyond the scale stays at its end.
export const Ausserhalb: Story = { args: { value: 31.2 } };

// No reading: the zones fade, no marker.
export const Leer: Story = { args: { value: null } };

// The label is elsewhere on the page, but still names the gauge for assistive tech.
export const OhneBeschriftung: Story = { args: { hideLabel: true } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "16rem" }}>
      <BandGauge
        format={celsius}
        label="In band"
        max={29}
        min={18}
        ticks={[22, 25]}
        value={23.6}
        zones={TEMPERATURE}
      />
      <BandGauge
        format={celsius}
        label="Above, with forecast"
        max={29}
        min={18}
        secondary={25.9}
        ticks={[22, 25]}
        value={25.4}
        zones={TEMPERATURE}
      />
      <BandGauge
        format={celsius}
        label="No reading"
        max={29}
        min={18}
        ticks={[22, 25]}
        value={null}
        zones={TEMPERATURE}
      />
    </div>
  ),
};
