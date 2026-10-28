import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { FormRow } from "../FormRow/FormRow.js";
import { Select } from "../Select/Select.js";
import { Slider } from "../Slider/Slider.js";
import { TextInput } from "../TextInput/TextInput.js";
import { Form, type FormProps } from "./Form.js";

function Fields({ disabled = false }: { disabled?: boolean }) {
  return (
    <>
      <Fieldset disabled={disabled} legend="Setpoint">
        <FormRow spans={[8, 4]}>
          <TextInput label="Name" value="Inlet pressure" />
          <TextInput label="Unit" suffix="bar" value="2.40" />
        </FormRow>
        <FormRow>
          <TextInput label="Minimum" value="0.50" />
          <TextInput label="Maximum" value="6.00" />
          <TextInput label="Hysteresis" value="0.10" />
        </FormRow>
      </Fieldset>
      <Fieldset disabled={disabled} legend="Behaviour">
        <Select
          items={[
            { value: "auto", label: "Automatic" },
            { value: "manual", label: "Manual" },
          ]}
          label="Operating mode"
          value="auto"
        />
        <Slider label="Hysteresis" max={1} min={0} step={0.05} unit="bar" value={0.1} />
      </Fieldset>
    </>
  );
}

const meta: Meta<typeof Form> = {
  title: "Core/Form",
  component: Form,
  args: {},
  argTypes: { onSubmit: { control: false } },
  render: (args: FormProps) => (
    <Form {...args} onSubmit={(event) => event.preventDefault()}>
      <Fields />
      <FormRow spans={[9, 3]}>
        <span />
        <Button type="submit" variant="primary">
          Save
        </Button>
      </FormRow>
    </Form>
  ),
  decorators: [
    (Story) => (
      <div style={{ width: "36rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {};

export const Disabled: Story = {
  render: (args: FormProps) => (
    <Form {...args} onSubmit={(event) => event.preventDefault()}>
      <Fields disabled />
    </Form>
  ),
};

export const FieldsetWithoutLegend: Story = {
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Fieldset>
        <TextInput label="Name" value="Inlet pressure" />
        <TextInput label="Comment" value="" />
      </Fieldset>
    </Form>
  ),
};

export const Rows: Story = {
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <FormRow>
        <TextInput label="One field" />
      </FormRow>
      <FormRow>
        <TextInput label="Two" />
        <TextInput label="fields" />
      </FormRow>
      <FormRow>
        <TextInput label="Three" />
        <TextInput label="equal" />
        <TextInput label="fields" />
      </FormRow>
      <FormRow>
        <TextInput label="Four" />
        <TextInput label="equal" />
        <TextInput label="fields" />
        <TextInput label="here" />
      </FormRow>
      <FormRow spans={[6, 3, 3]}>
        <TextInput label="Six" />
        <TextInput label="three" />
        <TextInput label="three" />
      </FormRow>
      <FormRow spans={[2, 10]}>
        <TextInput label="Two" />
        <TextInput label="ten" />
      </FormRow>
    </Form>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ width: "16rem", maxWidth: "100%" }}>
      <Form onSubmit={(event) => event.preventDefault()}>
        <Fieldset legend="Setpoint">
          <FormRow spans={[7, 5]}>
            <TextInput label="Name" value="Inlet" />
            <TextInput label="Unit" suffix="bar" value="2.40" />
          </FormRow>
        </Fieldset>
        <Fieldset legend="Behaviour">
          <Select
            items={[
              { value: "auto", label: "Automatic" },
              { value: "manual", label: "Manual" },
            ]}
            label="Mode"
            value="auto"
          />
          <Slider label="Hysteresis" max={1} min={0} step={0.05} unit="bar" value={0.1} />
        </Fieldset>
      </Form>
    </div>
  ),
};
