import type { Meta, StoryObj } from "@storybook/react-vite";
import { matrix } from "../../../../.storybook/matrix.js";
import { Link } from "./Link.js";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentcolor" strokeWidth="1.5" viewBox="0 0 16 16">
      <path d="M3 8h10m-4-4l4 4-4 4" />
    </svg>
  );
}

const meta: Meta<typeof Link> = {
  title: "Core/Link",
  component: Link,
  args: { href: "#", children: "Documentation" },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Standalone: Story = {};

export const Inline: Story = {
  args: { inline: true, children: "the documentation" },
  render: (args) => (
    <p>
      The pump reports its state every second; details are in <Link {...args} /> and in the
      commissioning record.
    </p>
  ),
};

export const WithIcon: Story = { args: { icon: <ArrowIcon />, children: "Open record" } };

export const Disabled: Story = { args: { disabled: true } };

export const LongText: Story = {
  args: {
    children:
      "A very long link label that goes on and on to show what happens when the text runs across the whole available width of its container",
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <Link href="#">Standalone</Link>
      <Link href="#" icon={<ArrowIcon />}>
        With icon
      </Link>
      <p style={{ margin: 0 }}>
        Running text with an{" "}
        <Link href="#" inline>
          inline link
        </Link>{" "}
        in the middle.
      </p>
      <Link href="#" disabled>
        Disabled
      </Link>
    </>
  ),
};
