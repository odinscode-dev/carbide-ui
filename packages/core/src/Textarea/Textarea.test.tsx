import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Textarea } from "./Textarea.js";

function field(markup: string): string {
  const match = /<textarea[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in the markup: ${markup}`);
  }
  return match[0];
}

describe("Textarea", () => {
  it("renders label and input in one group", () => {
    const { tag, attrs, markup } = renderRoot(<Textarea label="Notes" />);
    expect(tag).toBe("div");
    expect(attrs.role).toBe("group");
    expect(markup).toContain("Notes");
    expect(markup).toMatch(/data-part="label"/);
    expect(markup).toMatch(/data-part="textarea"/);
  });

  it("connects label and field via the field's id", () => {
    const { markup } = renderRoot(<Textarea id="notes" label="Notes" />);
    expect(markup).toMatch(/data-part="label"[^>]*for="notes"/);
    expect(field(markup)).toContain('id="notes"');
  });

  it("passes the value and native attributes through to the field", () => {
    const { markup } = renderRoot(
      <Textarea label="Notes" maxLength={40} placeholder="Shift notes" rows={6} value="Inlet" />,
    );
    const input = field(markup);
    expect(markup).toContain(">Inlet</textarea>");
    expect(input).toContain('placeholder="Shift notes"');
    expect(input.toLowerCase()).toContain('maxlength="40"');
    expect(input).toContain('rows="6"');
  });

  it("sets four rows by default", () => {
    expect(field(renderRoot(<Textarea label="Notes" />).markup)).toContain('rows="4"');
  });

  it("shows the help text and leaves it out on error", () => {
    expect(renderRoot(<Textarea helperText="Hint" label="Notes" />).markup).toContain("Hint");

    const invalidMarkup = renderRoot(
      <Textarea errorText="Too short" helperText="Hint" invalid label="Notes" />,
    ).markup;
    expect(invalidMarkup).not.toContain("Hint");
    expect(invalidMarkup).toContain("Too short");
  });

  it("shows the error text only when invalid", () => {
    expect(renderRoot(<Textarea errorText="Too short" label="Notes" />).markup).not.toContain(
      "Too short",
    );
  });

  it("writes invalid, disabled and readOnly as data attributes on the root element", () => {
    expect(renderRoot(<Textarea invalid label="S" />).attrs["data-invalid"]).toBe("");
    expect(renderRoot(<Textarea disabled label="S" />).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<Textarea label="S" readOnly />).attrs["data-readonly"]).toBe("");

    const plain = renderRoot(<Textarea label="S" />).attrs;
    expect(plain).not.toHaveProperty("data-invalid");
    expect(plain).not.toHaveProperty("data-disabled");
    expect(plain).not.toHaveProperty("data-readonly");
  });

  it("locks and marks the field itself, not just the frame", () => {
    const { markup } = renderRoot(<Textarea disabled invalid label="S" />);
    const input = field(markup);
    expect(input).toContain('aria-invalid="true"');
    expect(input).toContain("disabled");
  });
});
