import { useSteps } from "@ark-ui/react/steps";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../Button/index.js";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import { ProgressIndicator, type ProgressIndicatorStep } from "../ProgressIndicator/index.js";
import { ScrollArea } from "../ScrollArea/index.js";
import styles from "./Wizard.module.css";

export interface WizardStep {
  title: string;

  description?: string;

  optional?: boolean;
  content: ReactNode;
}

export interface WizardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onSubmit"> {
  steps: WizardStep[];

  activeStep: number;
  onStepChange: (index: number) => void;

  onSubmit: () => void;

  onCancel: () => void;

  isStepValid: (index: number) => boolean;
  cancelText?: string;
  previousText?: string;
  nextText?: string;
  submitText?: string;
}

export function Wizard({
  steps,
  activeStep,
  onStepChange,
  onSubmit,
  onCancel,
  isStepValid,
  cancelText,
  previousText,
  nextText,
  submitText,
  id,
  className,
  ...rest
}: WizardProps) {
  const api = useSteps({
    count: steps.length,
    isStepValid,
    linear: true,
    onStepChange: (details) => onStepChange(details.step),
    step: activeStep,
  });

  const listSteps: ProgressIndicatorStep[] = steps.map((step, index) => {
    const description = descriptionOf(step);
    return {
      ...(description === undefined ? {} : { description }),
      label: step.title,
      state: stepState(index, activeStep, isStepValid),
    };
  });

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const isValid = isStepValid(activeStep);

  return (
    <div {...rest} className={joinClassNames(styles.root, className)} id={id}>
      <div className={styles.list}>
        <ProgressIndicator
          current={activeStep}
          onStepClick={api.setStep}
          orientation="vertical"
          steps={listSteps}
        />
      </div>
      <div className={styles.panel}>
        {currentStep === undefined ? null : (
          <header className={styles.head}>
            <h2 className={styles.title}>{currentStep.title}</h2>
            {currentStep.description === undefined ? null : (
              <p className={styles.description}>{currentStep.description}</p>
            )}
          </header>
        )}
        <ScrollArea className={styles.content}>
          <div className={styles.contentInner}>{currentStep?.content}</div>
        </ScrollArea>
        <div className={styles.actions}>
          <Button onClick={onCancel} variant="secondary">
            {cancelText ?? t("wizard.cancel")}
          </Button>
          <div className={styles.actionsEnd}>
            <Button disabled={!api.hasPrevStep} onClick={api.goToPrevStep} variant="secondary">
              {previousText ?? t("wizard.previous")}
            </Button>
            {isLastStep ? (
              <Button disabled={!isValid} onClick={onSubmit} variant="primary">
                {submitText ?? t("wizard.submit")}
              </Button>
            ) : (
              <Button disabled={!isValid} onClick={api.goToNextStep} variant="primary">
                {nextText ?? t("next")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function stepState(
  index: number,
  activeStep: number,
  isStepValid: (index: number) => boolean,
): ProgressIndicatorStep["state"] {
  if (index <= activeStep && !isStepValid(index)) {
    return "invalid";
  }
  if (index < activeStep) {
    return "complete";
  }
  if (index === activeStep) {
    return "current";
  }
  return "incomplete";
}

function descriptionOf(step: WizardStep): string | undefined {
  if (step.optional !== true) {
    return step.description;
  }
  return step.description === undefined
    ? t("wizard.optional")
    : `${step.description} · ${t("wizard.optional")}`;
}
