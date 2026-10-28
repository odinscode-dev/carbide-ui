import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { DateRangePicker } from "./DateRangePicker.js";

const FROM = new Date(2026, 8, 10);
const TO = new Date(2026, 8, 17);

describe("DateRangePicker", () => {
  it("renders two inputs and a calendar button", () => {
    const { tag, markup } = renderRoot(<DateRangePicker label="Reporting period" />);
    expect(tag).toBe("div");
    expect(markup).toContain("Reporting period");
    expect(markup.match(/<input/g)).toHaveLength(2);
    expect(markup).toMatch(/<button/);
  });

  it("leaves To empty when only From is set", () => {
    const { markup } = renderRoot(
      <DateRangePicker label="L" value={{ from: FROM, to: undefined }} />,
    );
    const fields = [...markup.matchAll(/<input[^>]*value="([^"]*)"/g)].map((match) => match[1]);
    expect(fields[0]).not.toBe("");
    expect(fields[1] ?? "").toBe("");
  });

  it("writes invalid as a data attribute on the root element", () => {
    expect(
      renderRoot(<DateRangePicker invalid label="L" value={{ from: TO, to: FROM }} />).attrs[
        "data-invalid"
      ],
    ).toBe("");
    expect(renderRoot(<DateRangePicker label="L" />).attrs).not.toHaveProperty("data-invalid");
  });

  it("passes the id through to both inputs, each with its own suffix", () => {
    const { markup } = renderRoot(<DateRangePicker id="period" label="L" />);
    expect(markup).toMatch(/<input[^>]*id="period-from"/);
    expect(markup).toMatch(/<input[^>]*id="period-to"/);
  });
});
