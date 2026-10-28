import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FormRow } from "./FormRow.js";

function spansOf(element: ReturnType<typeof FormRow>): number[] {
  const markup = renderToStaticMarkup(element);
  return [...markup.matchAll(/data-span="(\d+)"/g)].map(([, value]) => Number(value));
}

describe("FormRow", () => {
  it("splits two fields evenly", () => {
    expect(
      spansOf(
        <FormRow>
          <div />
          <div />
        </FormRow>,
      ),
    ).toStrictEqual([6, 6]);
  });

  it("puts the remainder in the last cell when the count doesn't divide evenly", () => {
    expect(
      spansOf(
        <FormRow>
          <div />
          <div />
          <div />
          <div />
          <div />
        </FormRow>,
      ),
    ).toStrictEqual([2, 2, 2, 2, 4]);
  });

  it("takes explicit spans that add up to 12", () => {
    expect(
      spansOf(
        <FormRow spans={[8, 4]}>
          <div />
          <div />
        </FormRow>,
      ),
    ).toStrictEqual([8, 4]);
  });

  it("throws when the number of spans doesn't match the number of fields", () => {
    expect(() =>
      renderToStaticMarkup(
        <FormRow spans={[6, 6]}>
          <div />
        </FormRow>,
      ),
    ).toThrow(/1 spans for 1 fields|2 spans for 1 fields/);
  });

  it("throws when the spans don't add up to 12", () => {
    expect(() =>
      renderToStaticMarkup(
        <FormRow spans={[6, 5]}>
          <div />
          <div />
        </FormRow>,
      ),
    ).toThrow(/add up to 11 columns/);
  });

  it("throws on a span of 0, even if the sum is still 12", () => {
    expect(() =>
      renderToStaticMarkup(
        <FormRow spans={[0, 12]}>
          <div />
          <div />
        </FormRow>,
      ),
    ).toThrow(/span 0 is outside 1\.\.12/);
  });

  it("throws on a span above 12", () => {
    expect(() =>
      renderToStaticMarkup(
        <FormRow spans={[13, -1]}>
          <div />
          <div />
        </FormRow>,
      ),
    ).toThrow(/span 13 is outside 1\.\.12/);
  });
});
