import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode, RefObject } from "react";
import { useRef, useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Button } from "../Button/index.js";
import { Modal, type ModalProps } from "./Modal.js";

function Footer() {
  return (
    <>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </>
  );
}

const TEXT =
  "Pump 1 has been running dry for 4 minutes. Acknowledging stops the alarm and logs the event with your user name.";

const PARAGRAPHS = Array.from({ length: 12 }, (_, index) => `${index + 1}. ${TEXT}`);

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

function ControlledModal(props: ModalProps) {
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="secondary">
        Open
      </Button>
      <Modal {...props} onOpenChange={setOpen} open={open} />
    </>
  );
}

const meta: Meta<typeof Modal> = {
  title: "Core/Modal",
  component: Modal,
  args: {
    open: true,
    title: "Acknowledge alarm",
    children: TEXT,
    footer: <Footer />,
  },
  argTypes: { onOpenChange: { control: false } },
  render: (args) => <ControlledModal {...args} />,
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const Medium: Story = { args: { size: "md" } };

export const Large: Story = { args: { size: "lg" } };

export const WithoutFooter: Story = { args: { footer: undefined } };

export const LongContent: Story = { args: { children: <LongText /> } };

export const Glass: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <Cell photo>
      {(container) => (
        <Modal
          container={container}
          footer={<Footer />}
          open
          size="sm"
          title="Acknowledge alarm"
          variant="glass"
        >
          {TEXT}
        </Modal>
      )}
    </Cell>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <Cell>
      {(container) => (
        <Modal container={container} footer={<Footer />} open size="sm" title="Acknowledge alarm">
          {TEXT}
        </Modal>
      )}
    </Cell>
  ),
};

/**
 * `photo` stands in for the background image a glass modal is meant to sit
 * on — over a flat surface the pane looks like any other dialog.
 */
function Cell({
  children,
  photo = false,
}: {
  children: (container: RefObject<HTMLElement | null>) => ReactNode;
  photo?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={frameRef}
      style={{
        position: "relative",
        width: "100%",
        height: "18rem",
        transform: "translateZ(0)",
        background: photo
          ? "conic-gradient(from 210deg at 30% 20%, #2f6d3a, #7fae46, #c9d17a, #2b5f7a, #2f6d3a)"
          : undefined,
      }}
    >
      {children(frameRef)}
    </div>
  );
}
