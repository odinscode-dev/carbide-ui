import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Fieldset } from "./Fieldset.js";

describe("Fieldset", () => {
  it("renders a legend and marks the root with data-legend when one is given", () => {
    const { tag, attrs } = renderRoot(<Fieldset legend="Setpoint" />);
    expect(tag).toBe("fieldset");
    expect(attrs["data-legend"]).toBe("");
    expect(renderToStaticMarkup(<Fieldset legend="Setpoint" />)).toContain("Setpoint");
  });

  it("renders no legend element and no data-legend without one", () => {
    const { attrs } = renderRoot(<Fieldset />);
    expect(attrs).not.toHaveProperty("data-legend");
    expect(renderToStaticMarkup(<Fieldset />)).not.toContain("<legend");
  });

  it("disables the root and every descendant field", () => {
    const markup = renderToStaticMarkup(
      <Fieldset disabled>
        <input />
      </Fieldset>,
    );
    expect(markup).toContain('disabled=""');
  });

  it("is enabled by default", () => {
    const { attrs } = renderRoot(<Fieldset />);
    expect(attrs).not.toHaveProperty("disabled");
  });

  it("renders children inside the fields wrapper", () => {
    expect(renderToStaticMarkup(<Fieldset>marker-child</Fieldset>)).toContain("marker-child");
  });
});
