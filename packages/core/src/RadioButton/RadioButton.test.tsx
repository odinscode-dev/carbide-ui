import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { RadioButton, RadioGroup } from "./RadioButton.js";

function Options() {
  return (
    <>
      <RadioButton label="Automatic" value="auto" />
      <RadioButton label="Manual" value="manual" />
      <RadioButton disabled label="Service" value="service" />
    </>
  );
}

function rowFor(markup: string, value: string): string {
  const match = new RegExp(`<label[^>]*:radio:${value}"[^>]*>`).exec(markup);
  if (match === null) {
    throw new Error(`No row '${value}' in markup: ${markup}`);
  }
  return match[0];
}

describe("RadioGroup", () => {
  it("renders a group with a caption and one row per option", () => {
    const { tag, attrs, markup } = renderRoot(
      <RadioGroup label="Operating mode">
        <Options />
      </RadioGroup>,
    );
    expect(tag).toBe("div");
    expect(attrs.role).toBe("radiogroup");
    expect(markup).toContain("Operating mode");
    expect(markup.match(/data-part="item"/g)).toHaveLength(3);
    expect(markup.match(/type="radio"/g)).toHaveLength(3);
  });

  it("marks the selected row and only that one", () => {
    const { markup } = renderRoot(
      <RadioGroup label="Mode" value="manual">
        <Options />
      </RadioGroup>,
    );
    expect(rowFor(markup, "manual")).toContain('data-state="checked"');
    expect(rowFor(markup, "auto")).toContain('data-state="unchecked"');
    expect(rowFor(markup, "service")).toContain('data-state="unchecked"');
  });

  it("selects nothing without value", () => {
    const { markup } = renderRoot(
      <RadioGroup label="Mode">
        <Options />
      </RadioGroup>,
    );
    expect(markup).not.toContain('data-state="checked"');
  });

  it("writes the alignment as data-orientation on the root element", () => {
    expect(
      renderRoot(
        <RadioGroup label="M">
          <Options />
        </RadioGroup>,
      ).attrs["data-orientation"],
    ).toBe("vertical");

    expect(
      renderRoot(
        <RadioGroup label="M" orientation="horizontal">
          <Options />
        </RadioGroup>,
      ).attrs["data-orientation"],
    ).toBe("horizontal");
  });

  it("locks a single row without the group", () => {
    const { attrs, markup } = renderRoot(
      <RadioGroup label="M">
        <Options />
      </RadioGroup>,
    );
    expect(attrs).not.toHaveProperty("data-disabled");
    expect(rowFor(markup, "service")).toContain("data-disabled");
    expect(rowFor(markup, "auto")).not.toContain("data-disabled");
  });

  it("locks the whole group and every row with disabled", () => {
    const { attrs, markup } = renderRoot(
      <RadioGroup disabled label="M">
        <Options />
      </RadioGroup>,
    );
    expect(attrs["data-disabled"]).toBe("");
    expect(rowFor(markup, "auto")).toContain("data-disabled");
    expect(rowFor(markup, "manual")).toContain("data-disabled");
  });

  it("writes invalid on the root element and on every row", () => {
    const { attrs, markup } = renderRoot(
      <RadioGroup invalid label="M">
        <Options />
      </RadioGroup>,
    );
    expect(attrs["data-invalid"]).toBe("");
    expect(rowFor(markup, "auto")).toContain("data-invalid");
  });

  it("passes id and name through", () => {
    const { attrs, markup } = renderRoot(
      <RadioGroup id="mode" label="M" name="operating-mode">
        <Options />
      </RadioGroup>,
    );
    expect(attrs.id).toBe("mode");
    expect(markup).toContain('name="operating-mode"');
  });
});
