import { describe, expect, it } from "vitest";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { renderRoot } from "../test/render.js";
import { Dropdown } from "./Dropdown.js";

const ITEMS = [
  { value: "auto", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "off", label: "Off", disabled: true },
];

function field(markup: string): string {
  const match = /<input[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in the markup: ${markup}`);
  }
  return match[0];
}

describe("Dropdown", () => {
  it("renders label, input with placeholder, arrow and the list", () => {
    const { tag, markup } = renderRoot(<Dropdown items={ITEMS} label="Mode" />);
    expect(tag).toBe("div");
    expect(markup).toMatch(/data-part="label"[^>]*>Mode</);
    expect(field(markup)).toContain('role="combobox"');
    expect(field(markup)).toContain('placeholder="Select an option"');
    expect(markup).toMatch(/data-part="trigger"[^>]*aria-label="Show options"/);
    expect(markup.match(/data-part="item"/g)).toHaveLength(3);
  });

  it("shows the selection's label in the field", () => {
    const { markup } = renderRoot(<Dropdown items={ITEMS} label="Mode" value="manual" />);
    expect(field(markup)).toContain('value="Manual"');
    expect(markup).toMatch(/data-part="item"[^>]*data-state="checked"[^>]*data-value="manual"/);
  });

  it("lets the texts be overridden", () => {
    const { markup } = renderRoot(
      <Dropdown emptyText="Nothing here" items={[]} label="M" openText="List" placeholder="Type" />,
    );
    expect(field(markup)).toContain('placeholder="Type"');
    expect(markup).toContain('aria-label="List"');
    expect(markup).toContain("Nothing here");
  });

  it("shows the hint and data-empty when the list is empty", () => {
    const { attrs, markup } = renderRoot(<Dropdown items={[]} label="M" />);
    expect(attrs["data-empty"]).toBe("");
    expect(markup).toContain("No options");
    expect(renderRoot(<Dropdown items={ITEMS} label="M" />).markup).not.toContain("No options");
  });

  it("writes disabled and invalid as data attributes on the root element", () => {
    const locked = renderRoot(<Dropdown disabled items={ITEMS} label="M" />);
    expect(locked.attrs["data-disabled"]).toBe("");
    expect(field(locked.markup)).toContain("disabled");
    expect(renderRoot(<Dropdown invalid items={ITEMS} label="M" />).attrs["data-invalid"]).toBe("");
  });

  it("connects label and field via id and passes name to the field", () => {
    const { markup } = renderRoot(<Dropdown id="mode" items={ITEMS} label="M" name="mode" />);
    expect(field(markup)).toContain('id="mode"');
    expect(field(markup)).toContain('name="mode"');
    expect(markup).toMatch(/data-part="label"[^>]*for="mode"/);
  });

  it("is itself locked inside a disabled fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset disabled legend="Mode">
        <Dropdown items={ITEMS} label="M" />
      </Fieldset>,
    );
    expect(field(markup)).toContain("disabled");
  });
});
