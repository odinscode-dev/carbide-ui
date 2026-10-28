import { describe, expect, it } from "vitest";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { formatNumber } from "../format/number.js";
import { renderRoot } from "../test/render.js";
import { Slider } from "./Slider.js";

function thumbs(markup: string): string[] {
  return markup.match(/<div[^>]*data-part="thumb"[^>]*>/g) ?? [];
}

describe("Slider", () => {
  it("renders label, value display, track, range and one thumb", () => {
    const { tag, attrs, markup } = renderRoot(<Slider label="Setpoint" value={40} />);
    expect(tag).toBe("div");
    expect(attrs).not.toHaveProperty("data-range");
    expect(markup).toMatch(/data-part="label"[^>]*>Setpoint</);
    expect(markup).toMatch(/data-part="value-text"[^>]*>40</);
    expect(markup).toMatch(/data-part="track"[\s\S]*data-part="range"/);
    expect(thumbs(markup)).toHaveLength(1);
    expect(thumbs(markup)[0]).toContain('role="slider"');
    expect(thumbs(markup)[0]).toContain('aria-valuenow="40"');
  });

  it("passes min, max and step to the thumb", () => {
    const { markup } = renderRoot(<Slider label="S" max={6} min={0.5} step={0.1} value={2.4} />);
    const [thumb] = thumbs(markup);
    expect(thumb).toContain('aria-valuemin="0.5"');
    expect(thumb).toContain('aria-valuemax="6"');
  });

  it("shows the value formatted with a unit", () => {
    const { markup } = renderRoot(<Slider label="S" unit="bar" value={2.4} />);
    expect(markup).toContain(`${formatNumber(2.4)} bar`);
  });

  it("renders a range with two thumbs and both values", () => {
    const { attrs, markup } = renderRoot(<Slider label="S" value={[20, 60]} />);
    expect(attrs["data-range"]).toBe("");
    expect(thumbs(markup)).toHaveLength(2);
    expect(markup).toMatch(/data-part="value-text"[^>]*>20 – 60</);
  });

  it("sets markers at min, max and the given values, without duplicates", () => {
    const { attrs, markup } = renderRoot(
      <Slider label="S" max={100} min={0} ticks={[50, 0, 25]} value={10} />,
    );
    expect(attrs["data-ticks"]).toBe("");
    const marks = [...markup.matchAll(/data-part="marker"[^>]*data-value="(\d+)"/g)];
    expect(marks.map((m) => m[1])).toEqual(["0", "25", "50", "100"]);
    expect(renderRoot(<Slider label="S" value={10} />).attrs).not.toHaveProperty("data-ticks");
  });

  it("writes disabled and invalid as data attributes on the root element", () => {
    const locked = renderRoot(<Slider disabled label="S" value={1} />);
    expect(locked.attrs["data-disabled"]).toBe("");
    expect(thumbs(locked.markup)[0]).toContain('aria-disabled="true"');
    expect(renderRoot(<Slider invalid label="S" value={1} />).attrs["data-invalid"]).toBe("");
    const plain = renderRoot(<Slider label="S" value={1} />).attrs;
    expect(plain).not.toHaveProperty("data-disabled");
    expect(plain).not.toHaveProperty("data-invalid");
  });

  it("passes name to the hidden inputs and id to the root element", () => {
    const { attrs, markup } = renderRoot(<Slider id="sp" label="S" name="setpoint" value={1} />);
    expect(attrs.id).toBe("sp");
    expect(markup).toMatch(/<input[^>]*name="setpoint"/);
  });

  it("is itself locked inside a disabled fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset disabled legend="Limits">
        <Slider label="S" value={1} />
      </Fieldset>,
    );
    expect(markup).toMatch(/data-scope="slider"[^>]*data-part="root"[^>]*data-disabled/);
  });
});
