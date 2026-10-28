import { type ReactNode, useRef } from "react";
import { Button } from "../Button/Button.js";
import { t } from "../i18n/t.js";
import styles from "./AttributeEditor.module.css";

export interface AttributeEditorItem {
  invalid?: boolean | undefined;
  [field: string]: unknown;
}

export interface AttributeEditorColumn {
  key: string;
  label: ReactNode;
  render: (item: AttributeEditorItem, index: number) => ReactNode;
}

export interface AttributeEditorProps {
  items: readonly AttributeEditorItem[];
  onItemsChange: (items: AttributeEditorItem[]) => void;
  definition: readonly AttributeEditorColumn[];

  addText?: string | undefined;

  removeText?: string | undefined;

  limit?: number | undefined;
  disabled?: boolean | undefined;
}

export function AttributeEditor({
  items,
  onItemsChange,
  definition,
  addText,
  removeText,
  limit,
  disabled = false,
}: AttributeEditorProps) {
  const limitReached = limit !== undefined && items.length >= limit;

  const rowKeys = useRef(new WeakMap<AttributeEditorItem, number>());
  const nextRowKey = useRef(0);
  const rowKey = (item: AttributeEditorItem): number => {
    let key = rowKeys.current.get(item);
    if (key === undefined) {
      key = nextRowKey.current++;
      rowKeys.current.set(item, key);
    }
    return key;
  };

  const addItem = () => {
    const emptyItem: AttributeEditorItem = {};
    for (const column of definition) {
      emptyItem[column.key] = "";
    }
    onItemsChange([...items, emptyItem]);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <div
      className={styles.root}
      data-disabled={disabled ? "" : undefined}
      data-empty={items.length === 0 ? "" : undefined}
    >
      {items.length === 0 ? (
        <p className={styles.empty}>{t("table.empty")}</p>
      ) : (
        <div className={styles.rows}>
          <div className={styles.headerRow}>
            {definition.map((column) => (
              <span className={styles.headerCell} key={column.key}>
                {column.label}
              </span>
            ))}
            <span className={styles.headerCell} />
          </div>
          {items
            .map((item, index) => ({ item, index }))
            .map(({ item, index }) => (
              <div
                className={styles.row}
                data-invalid={item.invalid === true ? "" : undefined}
                key={rowKey(item)}
              >
                {definition.map((column) => (
                  <div className={styles.cell} key={column.key}>
                    {column.render(item, index)}
                  </div>
                ))}
                <button
                  aria-label={removeText ?? t("attributeEditor.remove")}
                  className={styles.remove}
                  disabled={disabled}
                  onClick={() => removeItem(index)}
                  type="button"
                >
                  <Cross />
                </button>
              </div>
            ))}
        </div>
      )}
      <Button disabled={disabled || limitReached} onClick={addItem} variant="secondary">
        {addText ?? t("attributeEditor.add")}
      </Button>
    </div>
  );
}

function Cross() {
  return (
    <svg aria-hidden="true" className={styles.glyph} viewBox="0 0 16 16">
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
