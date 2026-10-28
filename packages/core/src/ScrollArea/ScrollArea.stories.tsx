import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { matrix } from "../../../../.storybook/matrix.js";
import { ScrollArea } from "./ScrollArea.js";

const ROWS = Array.from({ length: 30 }, (_, index) => `Sensor reading ${index + 1}`);

const FRAME = {
  boxSizing: "border-box",
  border: "1px solid var(--carbide-border-subtle)",
} as const;

function Rows() {
  return (
    <div style={{ display: "grid", gap: "var(--carbide-sp-2)", padding: "var(--carbide-sp-3)" }}>
      {ROWS.map((row) => (
        <span key={row}>{row}</span>
      ))}
    </div>
  );
}

function WideContent() {
  return (
    <div style={{ display: "flex", gap: "var(--carbide-sp-5)", padding: "var(--carbide-sp-3)" }}>
      {ROWS.map((row) => (
        <span key={row} style={{ whiteSpace: "nowrap" }}>
          {row}
        </span>
      ))}
    </div>
  );
}

const meta: Meta<typeof ScrollArea> = {
  title: "Core/ScrollArea",
  component: ScrollArea,
  render: (args) => (
    <div style={{ ...FRAME, inlineSize: "16rem", blockSize: "12rem" }}>
      <ScrollArea {...args}>
        <Rows />
      </ScrollArea>
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { axis: "horizontal" },
  render: (args) => (
    <div style={{ ...FRAME, inlineSize: "16rem", blockSize: "6rem" }}>
      <ScrollArea {...args}>
        <WideContent />
      </ScrollArea>
    </div>
  ),
};

export const Both: Story = {
  args: { axis: "both" },
  render: (args) => (
    <div style={{ ...FRAME, inlineSize: "16rem", blockSize: "12rem" }}>
      <ScrollArea {...args}>
        <div style={{ inlineSize: "40rem" }}>
          <Rows />
        </div>
      </ScrollArea>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

// Content shorter than the frame must show no scrollbar at all, not even
// on hover — regression coverage for a bug where zag-js's
// own overflow state stayed stuck at "has overflow" and kept showing a
// thumb with nothing to scroll.
export const NoOverflow: Story = {
  render: (args) => (
    <div style={{ ...FRAME, inlineSize: "16rem", blockSize: "12rem" }}>
      <ScrollArea {...args}>
        <span style={{ padding: "var(--carbide-sp-3)", display: "block" }}>Sensor reading 1</span>
      </ScrollArea>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvasElement.querySelector('[data-scope="scroll-area"][data-part="root"]');
    if (root === null) throw new Error("no scroll-area root rendered");
    await userEvent.hover(root);
    await expect(canvas.getByText("Sensor reading 1")).toBeVisible();
    const scrollbar = canvasElement.querySelector(
      '[data-part="scrollbar"][data-orientation="vertical"]',
    );
    await expect(scrollbar).not.toHaveAttribute("data-has-overflow");
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <div style={{ ...FRAME, inlineSize: "12rem", blockSize: "8rem" }}>
        <ScrollArea>
          <Rows />
        </ScrollArea>
      </div>
      <div style={{ ...FRAME, inlineSize: "12rem", blockSize: "5rem" }}>
        <ScrollArea axis="horizontal">
          <WideContent />
        </ScrollArea>
      </div>
    </>
  ),
};
