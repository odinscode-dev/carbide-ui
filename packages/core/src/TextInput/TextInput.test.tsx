import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { TextInput } from "./TextInput.js";

function field(markup: string): string {
  const match = /<input[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in the markup: ${markup}`);
  }
  return match[0];
}

describe("TextInput", () => {
  it("renders label and input in one group", () => {
    const { tag, attrs, markup } = renderRoot(<TextInput label="Setpoint" />);
    expect(tag).toBe("div");
    expect(attrs.role).toBe("group");
    expect(markup).toContain("Setpoint");
    expect(markup).toMatch(/data-part="label"/);
    expect(markup).toMatch(/data-part="input"/);
  });

  it("connects label and field via the field's id", () => {
    const { markup } = renderRoot(<TextInput id="setpoint" label="Setpoint" />);
    expect(markup).toMatch(/data-part="label"[^>]*for="setpoint"/);
    expect(field(markup)).toContain('id="setpoint"');
  });

  it("passes the value and native attributes through to the field", () => {
    const { markup } = renderRoot(
      <TextInput label="Setpoint" maxLength={8} placeholder="Name" value="Inlet" />,
    );
    const input = field(markup);
    expect(input).toContain('value="Inlet"');
    expect(input).toContain('placeholder="Name"');
    expect(input.toLowerCase()).toContain('maxlength="8"');
  });

  it("shows the help text and leaves it out on error", () => {
    expect(renderRoot(<TextInput helperText="Hint" label="Setpoint" />).markup).toContain("Hint");

    const invalidMarkup = renderRoot(
      <TextInput errorText="Too short" helperText="Hint" invalid label="Setpoint" />,
    ).markup;
    expect(invalidMarkup).not.toContain("Hint");
    expect(invalidMarkup).toContain("Too short");
  });

  it("shows the error text only when invalid", () => {
    expect(renderRoot(<TextInput errorText="Too short" label="Setpoint" />).markup).not.toContain(
      "Too short",
    );
  });

  it("places prefix and suffix around the field", () => {
    const { attrs, markup } = renderRoot(
      <TextInput label="Pressure" prefix="max" suffix="bar" value="2.40" />,
    );
    expect(attrs["data-prefix"]).toBe("");
    expect(attrs["data-suffix"]).toBe("");
    expect(markup).toMatch(/>max<\/span><input/);
    expect(markup).toMatch(/<\/input>|\/>\s*<span[^>]*>bar<\/span>|><span[^>]*>bar<\/span>/);
  });

  it("leaves out prefix and suffix when missing", () => {
    const { attrs } = renderRoot(<TextInput label="Pressure" />);
    expect(attrs).not.toHaveProperty("data-prefix");
    expect(attrs).not.toHaveProperty("data-suffix");
  });

  it("writes invalid, disabled and readOnly as data attributes on the root element", () => {
    expect(renderRoot(<TextInput invalid label="S" />).attrs["data-invalid"]).toBe("");
    expect(renderRoot(<TextInput disabled label="S" />).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<TextInput label="S" readOnly />).attrs["data-readonly"]).toBe("");

    const plain = renderRoot(<TextInput label="S" />).attrs;
    expect(plain).not.toHaveProperty("data-invalid");
    expect(plain).not.toHaveProperty("data-disabled");
    expect(plain).not.toHaveProperty("data-readonly");
  });

  it("locks and marks the field itself, not just the frame", () => {
    const { markup } = renderRoot(<TextInput disabled invalid label="S" />);
    const input = field(markup);
    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain("disabled");
  });
});
