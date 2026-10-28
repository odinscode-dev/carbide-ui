// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderRoot } from "../test/render.js";
import { Wizard, type WizardStep } from "./Wizard.js";

const STEPS: WizardStep[] = [
  { title: "Select recipe", content: <p>Recipe form</p> },
  { title: "Check tanks", optional: true, content: <p>Tank form</p> },
  { title: "Confirm batch", content: <p>Summary</p> },
];

const NOOP = () => undefined;

describe("Wizard", () => {
  it("renders title and content of the current step", () => {
    const { tag, markup } = renderRoot(
      <Wizard
        activeStep={0}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    expect(tag).toBe("div");
    expect(markup).toContain("Select recipe");
    expect(markup).toContain("Recipe form");
  });

  it("passes native attributes through", () => {
    const { attrs } = renderRoot(
      <Wizard
        activeStep={0}
        id="onboarding"
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    expect(attrs.id).toBe("onboarding");
  });

  it("first step: Previous locked, Next visible, no Submit", () => {
    const { markup } = renderRoot(
      <Wizard
        activeStep={0}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    const previous = markup.match(/<button[^>]*>Previous<\/button>/)?.[0] ?? "";
    expect(previous).toContain("disabled");
    expect(markup).toContain(">Next<");
    expect(markup).not.toContain(">Submit<");
  });

  it("last step: Submit instead of Next", () => {
    const { markup } = renderRoot(
      <Wizard
        activeStep={2}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    expect(markup).toContain(">Submit<");
    expect(markup).not.toContain(">Next<");
    const previous = markup.match(/<button[^>]*>Previous<\/button>/)?.[0] ?? "";
    expect(previous).not.toContain("disabled");
  });

  it("invalid step locks Next and marks the step in the list", () => {
    const { markup } = renderRoot(
      <Wizard
        activeStep={0}
        isStepValid={() => false}
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    const next = markup.match(/<button[^>]*>Next<\/button>/)?.[0] ?? "";
    expect(next).toContain("disabled");
    expect(markup).toMatch(/data-part="item"[^>]*data-state="invalid"/);
  });

  it("optional step shows the marker in the list", () => {
    const { markup } = renderRoot(
      <Wizard
        activeStep={0}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    expect(markup).toContain("Optional");
  });

  it("button captions are overridable", () => {
    const { markup } = renderRoot(
      <Wizard
        activeStep={1}
        cancelText="Abort"
        isStepValid={() => true}
        nextText="Continue"
        onCancel={NOOP}
        onStepChange={NOOP}
        onSubmit={NOOP}
        previousText="Back"
        steps={STEPS}
      />,
    );
    expect(markup).toContain(">Abort<");
    expect(markup).toContain(">Back<");
    expect(markup).toContain(">Continue<");
  });
});

describe("Wizard, click", () => {
  afterEach(cleanup);

  it("Next leads to the next step when the current one is valid", async () => {
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={0}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(onStepChange).toHaveBeenCalledExactlyOnceWith(1));
  });

  it("Next is locked when the current step is invalid", () => {
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={0}
        isStepValid={() => false}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("Previous leads back to the previous step", async () => {
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={1}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    await waitFor(() => expect(onStepChange).toHaveBeenCalledExactlyOnceWith(0));
  });

  it("Previous is locked on the first step", () => {
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={0}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("Submit runs only on the last step and does not call onStepChange", () => {
    const onSubmit = vi.fn();
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={2}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={onSubmit}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("Cancel calls onCancel, regardless of the step", () => {
    const onCancel = vi.fn();
    render(
      <Wizard
        activeStep={1}
        isStepValid={() => true}
        onCancel={onCancel}
        onStepChange={NOOP}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("clicking a completed step in the list jumps back to it", async () => {
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={2}
        isStepValid={() => true}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: /Select recipe/ }));
    await waitFor(() => expect(onStepChange).toHaveBeenCalledExactlyOnceWith(0));
  });

  it("clicking a step ahead is locked when the current one is invalid", () => {
    const onStepChange = vi.fn();
    render(
      <Wizard
        activeStep={0}
        isStepValid={() => false}
        onCancel={NOOP}
        onStepChange={onStepChange}
        onSubmit={NOOP}
        steps={STEPS}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: /Confirm batch/ }));
    expect(onStepChange).not.toHaveBeenCalled();
  });
});
