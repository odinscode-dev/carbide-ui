import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Flashbar, type FlashbarItem } from "./Flashbar.js";

const ITEMS: FlashbarItem[] = [
  {
    id: "1",
    state: "info",
    title: "New firmware available",
    content: "Version 4.2.1 is ready to install on this line.",
    onDismiss: () => undefined,
  },
  {
    id: "2",
    state: "success",
    title: "Recipe written",
    content: "Recipe 4711 written to PLC.",
    onDismiss: () => undefined,
  },
  {
    id: "3",
    state: "warn",
    title: "Tank level nearing maximum",
    content: "Level is at 92 % of capacity.",
    onDismiss: () => undefined,
  },
  {
    id: "4",
    state: "critical",
    title: "Pressure close to shutoff valve",
    content: "Reduce flow rate to avoid an automatic shutdown.",
    onDismiss: () => undefined,
  },
  {
    id: "5",
    state: "error",
    title: "PLC did not answer",
    content: "Last successful contact 14:20.",
    onDismiss: () => undefined,
  },
];

const meta: Meta<typeof Flashbar> = {
  title: "Core/Flashbar",
  component: Flashbar,
  args: { items: ITEMS },
};
export default meta;

type Story = StoryObj<typeof Flashbar>;

export const Default: Story = {};

export const SingleEntry: Story = {
  args: {
    items: [
      {
        id: "1",
        state: "info",
        title: "New firmware available",
        content: "Version 4.2.1 is ready to install on this line.",
        onDismiss: () => undefined,
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    items: [
      {
        id: "1",
        state: "info",
        title: "Writing recipe 4711",
        content: "This can take up to two minutes.",
        loading: true,
        onDismiss: () => undefined,
      },
      ...ITEMS.slice(1, 3),
    ],
  },
};

export const Empty: Story = {
  args: { items: [] },
};

export const LongMessage: Story = {
  args: {
    items: [
      {
        id: "1",
        state: "info",
        title: "Feed pump 1 switched back to automatic",
        content:
          "Feed pump 1 of hall 2 runs in hand mode since the last maintenance window, reports no fault, and has been switched back to automatic twice today without a change in flow rate.",
        onDismiss: () => undefined,
      },
    ],
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <Flashbar
      items={[
        ...ITEMS,
        {
          id: "6",
          state: "info",
          title: "Writing recipe 4711",
          content: "This can take up to two minutes.",
          loading: true,
          onDismiss: () => undefined,
        },
      ]}
    />
  ),
};
