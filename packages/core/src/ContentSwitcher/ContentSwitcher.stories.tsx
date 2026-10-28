import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import type { ContentSwitcherProps } from "./ContentSwitcher.js";
import { ContentSwitcher } from "./ContentSwitcher.js";

const ITEMS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

function ControlledSwitcher(props: ContentSwitcherProps) {
  const [value, setValue] = useState(props.value ?? "day");
  return <ContentSwitcher {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof ContentSwitcher> = {
  title: "Core/ContentSwitcher",
  component: ContentSwitcher,
  args: { items: ITEMS },
  argTypes: { onValueChange: { control: false } },
  render: (args) => <ControlledSwitcher {...args} />,
};
export default meta;

type Story = StoryObj<typeof ContentSwitcher>;

export const Default: Story = {};

export const TwoSegments: Story = {
  args: { items: ITEMS.slice(0, 2) },
};

export const DisabledSegment: Story = {
  args: { items: [...ITEMS.slice(0, 2), { value: "year", label: "Year", disabled: true }] },
};

export const Disabled: Story = { args: { disabled: true } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-4)", justifyItems: "start" }}>
      <ContentSwitcher items={ITEMS.slice(0, 2)} value="day" />
      <ContentSwitcher items={ITEMS} value="week" />
      <ContentSwitcher
        items={[...ITEMS.slice(0, 2), { value: "year", label: "Year", disabled: true }]}
        value="day"
      />
    </div>
  ),
};
