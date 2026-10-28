import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { Wizard, type WizardProps, type WizardStep } from "./Wizard.js";

const SELECT_RECIPE: WizardStep = {
  title: "Select recipe",
  description: "Choose what to produce",
  content: <p>Recipe 4711 for hall 2, line A.</p>,
};

const CHECK_TANKS: WizardStep = {
  title: "Check tanks",
  optional: true,
  content: <p>Tank 1 to 4 are within range.</p>,
};

const CONFIRM_BATCH: WizardStep = {
  title: "Confirm batch",
  content: <p>Start batch 4711 on line A now.</p>,
};

const STEPS: WizardStep[] = [SELECT_RECIPE, CHECK_TANKS, CONFIRM_BATCH];

const WITH_ERROR: WizardStep[] = [
  SELECT_RECIPE,
  {
    title: "Check tanks",
    content: (
      <p style={{ color: "var(--carbide-status-error-text)" }}>
        Tank 3 is empty. Refill it before you continue.
      </p>
    ),
  },
  CONFIRM_BATCH,
];

function ControlledWizard(props: WizardProps) {
  const [current, setCurrent] = useState(props.activeStep);
  return (
    <div style={{ height: "26rem" }}>
      <Wizard
        {...props}
        activeStep={current}
        onCancel={() => setCurrent(0)}
        onStepChange={setCurrent}
        onSubmit={() => setCurrent(0)}
      />
    </div>
  );
}

const meta: Meta<typeof Wizard> = {
  title: "Core/Wizard",
  component: Wizard,
  args: { steps: STEPS, activeStep: 0, isStepValid: () => true },
  argTypes: {
    onCancel: { control: false },
    onStepChange: { control: false },
    onSubmit: { control: false },
  },
  render: (args) => <ControlledWizard {...args} />,
};
export default meta;

type Story = StoryObj<typeof Wizard>;

export const Default: Story = {};

export const FirstStep: Story = { args: { activeStep: 0 } };

export const MiddleStep: Story = { args: { activeStep: 1 } };

export const LastStep: Story = { args: { activeStep: 2 } };

export const Invalid: Story = {
  args: {
    steps: WITH_ERROR,
    activeStep: 1,
    isStepValid: (index) => index !== 1,
  },
};

export const CustomTexts: Story = {
  args: {
    cancelText: "Abort",
    previousText: "Back",
    nextText: "Continue",
    submitText: "Start batch",
    activeStep: 2,
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <>
      <div style={{ height: "26rem" }}>
        <Wizard
          activeStep={0}
          isStepValid={() => true}
          onCancel={() => undefined}
          onStepChange={() => undefined}
          onSubmit={() => undefined}
          steps={STEPS}
        />
      </div>
      <div style={{ height: "26rem" }}>
        <Wizard
          activeStep={1}
          isStepValid={(index) => index !== 1}
          onCancel={() => undefined}
          onStepChange={() => undefined}
          onSubmit={() => undefined}
          steps={WITH_ERROR}
        />
      </div>
      <div style={{ height: "26rem" }}>
        <Wizard
          activeStep={2}
          isStepValid={() => true}
          onCancel={() => undefined}
          onStepChange={() => undefined}
          onSubmit={() => undefined}
          steps={STEPS}
        />
      </div>
    </>
  ),
};
