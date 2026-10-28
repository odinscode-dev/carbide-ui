import { Pagination as Ark } from "@ark-ui/react/pagination";
import { useMemo } from "react";
import { formatNumber } from "../format/number.js";
import { t } from "../i18n/t.js";
import { Select } from "../Select/Select.js";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  page: number;
  pageSize: number;

  total: number;

  pageSizes?: readonly number[] | undefined;
  onPageChange?: ((page: number) => void) | undefined;
  onPageSizeChange?: ((pageSize: number) => void) | undefined;
  disabled?: boolean | undefined;

  pageSizeLabel?: string | undefined;

  rangeText?: ((details: { start: number; end: number; total: number }) => string) | undefined;
}

const PAGE_SIZES = [10, 25, 50, 100] as const;

export function Pagination({
  page,
  pageSize,
  total,
  pageSizes = PAGE_SIZES,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  pageSizeLabel,
  rangeText,
}: PaginationProps) {
  const lockProps = disabled ? { disabled: true } : {};

  const sizes = useMemo(
    () => pageSizes.map((size) => ({ value: `${size}`, label: formatNumber(size) })),
    [pageSizes],
  );

  return (
    <Ark.Root
      className={styles.root}
      count={total}
      data-disabled={disabled ? "" : undefined}
      onPageChange={(details) => onPageChange?.(details.page)}
      page={page}
      pageSize={pageSize}
      translations={{
        rootLabel: t("pagination.root"),
        prevTriggerLabel: t("pagination.previous"),
        nextTriggerLabel: t("pagination.next"),
        itemLabel: (details) => t("pagination.page", { page: formatNumber(details.page) }),
      }}
    >
      <Select
        disabled={disabled}
        items={sizes}
        label={pageSizeLabel ?? t("pagination.pageSize")}
        onValueChange={(value) => onPageSizeChange?.(Number(value))}
        value={`${pageSize}`}
      />
      <Ark.Context>
        {(api) => (
          <span className={styles.range}>
            {range(api.pageRange.start + 1, api.pageRange.end, total, rangeText)}
          </span>
        )}
      </Ark.Context>
      <div className={styles.pages}>
        <Ark.PrevTrigger className={styles.trigger} {...lockProps}>
          <Chevron direction="prev" />
        </Ark.PrevTrigger>
        <Ark.Context>
          {(api) =>
            api.pages.map((entry, position) => {
              if (entry.type === "page") {
                return (
                  <Ark.Item
                    className={styles.item}
                    key={`page-${entry.value}`}
                    type="page"
                    value={entry.value}
                    {...lockProps}
                  >
                    {formatNumber(entry.value)}
                  </Ark.Item>
                );
              }

              const previousEntry = api.pages[position - 1];
              return (
                <Ark.Ellipsis
                  className={styles.ellipsis}
                  index={position}
                  key={`ellipsis-${previousEntry?.type === "page" ? previousEntry.value : 0}`}
                >
                  &hellip;
                </Ark.Ellipsis>
              );
            })
          }
        </Ark.Context>
        <Ark.NextTrigger className={styles.trigger} {...lockProps}>
          <Chevron direction="next" />
        </Ark.NextTrigger>
      </div>
    </Ark.Root>
  );
}

function range(
  start: number,
  end: number,
  total: number,
  custom: PaginationProps["rangeText"],
): string {
  if (custom !== undefined) {
    return custom({ start, end, total });
  }
  return t("pagination.range", {
    start: formatNumber(start),
    end: formatNumber(end),
    total: formatNumber(total),
  });
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" className={styles.glyph} fill="none" viewBox="0 0 16 16">
      <path
        d={direction === "prev" ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"}
        stroke="currentcolor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
