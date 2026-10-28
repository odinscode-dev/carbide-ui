import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { StructuredList } from "./StructuredList.js";

const COLUMNS = [
  { key: "name", header: "Pump" },
  { key: "state", header: "State" },
  { key: "flow", header: "Flow" },
];

const ROWS = [
  { value: "p1", cells: { name: "Pump P-1", state: "Running", flow: "12.4 m³/h" } },
  { value: "p2", cells: { name: "Pump P-2", state: "Standby", flow: "0.0 m³/h" } },
  {
    value: "p3",
    disabled: true,
    cells: { name: "Pump P-3", state: "Maintenance", flow: "—" },
  },
];

const meta: Meta<typeof StructuredList> = {
  title: "Core/StructuredList",
  component: StructuredList,
  args: { columns: COLUMNS, rows: ROWS },
  argTypes: { onValueChange: { control: false } },
};
export default meta;

type Story = StoryObj<typeof StructuredList>;

export const Default: Story = {};

export const WithoutHeader: Story = {
  args: { columns: COLUMNS.map(({ key }) => ({ key })) },
};

export const Selectable: Story = {
  args: { selectable: true },
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <StructuredList {...args} onValueChange={setValue} value={value} />;
  },
};

export const DisabledRow: Story = {
  args: { selectable: true, value: "p1" },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)" }}>
      <StructuredList columns={COLUMNS.map(({ key }) => ({ key }))} rows={ROWS} />
      <StructuredList columns={COLUMNS} rows={ROWS} />
      <StructuredList columns={COLUMNS} rows={ROWS} selectable value="p1" />
    </div>
  ),
};
