import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "../TextInput/TextInput.js";
import { FormRow } from "./FormRow.js";

const meta: Meta<typeof FormRow> = {
  title: "Core/FormRow",
  component: FormRow,
  decorators: [
    (Story) => (
      <div style={{ width: "24rem" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <FormRow {...args}>
      <TextInput label="Minimum" value="0.50" />
      <TextInput label="Maximum" value="6.00" />
    </FormRow>
  ),
};
export default meta;

type Story = StoryObj<typeof FormRow>;

export const Default: Story = {};

export const CustomSpans: Story = {
  args: { spans: [8, 4] },
  render: (args) => (
    <FormRow {...args}>
      <TextInput label="Name" value="Inlet pressure" />
      <TextInput label="Unit" suffix="bar" value="2.40" />
    </FormRow>
  ),
};

export const SingleField: Story = {
  render: () => (
    <FormRow>
      <TextInput label="One field" />
    </FormRow>
  ),
};

export const FourFields: Story = {
  render: () => (
    <FormRow>
      <TextInput label="Four" />
      <TextInput label="equal" />
      <TextInput label="fields" />
      <TextInput label="here" />
    </FormRow>
  ),
};
