import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { StatusChip, type StatusChipTone } from "./StatusChip.js";

function Thermometer() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M6.5 9.5V3a1.5 1.5 0 0 1 3 0v6.5a3 3 0 1 1-3 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const meta: Meta<typeof StatusChip> = {
  title: "Components/StatusChip",
  component: StatusChip,
  args: {
    icon: <Thermometer />,
    color: "var(--carbide-chart-series-2)",
    value: "25.5 °C",
    caption: "in band 24-26",
  },
};
export default meta;

type Story = StoryObj<typeof StatusChip>;

export const Default: Story = {};

export const Warnung: Story = { args: { tone: "warn", caption: "below band 50-55" } };

export const Fehler: Story = { args: { tone: "error", caption: "sensor offline" } };

export const Erfolg: Story = { args: { tone: "success" } };

export const OhneSymbol: Story = { args: { icon: undefined } };

export const OhneBeschriftung: Story = { args: { caption: undefined } };

const TONES: StatusChipTone[] = ["neutral", "success", "warn", "error"];

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", justifyItems: "start" }}>
      {TONES.map((tone) => (
        <StatusChip
          caption={tone}
          color="var(--carbide-chart-series-2)"
          icon={<Thermometer />}
          key={tone}
          tone={tone}
          value="25.5 °C"
        />
      ))}
      <StatusChip value="354 W" />
    </div>
  ),
};
