import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { AvatarMenu, type AvatarMenuItem } from "./AvatarMenu.js";

const ITEMS: AvatarMenuItem[] = [{ id: "settings", label: "Settings" }];

const meta: Meta<typeof AvatarMenu> = {
  title: "Core/AvatarMenu",
  component: AvatarMenu,
  args: { items: ITEMS, name: "Ada Lovelace", onLogout: () => {} },
  argTypes: { onItemSelect: { control: false }, onLogout: { control: false } },
};
export default meta;

type Story = StoryObj<typeof AvatarMenu>;

export const Default: Story = {};

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/64?img=12" },
};

export const ShortAccountName: Story = { args: { name: "odin" } };

export const Admin: Story = { args: { accountRole: "admin", name: "admin" } };

export const Client: Story = { args: { accountRole: "client", name: "client" } };

export const WithoutLogout: Story = { args: { onLogout: undefined } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--carbide-sp-5)" }}>
      <AvatarMenu items={ITEMS} name="odin" onLogout={() => {}} />
      <AvatarMenu
        items={ITEMS}
        name="Ada Lovelace"
        onLogout={() => {}}
        src="https://i.pravatar.cc/64?img=12"
      />
      <AvatarMenu accountRole="admin" items={ITEMS} name="admin" onLogout={() => {}} />
      <AvatarMenu accountRole="client" items={ITEMS} name="client" onLogout={() => {}} />
    </div>
  ),
};

// Every visible text can be replaced, for an interface in another language:
// the menu entry, the dialog's title, message and both buttons, and the
// trigger's accessible name.
export const CustomTexts: Story = {
  args: {
    logoutLabel: "Sign out",
    logoutConfirmTitle: "Sign out now?",
    logoutConfirmMessage: "Your session ends here.",
    logoutConfirmText: "Sign out",
    logoutCancelText: "Stay signed in",
    triggerLabel: "Your account",
  },
};
