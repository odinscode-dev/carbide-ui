// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { must } from "../test/dom.js";
import { renderRoot } from "../test/render.js";
import {
  AttributeEditor,
  type AttributeEditorColumn,
  type AttributeEditorItem,
} from "./AttributeEditor.js";

const COLUMNS: readonly AttributeEditorColumn[] = [
  { key: "key", label: "Key", render: (item) => <span>{String(item.key)}</span> },
  { key: "value", label: "Value", render: (item) => <span>{String(item.value)}</span> },
];

const ROWS: readonly AttributeEditorItem[] = [
  { key: "Line", value: "L-04" },
  { key: "Zone", value: "Packaging" },
];

describe("AttributeEditor", () => {
  it("renders a header row with the column labels and one row per entry", () => {
    const { markup } = renderRoot(
      <AttributeEditor definition={COLUMNS} items={ROWS} onItemsChange={vi.fn()} />,
    );
    expect(markup).toContain("Key");
    expect(markup).toContain("Value");
    expect(markup).toContain("Line");
    expect(markup).toContain("L-04");
    expect(markup).toContain("Zone");
    expect(markup).toContain("Packaging");
  });

  it("empty: text instead of rows, data-empty on the root element", () => {
    const { attrs, markup } = renderRoot(
      <AttributeEditor definition={COLUMNS} items={[]} onItemsChange={vi.fn()} />,
    );
    expect(attrs["data-empty"]).toBe("");
    expect(markup).toContain("No entries");
  });

  it("populated: no data-empty on the root element", () => {
    const { attrs } = renderRoot(
      <AttributeEditor definition={COLUMNS} items={ROWS} onItemsChange={vi.fn()} />,
    );
    expect(attrs).not.toHaveProperty("data-empty");
  });

  it("a row with invalid carries data-invalid, others do not", () => {
    const items: AttributeEditorItem[] = [
      { key: "Line", value: "L-04" },
      { invalid: true, key: "", value: "" },
    ];
    const { container } = render(
      <AttributeEditor definition={COLUMNS} items={items} onItemsChange={vi.fn()} />,
    );
    expect(container.querySelectorAll("[data-invalid]")).toHaveLength(1);
    cleanup();
  });

  it("locked: data-disabled on the root element, Add and Remove are disabled", () => {
    render(<AttributeEditor definition={COLUMNS} disabled items={ROWS} onItemsChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add new item" }).hasAttribute("disabled")).toBe(
      true,
    );
    for (const button of screen.getAllByRole("button", { name: "Remove item" })) {
      expect(button.hasAttribute("disabled")).toBe(true);
    }
    cleanup();
  });

  it("limit reached: Add is disabled, Remove stays active", () => {
    render(<AttributeEditor definition={COLUMNS} items={ROWS} limit={2} onItemsChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add new item" }).hasAttribute("disabled")).toBe(
      true,
    );
    expect(
      screen.getAllByRole("button", { name: "Remove item" })[0]?.hasAttribute("disabled"),
    ).toBe(false);
    cleanup();
  });

  it("addText and removeText override the catalog texts", () => {
    render(
      <AttributeEditor
        addText="Add row"
        definition={COLUMNS}
        items={ROWS}
        onItemsChange={vi.fn()}
        removeText="Delete row"
      />,
    );
    expect(screen.getByRole("button", { name: "Add row" })).toBeDefined();
    expect(screen.getAllByRole("button", { name: "Delete row" })).toHaveLength(ROWS.length);
    cleanup();
  });
});

describe("AttributeEditor, adding and removing", () => {
  afterEach(cleanup);

  it("Add appends an empty entry with the column keys", () => {
    const onItemsChange = vi.fn();
    render(<AttributeEditor definition={COLUMNS} items={ROWS} onItemsChange={onItemsChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Add new item" }));
    expect(onItemsChange).toHaveBeenCalledWith([...ROWS, { key: "", value: "" }]);
  });

  it("Remove calls onItemsChange without the clicked row", () => {
    const onItemsChange = vi.fn();
    render(<AttributeEditor definition={COLUMNS} items={ROWS} onItemsChange={onItemsChange} />);
    fireEvent.click(must(screen.getAllByRole("button", { name: "Remove item" })[1]));
    expect(onItemsChange).toHaveBeenCalledWith([ROWS[0]]);
  });

  it("keeps a row's DOM identity stable when an earlier row is removed", () => {
    function Wrapper() {
      const [items, setItems] = useState<AttributeEditorItem[]>([
        { key: "Line", value: "L-04" },
        { key: "Zone", value: "Packaging" },
        { key: "Unit", value: "bar" },
      ]);
      return <AttributeEditor definition={COLUMNS} items={items} onItemsChange={setItems} />;
    }
    render(<Wrapper />);

    const zoneCellBefore = screen.getByText("Zone");
    fireEvent.click(must(screen.getAllByRole("button", { name: "Remove item" })[0]));

    expect(screen.getByText("Zone")).toBe(zoneCellBefore);
  });

  it("locked: no click on Add or Remove triggers onItemsChange", () => {
    const onItemsChange = vi.fn();
    render(
      <AttributeEditor definition={COLUMNS} disabled items={ROWS} onItemsChange={onItemsChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Add new item" }));
    fireEvent.click(must(screen.getAllByRole("button", { name: "Remove item" })[0]));
    expect(onItemsChange).not.toHaveBeenCalled();
  });
});
