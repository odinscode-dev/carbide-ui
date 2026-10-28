import { describe, expect, it } from "vitest";
import { renderRoot } from "../test/render.js";
import { StructuredList } from "./StructuredList.js";

const COLUMNS = [
  { key: "name", header: "Pump" },
  { key: "state", header: "State" },
];

const ROWS = [
  { value: "p1", cells: { name: "Pump P-1", state: "Running" } },
  { value: "p2", cells: { name: "Pump P-2", state: "Standby" } },
];

describe("StructuredList", () => {
  it("renders a table, without data-selectable", () => {
    const { tag, attrs } = renderRoot(<StructuredList columns={COLUMNS} rows={ROWS} />);
    expect(tag).toBe("table");
    expect(attrs).not.toHaveProperty("data-selectable");
  });

  it("renders a header row when a column has a header", () => {
    const { markup } = renderRoot(<StructuredList columns={COLUMNS} rows={ROWS} />);
    expect(markup.match(/<th\b/g)).toHaveLength(2);
    expect(markup).toContain(">Pump<");
  });

  it("leaves out the header row when no column has a header", () => {
    const { markup } = renderRoot(
      <StructuredList columns={COLUMNS.map(({ key }) => ({ key }))} rows={ROWS} />,
    );
    expect(markup).not.toContain("<thead");
    expect(markup).not.toContain("<th");
  });

  it("renders every row with its cells, without a radio", () => {
    const { markup } = renderRoot(<StructuredList columns={COLUMNS} rows={ROWS} />);
    expect(markup.match(/<tr\b/g)).toHaveLength(3);
    expect(markup).toContain("Pump P-1");
    expect(markup).toContain("Pump P-2");
    expect(markup).not.toContain('type="radio"');
  });

  it("gives selectable a radio per row, controlled via value", () => {
    const { attrs, markup } = renderRoot(
      <StructuredList columns={COLUMNS} rows={ROWS} selectable value="p1" />,
    );
    expect(attrs["data-selectable"]).toBe("");
    expect(markup.match(/type="radio"/g)).toHaveLength(2);
    expect(markup).toContain('checked=""');
    expect(markup).toMatch(/<input[^>]*value="p1"/);
    expect(markup).toContain('data-state="checked"');
    expect(markup).toContain('data-state="unchecked"');
  });

  it("marks a disabled row with data-disabled and a disabled radio", () => {
    const { markup } = renderRoot(
      <StructuredList
        columns={COLUMNS}
        rows={[{ value: "p3", disabled: true, cells: { name: "Pump P-3", state: "—" } }]}
        selectable
      />,
    );
    expect(markup).toContain("data-disabled");
    expect(markup).toMatch(/<input[^>]*disabled=""[^>]*value="p3"/);
  });

  it("gives all radios the same name so they form a group", () => {
    const { markup } = renderRoot(<StructuredList columns={COLUMNS} rows={ROWS} selectable />);
    const names = [...markup.matchAll(/name="([^"]*)"/g)].map((match) => match[1]);
    expect(names).toHaveLength(2);
    expect(new Set(names).size).toBe(1);
  });
});
