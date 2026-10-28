import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Textarea, type TextareaProps } from "./Textarea.js";

function ControlledField(props: TextareaProps) {
  const [value, setValue] = useState(props.value ?? "");
  return <Textarea {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof Textarea> = {
  title: "Core/Textarea",
  component: Textarea,
  args: {
    label: "Shift notes",
    placeholder: "Enter notes for the next shift",
    helperText: "Visible to the whole team",
    value: "",
  },
  argTypes: { onValueChange: { control: false }, onChange: { control: false } },
  render: (args) => <ControlledField {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { errorText: "Notes must not be empty", invalid: true, value: "" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "Pump 3 is running slightly warm, keep an eye on it." },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: "Pump 3 is running slightly warm, keep an eye on it." },
};

export const LongValue: Story = {
  args: {
    label: "Incident report",
    value:
      "Cooling circuit inlet pressure exceeded the warning limit at 02:14. Operator acknowledged the alarm, reduced flow rate, and pressure returned to normal range by 02:22. No further action required, but the setpoint should be reviewed at the next shift handover.",
  },
};

export const ManyRows: Story = {
  args: { label: "Description", rows: 8 },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "14rem" }}>
      <Textarea helperText="Visible to the whole team" label="Shift notes" value="All normal." />
      <Textarea errorText="Notes must not be empty" invalid label="Shift notes" value="" />
      <Textarea label="Shift notes" readOnly value="All normal." />
      <Textarea disabled label="Shift notes" value="All normal." />
    </div>
  ),
};
