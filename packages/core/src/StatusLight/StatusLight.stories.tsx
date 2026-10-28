import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { StatusLight, type StatusLightTone } from "./StatusLight.js";

const TONES: StatusLightTone[] = ["ok", "warning", "alarm", "neutral", "off"];

const meta: Meta<typeof StatusLight> = {
  title: "Components/StatusLight",
  component: StatusLight,
  args: { label: "Sensor online", tone: "ok" },
};
export default meta;

type Story = StoryObj<typeof StatusLight>;

export const Default: Story = {};

export const Warning: Story = { args: { label: "Reading old", tone: "warning" } };

export const Alarm: Story = { args: { label: "Sensor offline", tone: "alarm" } };

export const Neutral: Story = { args: { label: "Not configured", tone: "neutral" } };

export const Off: Story = { args: { label: "Switched off", tone: "off" } };

// A live value: the ring pulses out of the light.
export const Pulsierend: Story = { args: { label: "Live", pulse: true } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", gap: "var(--carbide-sp-4)", alignItems: "center" }}>
      {TONES.map((tone) => (
        <StatusLight key={tone} label={tone} tone={tone} />
      ))}
      <StatusLight label="live" pulse tone="ok" />
    </div>
  ),
};
