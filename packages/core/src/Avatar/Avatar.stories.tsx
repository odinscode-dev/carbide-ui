import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Avatar } from "./Avatar.js";

const meta: Meta<typeof Avatar> = {
  title: "Core/Avatar",
  component: Avatar,
  args: { name: "Ada Lovelace" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const OneWordName: Story = { args: { name: "Cher" } };

export const ShortAccountName: Story = { args: { name: "odin" } };

export const LongName: Story = { args: { name: "Alexandra Constantinopoulos-Featherstonehaugh" } };

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/64?img=12" },
};

export const BrokenImage: Story = {
  args: { src: "https://example.invalid/missing.jpg" },
};

export const Admin: Story = { args: { accountRole: "admin", name: "admin" } };

export const Client: Story = { args: { accountRole: "client", name: "client" } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-5)" }}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="odin" />
      <Avatar name="Ada Lovelace" src="https://i.pravatar.cc/64?img=12" />
      <Avatar accountRole="admin" name="admin" />
      <Avatar accountRole="client" name="client" />
    </div>
  ),
};
