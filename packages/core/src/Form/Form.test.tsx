import { describe, expect, it } from "vitest";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { FormRow } from "../FormRow/FormRow.js";
import { TextInput } from "../TextInput/TextInput.js";
import { renderRoot } from "../test/render.js";
import { Form } from "./Form.js";

describe("Form", () => {
  it("renders a form with its children and native attributes", () => {
    const { tag, attrs, markup } = renderRoot(
      <Form action="/setpoints" id="f1" method="post">
        <TextInput label="Name" />
      </Form>,
    );
    expect(tag).toBe("form");
    expect(attrs.action).toBe("/setpoints");
    expect(attrs.method).toBe("post");
    expect(attrs.id).toBe("f1");
    expect(markup).toContain("Name");
  });
});

describe("Fieldset", () => {
  it("renders a fieldset with a legend", () => {
    const { tag, attrs, markup } = renderRoot(
      <Fieldset legend="Limits">
        <TextInput label="Min" />
      </Fieldset>,
    );
    expect(tag).toBe("fieldset");
    expect(attrs["data-legend"]).toBe("");
    expect(markup).toMatch(/<legend[^>]*>Limits<\/legend>/);
    expect(attrs).not.toHaveProperty("data-disabled");
  });

  it("works without a legend", () => {
    const { attrs, markup } = renderRoot(
      <Fieldset>
        <TextInput label="Min" />
      </Fieldset>,
    );
    expect(attrs).not.toHaveProperty("data-legend");
    expect(markup).not.toContain("<legend");
  });

  it("locks itself and the fields inside it", () => {
    const { attrs, markup } = renderRoot(
      <Fieldset disabled legend="Limits">
        <TextInput label="Min" />
      </Fieldset>,
    );
    expect(attrs["data-disabled"]).toBe("");
    expect(attrs).toHaveProperty("disabled");

    expect(markup).toMatch(/<input[^>]*disabled/);
  });
});

describe("FormRow", () => {
  it("splits the row evenly without spans", () => {
    const two = renderRoot(
      <FormRow>
        <TextInput label="A" />
        <TextInput label="B" />
      </FormRow>,
    ).markup;
    expect(two.match(/data-span="6"/g)).toHaveLength(2);

    const three = renderRoot(
      <FormRow>
        <TextInput label="A" />
        <TextInput label="B" />
        <TextInput label="C" />
      </FormRow>,
    ).markup;
    expect(three.match(/data-span="4"/g)).toHaveLength(3);

    const four = renderRoot(
      <FormRow>
        <TextInput label="A" />
        <TextInput label="B" />
        <TextInput label="C" />
        <TextInput label="D" />
      </FormRow>,
    ).markup;
    expect(four.match(/data-span="3"/g)).toHaveLength(4);
  });

  it("gives a remainder to the last field", () => {
    const { markup } = renderRoot(
      <FormRow>
        <TextInput label="A" />
        <TextInput label="B" />
        <TextInput label="C" />
        <TextInput label="D" />
        <TextInput label="E" />
      </FormRow>,
    );
    expect(markup.match(/data-span="2"/g)).toHaveLength(4);
    expect(markup.match(/data-span="4"/g)).toHaveLength(1);
  });

  it("takes spans in the given order", () => {
    const { markup } = renderRoot(
      <FormRow spans={[8, 4]}>
        <TextInput label="A" />
        <TextInput label="B" />
      </FormRow>,
    );
    expect(markup).toMatch(/data-span="8"[\s\S]*data-span="4"/);
  });

  it("throws when the sum is not 12 or the length does not match", () => {
    expect(() =>
      renderRoot(
        <FormRow spans={[6, 4]}>
          <TextInput label="A" />
          <TextInput label="B" />
        </FormRow>,
      ),
    ).toThrow(/10 columns/);
    expect(() =>
      renderRoot(
        <FormRow spans={[12]}>
          <TextInput label="A" />
          <TextInput label="B" />
        </FormRow>,
      ),
    ).toThrow(/1 spans for 2 fields/);
  });
});
