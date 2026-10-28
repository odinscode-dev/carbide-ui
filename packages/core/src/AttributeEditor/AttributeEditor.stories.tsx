import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import {
  AttributeEditor,
  type AttributeEditorColumn,
  type AttributeEditorItem,
} from "./AttributeEditor.js";

function columnsFor(
  setItems: Dispatch<SetStateAction<AttributeEditorItem[]>>,
): readonly AttributeEditorColumn[] {
  const field = (key: "key" | "value", label: string): AttributeEditorColumn => ({
    key,
    label,
    render: (item, index) => (
      <input
        aria-label={`${label} of row ${index + 1}`}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setItems((previous) =>
            previous.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
          );
        }}
        value={typeof item[key] === "string" ? item[key] : ""}
      />
    ),
  });
  return [field("key", "Key"), field("value", "Value")];
}

function ControlledEditor(props: {
  addText?: string | undefined;
  removeText?: string | undefined;
  limit?: number | undefined;
  disabled?: boolean | undefined;
  items: readonly AttributeEditorItem[];
}) {
  const [items, setItems] = useState<AttributeEditorItem[]>([...props.items]);
  return (
    <AttributeEditor
      {...props}
      definition={columnsFor(setItems)}
      items={items}
      onItemsChange={setItems}
    />
  );
}

const ROWS: readonly AttributeEditorItem[] = [
  { key: "Line", value: "L-04" },
  { key: "Zone", value: "Packaging" },
];

const meta: Meta<typeof AttributeEditor> = {
  title: "Core/AttributeEditor",
  component: AttributeEditor,
  args: { items: ROWS },
  argTypes: {
    definition: { control: false },
    items: { control: false },
    onItemsChange: { control: false },
  },
  render: (args) => <ControlledEditor {...args} items={args.items ?? []} />,
};
export default meta;

type Story = StoryObj<typeof AttributeEditor>;

export const Default: Story = {};

export const Empty: Story = { args: { items: [] } };

export const LimitReached: Story = { args: { items: ROWS, limit: 2 } };

export const Invalid: Story = {
  args: {
    items: [
      { key: "Line", value: "L-04" },
      { invalid: true, key: "", value: "" },
    ],
  },
};

export const Disabled: Story = { args: { disabled: true, items: ROWS } };

export const LongValue: Story = {
  args: {
    items: [
      {
        key: "Description",
        value: "Drive shaft alignment tolerance exceeded on conveyor motor M-12",
      },
    ],
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-6)", width: "20rem", maxWidth: "100%" }}>
      <ControlledEditor items={[]} />
      <ControlledEditor items={ROWS} />
      <ControlledEditor items={ROWS} limit={2} />
      <ControlledEditor items={[{ invalid: true, key: "", value: "" }]} />
      <ControlledEditor disabled items={ROWS} />
    </div>
  ),
};
