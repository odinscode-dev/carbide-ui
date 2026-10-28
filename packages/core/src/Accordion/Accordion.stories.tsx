import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Badge } from "../Badge/index.js";
import { Accordion, type AccordionItemSpec, type AccordionProps } from "./Accordion.js";

const ITEMS: AccordionItemSpec[] = [
  {
    value: "pump-1",
    title: "Pump 1",
    content: <p>Flow rate 42 l/min, running since 06:00.</p>,
  },
  {
    value: "pump-2",
    title: "Pump 2",
    content: <p>Flow rate 38 l/min, running since 06:00.</p>,
  },
  {
    value: "pump-3",
    title: "Pump 3 (locked)",
    disabled: true,
    content: <p>Under maintenance.</p>,
  },
];

const ITEMS_WITH_EXTRA: AccordionItemSpec[] = ITEMS.map((item) => ({
  ...item,
  extra: item.disabled ? undefined : <Badge state="success">OK</Badge>,
}));

function ControlledAccordion(props: AccordionProps) {
  const [value, setValue] = useState(props.value);
  return <Accordion {...props} onValueChange={setValue} value={value} />;
}

const meta: Meta<typeof Accordion> = {
  title: "Core/Accordion",
  component: Accordion,
  args: { items: ITEMS },
  argTypes: { onValueChange: { control: false } },
  render: (args) => <ControlledAccordion {...args} />,
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { multiple: true, value: ["pump-1", "pump-2"] },
};

export const WithExtra: Story = {
  args: { items: ITEMS_WITH_EXTRA, value: ["pump-1"] },
};

export const LongTitle: Story = {
  args: {
    items: [
      {
        value: "long",
        title: "Cooling circuit north wing, secondary loop, sensor cluster B",
        content: <p>Temperature within range.</p>,
      },
      ...ITEMS.slice(0, 2),
    ],
  },
  render: (args) => (
    <div style={{ inlineSize: "16rem" }}>
      <ControlledAccordion {...args} />
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <div style={{ inlineSize: "16rem" }}>
        <Accordion items={ITEMS} />
      </div>
      <div style={{ inlineSize: "16rem" }}>
        <Accordion items={ITEMS_WITH_EXTRA} multiple value={["pump-1", "pump-2"]} />
      </div>
    </>
  ),
};
