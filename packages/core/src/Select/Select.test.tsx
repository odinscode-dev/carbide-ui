import { describe, expect, it } from "vitest";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { renderRoot } from "../test/render.js";
import { Select } from "./Select.js";

const ITEMS = [
  { value: "auto", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "off", label: "Off", disabled: true },
];

function trigger(markup: string): string {
  const match = /<button[^>]*data-part="trigger"[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No trigger in markup: ${markup}`);
  }
  return match[0];
}

describe("Select", () => {
  it("renders label, a trigger with a placeholder and the list", () => {
    const { tag, markup } = renderRoot(<Select items={ITEMS} label="Mode" />);
    expect(tag).toBe("div");
    expect(markup).toMatch(/data-part="label"[^>]*>Mode</);
    expect(trigger(markup)).toContain('role="combobox"');
    expect(trigger(markup)).toContain("data-placeholder-shown");
    expect(markup).toContain("Select an option");
    expect(markup.match(/data-part="item"/g)).toHaveLength(3);
    expect(markup).toContain("Automatic");
  });

  it("shows the selection instead of the placeholder", () => {
    const { markup } = renderRoot(<Select items={ITEMS} label="Mode" value="manual" />);
    expect(trigger(markup)).not.toContain("data-placeholder-shown");
    expect(markup).toMatch(/data-part="value-text"[^>]*>Manual</);
    expect(markup).toMatch(/data-part="item"[^>]*data-value="manual"[^>]*data-state="checked"/);
  });

  it("lets placeholder and empty text be overridden", () => {
    expect(
      renderRoot(<Select items={ITEMS} label="M" placeholder="Please choose" />).markup,
    ).toContain("Please choose");
    const empty = renderRoot(<Select items={[]} label="M" />);
    expect(empty.attrs["data-empty"]).toBe("");
    expect(empty.markup).toContain("No options");
    expect(renderRoot(<Select emptyText="Nothing here" items={[]} label="M" />).markup).toContain(
      "Nothing here",
    );
  });

  it("marks disabled items", () => {
    const { markup } = renderRoot(<Select items={ITEMS} label="M" />);
    expect(markup).toMatch(/data-part="item"[^>]*data-value="off"[^>]*data-disabled/);
  });

  it("writes disabled and invalid as data attributes on the root element", () => {
    const locked = renderRoot(<Select disabled items={ITEMS} label="M" />);
    expect(locked.attrs["data-disabled"]).toBe("");
    expect(trigger(locked.markup)).toContain("disabled");
    expect(renderRoot(<Select invalid items={ITEMS} label="M" />).attrs["data-invalid"]).toBe("");
    const plain = renderRoot(<Select items={ITEMS} label="M" />).attrs;
    expect(plain).not.toHaveProperty("data-disabled");
    expect(plain).not.toHaveProperty("data-invalid");
  });

  it("passes id to the trigger and name to the hidden select", () => {
    const { markup } = renderRoot(<Select id="mode" items={ITEMS} label="M" name="mode" />);
    expect(trigger(markup)).toContain('id="mode"');

    expect(trigger(markup)).toMatch(/aria-labelledby="[^"]*:label"/);
    expect(markup).toMatch(/<select[^>]*name="mode"/);
  });

  it("renders a divider between groups, outside the selection", () => {
    const { markup } = renderRoot(
      <Select
        items={[
          { value: "auto", label: "Automatic" },
          { divider: true, variant: "warning" },
          { value: "manual", label: "Manual" },
        ]}
        label="M"
      />,
    );
    expect(markup).toMatch(/<hr[^>]*data-variant="warning"/);
    expect(markup.match(/data-part="item"/g)).toHaveLength(2);
  });

  it("treats a list made only of dividers as empty", () => {
    const { attrs, markup } = renderRoot(<Select items={[{ divider: true }]} label="M" />);
    expect(attrs["data-empty"]).toBe("");
    expect(markup).toContain("No options");
  });

  it("is itself locked inside a disabled Fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset disabled legend="Mode">
        <Select items={ITEMS} label="M" />
      </Fieldset>,
    );
    expect(trigger(markup)).toContain("disabled");
  });
});
