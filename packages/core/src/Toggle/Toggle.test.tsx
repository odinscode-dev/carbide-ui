import { Fieldset } from "@ark-ui/react/fieldset";
import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Toggle } from "./Toggle.js";

function field(markup: string): string {
  const match = /<input[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No input field in the markup: ${markup}`);
  }
  return match[0];
}

describe("Toggle", () => {
  it("renders a label as the root element with a track, knob and caption", () => {
    const { tag, markup } = renderRoot(<Toggle label="Pump P-101" />);
    expect(tag).toBe("label");
    expect(markup).toContain("Pump P-101");
    expect(markup).toMatch(/data-part="control"/);
    expect(markup).toMatch(/data-part="thumb"/);

    expect(field(markup)).toContain('type="checkbox"');
  });

  it("announces itself as a switch, not as a checkbox", () => {
    expect(field(renderRoot(<Toggle label="P" />).markup)).toContain('role="switch"');
  });

  it("writes the state as data-state on the root element", () => {
    expect(renderRoot(<Toggle label="P" />).attrs["data-state"]).toBe("unchecked");
    expect(renderRoot(<Toggle checked label="P" />).attrs["data-state"]).toBe("checked");
  });

  it("shows the state as a word from the catalog", () => {
    expect(renderRoot(<Toggle label="P" />).markup).toContain(">Off<");
    expect(renderRoot(<Toggle checked label="P" />).markup).toContain(">On<");
  });

  it("lets the state texts be overridden", () => {
    expect(renderRoot(<Toggle label="P" offText="Stopped" onText="Running" />).markup).toContain(
      ">Stopped<",
    );
    expect(
      renderRoot(<Toggle checked label="P" offText="Stopped" onText="Running" />).markup,
    ).toContain(">Running<");
  });

  it("keeps the state word away from assistive tech because the checkbox already announces it", () => {
    expect(renderRoot(<Toggle label="P" />).markup).toMatch(/aria-hidden="true"[^>]*>Off</);
  });

  it("writes the caption's side as data-label-position", () => {
    expect(renderRoot(<Toggle label="P" />).attrs["data-label-position"]).toBe("start");
    expect(renderRoot(<Toggle label="P" labelPosition="end" />).attrs["data-label-position"]).toBe(
      "end",
    );
  });

  it("writes disabled as a data attribute on the root element", () => {
    expect(renderRoot(<Toggle disabled label="P" />).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<Toggle label="P" />).attrs).not.toHaveProperty("data-disabled");
  });

  it("adopts the lock of a disabled fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset.Root disabled>
        <Toggle label="P" />
      </Fieldset.Root>,
    );
    expect(markup).toMatch(/data-scope="switch" data-part="root"[^>]*data-disabled=""/);

    const open = renderRoot(
      <Fieldset.Root>
        <Toggle label="P" />
      </Fieldset.Root>,
    ).markup;
    expect(open).not.toMatch(/data-scope="switch" data-part="root"[^>]*data-disabled=""/);
  });

  it("connects the caption to the input", () => {
    const { attrs, markup } = renderRoot(<Toggle id="pump" label="P" name="pump-101" />);
    expect(attrs.for).toBe("pump");
    const input = field(markup);
    expect(input).toContain('id="pump"');
    expect(input).toContain('name="pump-101"');
  });
});
