import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { Accordion, type AccordionItemSpec } from "./Accordion.js";

const ITEMS: AccordionItemSpec[] = [
  { value: "a", title: "Section A", content: "Content A" },
  { value: "b", title: "Section B", content: "Content B" },
];

describe("Accordion", () => {
  it("renders a div with one row per item", () => {
    const { tag, markup } = renderRoot(<Accordion items={ITEMS} />);
    expect(tag).toBe("div");
    expect(markup).toContain("Section A");
    expect(markup).toContain("Section B");
    expect(markup).toContain("Content A");
  });

  it("opens only the supplied values, the rest stays closed", () => {
    const { markup } = renderRoot(<Accordion items={ITEMS} value={["a"]} />);
    expect(markup).toMatch(/data-state="open"[^>]*id="collapsible:[^"]*:item:a"/);
    expect(markup).toMatch(/data-state="closed"[^>]*id="collapsible:[^"]*:item:b"/);
  });

  it("shows a disabled section as data-disabled on the title", () => {
    const { markup } = renderRoot(
      <Accordion items={[{ value: "a", title: "A", disabled: true, content: "x" }]} />,
    );
    expect(markup).toMatch(/data-disabled=""[^>]*>.*A/);
  });

  it("shows the extra info next to the title when set", () => {
    const { markup } = renderRoot(
      <Accordion items={[{ value: "a", title: "A", extra: "3 alarms", content: "x" }]} />,
    );
    expect(markup).toContain("3 alarms");
  });

  it("passes native attributes through", () => {
    expect(renderRoot(<Accordion id="panels" items={ITEMS} />).attrs.id).toBe("panels");
  });
});
