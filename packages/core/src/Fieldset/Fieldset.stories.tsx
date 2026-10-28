import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "../TextInput/TextInput.js";
import { Fieldset } from "./Fieldset.js";

const meta: Meta<typeof Fieldset> = {
  title: "Core/Fieldset",
  component: Fieldset,
  args: { legend: "Setpoint" },
  decorators: [
    (Story) => (
      <div style={{ width: "20rem" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Fieldset {...args}>
      <TextInput label="Name" value="Inlet pressure" />
      <TextInput label="Unit" suffix="bar" value="2.40" />
    </Fieldset>
  ),
};
export default meta;

type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {};

export const WithoutLegend: Story = { args: { legend: undefined } };

export const Disabled: Story = { args: { disabled: true } };
