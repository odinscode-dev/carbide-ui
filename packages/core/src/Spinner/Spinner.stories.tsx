import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Spinner } from "./Spinner.js";

const meta: Meta<typeof Spinner> = {
  title: "Core/Spinner",
  component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const InButton: Story = {
  render: () => (
    <button
      style={{
        alignItems: "center",
        background: "var(--carbide-accent)",
        border: 0,
        borderRadius: "var(--carbide-radius)",
        color: "var(--carbide-inverse-text)",
        display: "inline-flex",
        gap: "var(--carbide-sp-3)",
        height: "var(--carbide-control-h)",
        padding: "0 var(--carbide-sp-4)",
      }}
      type="button"
    >
      <Spinner />
      Saving
    </button>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ color: "var(--carbide-accent)", fontSize: "var(--carbide-fs-lead)" }}>
      <Spinner />
    </div>
  ),
};
