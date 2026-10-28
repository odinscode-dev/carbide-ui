// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "../format/date.js";
import { renderRoot } from "../test/render.js";
import { DatePicker } from "./DatePicker.js";

const TODAY = new Date(2026, 8, 10);

describe("DatePicker", () => {
  it("renders a field with a label and a calendar button", () => {
    const { tag, markup } = renderRoot(<DatePicker label="Maintenance date" />);
    expect(tag).toBe("div");
    expect(markup).toContain("Maintenance date");
    expect(markup).toMatch(/<input/);
    expect(markup).toMatch(/<button/);
  });

  it("shows the value via formatDate in the field, not via Ark's own format", () => {
    const { markup } = renderRoot(<DatePicker label="L" value={TODAY} />);
    expect(markup).toContain(`value="${formatDate(TODAY)}"`);
  });

  it("writes invalid and disabled as data attributes on the root element", () => {
    expect(renderRoot(<DatePicker invalid label="L" />).attrs["data-invalid"]).toBe("");
    expect(renderRoot(<DatePicker disabled label="L" />).attrs["data-disabled"]).toBe("");
    expect(renderRoot(<DatePicker label="L" />).attrs).not.toHaveProperty("data-invalid");
  });

  it("passes the id through to the input", () => {
    const { markup } = renderRoot(<DatePicker id="maintenance" label="L" />);
    expect(markup).toMatch(/<input[^>]*id="maintenance"/);
  });

  it("writes the field in the given locale", () => {
    const { markup } = renderRoot(<DatePicker label="L" locale="de-DE" value={TODAY} />);
    expect(markup).toContain('value="10.09.2026"');
  });

  describe("placeholder pattern", () => {
    function placeholderOf(markup: string): string | undefined {
      return markup.match(/<input[^>]*placeholder="([^"]*)"/)?.[1];
    }

    it("shows TT.MM.JJJJ in a German field", () => {
      const { markup } = renderRoot(<DatePicker label="L" locale="de-DE" />);
      expect(placeholderOf(markup)).toBe("TT.MM.JJJJ");
    });

    it("keeps Ark's pattern in an English field", () => {
      const { markup } = renderRoot(<DatePicker label="L" locale="en-GB" />);
      expect(placeholderOf(markup)).toBe("dd/mm/yyyy");
    });

    it("shows a custom pattern", () => {
      const { markup } = renderRoot(
        <DatePicker label="L" locale="de-DE" placeholder="DD.MM.YYYY" />,
      );
      expect(placeholderOf(markup)).toBe("DD.MM.YYYY");
    });
  });

  describe("typing a date", () => {
    afterEach(cleanup);

    async function typed(locale: string, text: string) {
      const onValueChange = vi.fn();
      render(<DatePicker label="Date" locale={locale} onValueChange={onValueChange} />);
      const input = screen.getByLabelText("Date");
      fireEvent.change(input, { target: { value: text } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
      await waitFor(() => expect(onValueChange).toHaveBeenCalled());
      return onValueChange;
    }

    /** The date the field reported last. */
    function lastDate(calls: unknown[][]): Date {
      const value = calls.at(-1)?.[0];
      if (!(value instanceof Date)) throw new Error("onValueChange was not called with a Date");
      return value;
    }

    it("reads day first in a German field", async () => {
      const onValueChange = await typed("de-DE", "05.10.2026");
      const date = lastDate(onValueChange.mock.calls);
      expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 5]);
    });

    it("reads a typed date in a German field with the German pattern", async () => {
      const onValueChange = await typed("de-DE", "24.12.2026");
      const date = lastDate(onValueChange.mock.calls);
      expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 11, 24]);
    });

    it("reads month first in an American field", async () => {
      const onValueChange = await typed("en-US", "10/05/2026");
      const date = lastDate(onValueChange.mock.calls);
      expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 5]);
    });
  });

  it("names months and weekdays in the given locale", async () => {
    render(<DatePicker label="Date" locale="de-DE" value={TODAY} />);
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText("Mo")).not.toBeNull();
  });
});
