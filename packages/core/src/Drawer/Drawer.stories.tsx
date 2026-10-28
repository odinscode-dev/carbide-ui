import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode, RefObject } from "react";
import { useRef, useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Drawer, type DrawerProps } from "./Drawer.js";

const TEXT =
  "Pump 1 has been running dry for 4 minutes. Acknowledging stops the alarm and logs the event with your user name.";

const PARAGRAPHS = Array.from({ length: 14 }, (_, index) => `${index + 1}. ${TEXT}`);

function LongText() {
  return (
    <>
      {PARAGRAPHS.map((paragraph) => (
        <p key={paragraph} style={{ margin: "0 0 var(--carbide-sp-5)" }}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

function Footer() {
  return (
    <>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Apply</Button>
    </>
  );
}

function Header({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--carbide-sp-4)",
        boxSizing: "border-box",
        height: "var(--carbide-sp-10)",
        paddingInline: "var(--carbide-sp-5)",
        background: "var(--carbide-layer-1)",
        borderBlockEnd: "1px solid var(--carbide-border-subtle)",
      }}
    >
      <strong>Board</strong>
      {children}
    </div>
  );
}

function ControlledDrawer(props: DrawerProps) {
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <>
      <Header>
        <Button onClick={() => setOpen(true)} variant="secondary">
          Open
        </Button>
      </Header>
      <Drawer {...props} onOpenChange={setOpen} open={open} />
    </>
  );
}

const meta: Meta<typeof Drawer> = {
  title: "Core/Drawer",
  component: Drawer,
  args: { open: true, title: "Acknowledge alarm", children: TEXT, footer: <Footer /> },
  argTypes: { onOpenChange: { control: false } },
  parameters: { layout: "fullscreen" },
  render: (args) => <ControlledDrawer {...args} />,
};
export default meta;

type Story = StoryObj<typeof Drawer>;

export const Default: Story = {};

export const FromStart: Story = { args: { side: "start", title: "Menu" } };

export const FromEnd: Story = { args: { side: "end" } };

export const Medium: Story = { args: { size: "md" } };

export const Large: Story = { args: { size: "lg" } };

export const NonModal: Story = { args: { modal: false, side: "start", title: "Menu" } };

export const WithoutFooter: Story = { args: { footer: undefined } };

export const Unpadded: Story = {
  args: {
    children: (
      <div style={{ padding: "var(--carbide-sp-5)", background: "var(--carbide-layer-2)" }}>
        Content manages its own padding and scrolling.
      </div>
    ),
    footer: undefined,
    unpadded: true,
  },
};

export const Closed: Story = { args: { open: false } };

export const LongContent: Story = { args: { children: <LongText /> } };

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <Cell>
      {(container) => (
        <Drawer container={container} footer={<Footer />} open title="Acknowledge alarm">
          {TEXT}
        </Drawer>
      )}
    </Cell>
  ),
};

function Cell({ children }: { children: (container: RefObject<HTMLElement | null>) => ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={frame}
      style={{
        position: "relative",
        width: "100%",
        height: "24rem",
        overflow: "hidden",
        transform: "translateZ(0)",
      }}
    >
      <Header />
      {children(frame)}
    </div>
  );
}
