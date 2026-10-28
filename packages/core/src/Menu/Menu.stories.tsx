import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/index.js";
import { Tag } from "../Tag/index.js";
import { Menu, type MenuItem } from "./Menu.js";

const ACTIONS: MenuItem[] = [
  { id: "edit", label: "Edit" },
  { id: "reset", label: "Reset password" },
  { id: "delete", label: "Delete", group: "danger", danger: true },
  { id: "locked", label: "Locked action", group: "danger", disabled: true },
];

const ROLES: MenuItem[] = [
  { id: "admin", label: "Admin", content: <Tag state="error">Admin</Tag> },
  { id: "supervisor", label: "Supervisor", content: <Tag state="warn">Supervisor</Tag> },
  {
    id: "user1",
    label: "User (may create departments)",
    content: <Tag state="accent">User (may create departments)</Tag>,
  },
  { id: "user2", label: "User (standard)", content: <Tag state="success">User (standard)</Tag> },
];

const meta: Meta<typeof Menu> = {
  title: "Core/Menu",
  component: Menu,
  args: { items: ACTIONS, trigger: <Button variant="secondary">Actions</Button> },
  argTypes: { onItemSelect: { control: false }, trigger: { control: false } },
};
export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {};

export const CurrentEntry: Story = {
  args: {
    items: ROLES,
    value: "supervisor",
    trigger: <Button variant="secondary">Role</Button>,
  },
};
