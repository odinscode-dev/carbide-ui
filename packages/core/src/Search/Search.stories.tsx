import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Search, type SearchProps } from "./Search.js";

function ControlledSearch(props: SearchProps) {
  const [value, setValue] = useState(props.value ?? "");
  const [searched, setSearched] = useState<string | undefined>(undefined);
  return (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)" }}>
      <Search {...props} onSearch={setSearched} onValueChange={setValue} value={value} />
      <span
        style={{
          color: "var(--carbide-text-helper)",
          fontFamily: "var(--carbide-font-sans)",
          fontSize: "var(--carbide-fs-small)",
        }}
      >
        {searched === undefined ? "Press Enter to search" : `Searched for: ${searched}`}
      </span>
    </div>
  );
}

const meta: Meta<typeof Search> = {
  title: "Core/Search",
  component: Search,
  args: { value: "" },
  argTypes: {
    onValueChange: { control: false },
    onSearch: { control: false },
    onClear: { control: false },
    onChange: { control: false },
  },
  render: (args) => <ControlledSearch {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Search>;

export const Default: Story = {};

export const Filled: Story = { args: { value: "pump" } };

export const Disabled: Story = { args: { disabled: true, value: "pump" } };

export const CustomPlaceholder: Story = { args: { placeholder: "Filter assets" } };

export const LongValue: Story = {
  args: { value: "cooling circuit inlet pressure high limit warning" },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "14rem" }}>
      <Search value="" />
      <Search value="pump" />
      <Search disabled value="pump" />
    </div>
  ),
};
