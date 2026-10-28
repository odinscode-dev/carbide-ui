import { Fieldset } from "@ark-ui/react/fieldset";
import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Checkbox } from "./Checkbox.js";

function field(markup: string): string {
  const match = /<input[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in markup: ${markup}`);
  }
  return match[0];
}

describe("Checkbox", () => {
  it("renders a label as the root element with a checkbox and a caption", () => {
    const { tag, markup } = renderRoot(<Checkbox label="Log changes" />);
    expect(tag).toBe("label");
    expect(markup).toContain("Log changes");
    expect(markup).toMatch(/data-part="control"/);
    expect(markup).toMatch(/data-part="label"/);
    expect(field(markup)).toContain('type="checkbox"');
  });

  it("writes the state as data-state on the root element", () => {
    expect(renderRoot(<Checkbox label="L" />).attrs["data-state"]).toBe("unchecked");
    expect(renderRoot(<Checkbox checked label="L" />).attrs["data-state"]).toBe("checked");
    expect(renderRoot(<Checkbox indeterminate label="L" />).attrs["data-state"]).toBe(
      "indeterminate",
    );
  });

  it("lets indeterminate override the checked state", () => {
    expect(renderRoot(<Checkbox checked indeterminate label="L" />).attrs["data-state"]).toBe(
      "indeterminate",
    );
  });

  it("leaves the input operable in the third state", () => {
    const input = field(renderRoot(<Checkbox indeterminate label="L" />).markup);
    expect(input).toContain('type="checkbox"');
    expect(input).not.toContain("disabled");
  });

  it("shows the check only when checked and the dash only when indeterminate", () => {
    const checked = renderRoot(<Checkbox checked label="L" />).markup;
    const indicators = checked.match(/data-part="indicator"[^>]*>/g) ?? [];
    expect(indicators).toHaveLength(2);
    expect(indicators[0]).not.toContain("hidden");
    expect(indicators[1]).toContain("hidden");

    const indeterminate = renderRoot(<Checkbox indeterminate label="L" />).markup;
    const indeterminateIndicators = indeterminate.match(/data-part="indicator"[^>]*>/g) ?? [];
    expect(indeterminateIndicators[0]).toContain("hidden");
    expect(indeterminateIndicators[1]).not.toContain("hidden");
  });

  it("writes disabled and invalid as data attributes on the root element", () => {
    expect(renderRoot(<Checkbox disabled label="L" />).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<Checkbox invalid label="L" />).attrs["data-invalid"]).toBe("");

    const plain = renderRoot(<Checkbox label="L" />).attrs;
    expect(plain).not.toHaveProperty("data-disabled");
    expect(plain).not.toHaveProperty("data-invalid");
  });

  it("passes id, name and value through to the input", () => {
    const { markup } = renderRoot(
      <Checkbox id="log" label="L" name="options" value="log-changes" />,
    );
    const input = field(markup);
    expect(input).toContain('id="log"');
    expect(input).toContain('name="options"');
    expect(input).toContain('value="log-changes"');
  });

  it("adopts the lock of a disabled fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset.Root disabled>
        <Checkbox label="L" />
      </Fieldset.Root>,
    );
    expect(markup).toMatch(/data-scope="checkbox" data-part="root"[^>]*data-disabled=""/);

    const enabled = renderRoot(
      <Fieldset.Root>
        <Checkbox label="L" />
      </Fieldset.Root>,
    ).markup;
    expect(enabled).not.toMatch(/data-scope="checkbox" data-part="root"[^>]*data-disabled=""/);
  });

  it("connects the caption to the input", () => {
    const { attrs, markup } = renderRoot(<Checkbox id="log" label="L" />);
    expect(attrs.for).toBe("log");
    expect(field(markup)).toContain('id="log"');
  });

  it("shows no visible text with hideLabel, but carries the name as aria-label", () => {
    const { markup } = renderRoot(<Checkbox hideLabel label="Select row" />);
    expect(markup).not.toMatch(/data-part="label"/);
    expect(markup).not.toContain(">Select row<");
    expect(field(markup)).toContain('aria-label="Select row"');
  });
});
