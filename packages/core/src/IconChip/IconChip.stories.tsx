import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { IconChip } from "./IconChip.js";

function Drop() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M8 2s4.5 4.6 4.5 7.6a4.5 4.5 0 0 1-9 0C3.5 6.6 8 2 8 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const meta: Meta<typeof IconChip> = {
  title: "Components/IconChip",
  component: IconChip,
  args: { icon: <Drop />, color: "var(--carbide-chart-series-1)" },
};
export default meta;

type Story = StoryObj<typeof IconChip>;

export const Default: Story = {};

export const Klein: Story = { args: { size: "sm" } };

// Without a colour it takes the secondary text colour.
export const OhneFarbe: Story = { args: { color: undefined } };

// With a label it is an image for assistive tech, not decoration.
export const MitBeschriftung: Story = { args: { label: "Humidity" } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", gap: "var(--carbide-sp-3)", alignItems: "center" }}>
      {[1, 2, 3, 4, 5, 6].map((slot) => (
        <IconChip color={`var(--carbide-chart-series-${slot})`} icon={<Drop />} key={slot} />
      ))}
      <IconChip icon={<Drop />} />
      <IconChip color="var(--carbide-chart-series-2)" icon={<Drop />} size="sm" />
    </div>
  ),
};
