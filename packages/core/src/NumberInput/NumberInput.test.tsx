import { describe, expect, it } from "vitest";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { renderRoot } from "../test/render.js";
import { NumberInput } from "./NumberInput.js";

function inputField(markup: string): string {
  const match = /<input[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in markup: ${markup}`);
  }
  return match[0];
}

function inputButton(markup: string, name: string): string {
  const match = new RegExp(`<button[^>]*aria-label="${name}"[^>]*>`).exec(markup);
  if (match === null) {
    throw new Error(`No button '${name}' in markup: ${markup}`);
  }
  return match[0];
}

describe("NumberInput", () => {
  it("renders label, value and the two buttons", () => {
    const { tag, markup } = renderRoot(<NumberInput label="Pressure" value={2.4} />);
    expect(tag).toBe("div");
    expect(markup).toContain("Pressure");
    expect(inputField(markup)).toContain('value="2.4"');
    expect(markup).toMatch(/data-part="decrement-trigger"/);
    expect(markup).toMatch(/data-part="increment-trigger"/);
  });

  it("gives the field the spinbutton role with range and step", () => {
    const { markup } = renderRoot(
      <NumberInput label="Level" max={10} min={0} step={1} value={5} />,
    );
    const input = inputField(markup);
    expect(input).toContain('role="spinbutton"');
    expect(input).toContain('aria-valuemin="0"');
    expect(input).toContain('aria-valuemax="10"');
    expect(input).toContain('aria-valuenow="5"');
  });

  it("leaves an empty field empty instead of inventing a zero", () => {
    expect(inputField(renderRoot(<NumberInput label="Level" />).markup)).toContain('value=""');
  });

  it("accepts comma and period in the input", () => {
    const { markup } = renderRoot(<NumberInput label="Level" value={1.5} />);
    expect(inputField(markup)).toContain('pattern="-?[0-9]*[.,]?[0-9]*"');
  });

  it("shows the unit and sets data-unit on the root element", () => {
    const withUnit = renderRoot(<NumberInput label="Pressure" unit="bar" value={2.4} />);
    expect(withUnit.attrs["data-unit"]).toBe("");
    expect(withUnit.markup).toContain(">bar</span>");

    expect(renderRoot(<NumberInput label="Pressure" />).attrs).not.toHaveProperty("data-unit");
  });

  it("locks the minus button at the minimum and the plus button at the maximum", () => {
    const atMin = renderRoot(<NumberInput label="Level" max={10} min={0} value={0} />).markup;
    expect(inputButton(atMin, "Decrease value")).toContain("disabled");
    expect(inputButton(atMin, "Increase value")).not.toContain("disabled");

    const atMax = renderRoot(<NumberInput label="Level" max={10} min={0} value={10} />).markup;
    expect(inputButton(atMax, "Increase value")).toContain("disabled");
    expect(inputButton(atMax, "Decrease value")).not.toContain("disabled");
  });

  it("lets the button names be overridden", () => {
    const { markup } = renderRoot(
      <NumberInput decrementLabel="Less" incrementLabel="More" label="Level" value={5} />,
    );
    expect(markup).toContain('aria-label="More"');
    expect(markup).toContain('aria-label="Less"');
  });

  it("writes invalid, disabled and readOnly as data attributes on the root element", () => {
    expect(renderRoot(<NumberInput invalid label="L" />).attrs["data-invalid"]).toBe("");
    expect(renderRoot(<NumberInput disabled label="L" />).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<NumberInput label="L" readOnly />).attrs["data-readonly"]).toBe("");

    const plain = renderRoot(<NumberInput label="L" />).attrs;
    expect(plain).not.toHaveProperty("data-invalid");
    expect(plain).not.toHaveProperty("data-disabled");
    expect(plain).not.toHaveProperty("data-readonly");
  });

  it("shows the error text only when invalid", () => {
    expect(renderRoot(<NumberInput errorText="Too high" label="L" />).markup).not.toContain(
      "Too high",
    );
    expect(renderRoot(<NumberInput errorText="Too high" invalid label="L" />).markup).toContain(
      "Too high",
    );
  });

  it("is itself locked inside a disabled Fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset disabled legend="Setpoint">
        <NumberInput label="Level" value={5} />
      </Fieldset>,
    );
    expect(inputField(markup)).toContain("disabled");
  });

  it("connects label and field via the field's id", () => {
    const { markup } = renderRoot(<NumberInput id="level" label="Level" value={5} />);
    expect(markup).toMatch(/data-part="label"[^>]*for="level"/);
    expect(inputField(markup)).toContain('id="level"');
  });
});
