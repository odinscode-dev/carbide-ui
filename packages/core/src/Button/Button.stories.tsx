import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "./Button.js";

function Arrow() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M3 8h10m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const meta: Meta<typeof Button> = {
  title: "Core/Button",
  component: Button,
  args: { children: "Acknowledge" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Primary: Story = { args: { variant: "primary" } };

export const Secondary: Story = { args: { variant: "secondary" } };

export const Ghost: Story = { args: { variant: "ghost" } };

export const Danger: Story = { args: { children: "Stop", variant: "danger" } };

export const Disabled: Story = { args: { disabled: true, variant: "primary" } };

export const Loading: Story = { args: { loading: true, variant: "primary" } };

export const IconStart: Story = { args: { icon: <Arrow />, iconPosition: "start" } };

export const IconEnd: Story = { args: { icon: <Arrow /> } };

export const IconOnly: Story = {
  args: { "aria-label": "Acknowledge", children: undefined, icon: <Arrow /> },
};

export const LongLabel: Story = {
  args: { children: "Acknowledge all active alarms in this district" },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <Button variant="primary">Acknowledge</Button>
      <Button variant="secondary">Acknowledge</Button>
      <Button variant="ghost">Acknowledge</Button>
      <Button variant="danger">Stop</Button>
      <Button disabled variant="primary">
        Acknowledge
      </Button>
      <Button loading variant="primary">
        Acknowledge
      </Button>
      <Button icon={<Arrow />} iconPosition="start" variant="secondary">
        Acknowledge
      </Button>
      <Button icon={<Arrow />} variant="ghost">
        Acknowledge
      </Button>
      <Button aria-label="Stop" icon={<Arrow />} variant="danger" />
    </>
  ),
};
