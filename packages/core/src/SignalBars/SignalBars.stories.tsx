import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { SignalBars } from "./SignalBars.js";

const meta: Meta<typeof SignalBars> = {
  title: "Components/SignalBars",
  component: SignalBars,
  args: { dbm: -62 },
};
export default meta;

type Story = StoryObj<typeof SignalBars>;

export const Default: Story = {};

export const Stark: Story = { args: { dbm: -48 } };

// One bar left: drawn in the warning colour.
export const Schwach: Story = { args: { dbm: -82 } };

export const Leer: Story = { args: { dbm: null } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", gap: "var(--carbide-sp-4)", alignItems: "center" }}>
      {[-48, -60, -70, -82].map((dbm) => (
        <SignalBars dbm={dbm} key={dbm} />
      ))}
      <SignalBars dbm={null} />
    </div>
  ),
};
