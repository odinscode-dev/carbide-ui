import { Tabs as Ark } from "@ark-ui/react/tabs";
import type { ReactNode } from "react";
import { glassClassName, type Variant, variantAttribute } from "../glass/index.js";
import { ScrollArea } from "../ScrollArea/index.js";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;

  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
  content: ReactNode;
}

/**
 * How the tabs take up their space. `"flow"` (the default) is as tall as the
 * strip plus the selected panel. `"fill"` takes the height of its parent: the
 * strip stays put and the selected panel scrolls under it — for a page whose
 * tab content is longer than the screen (a floorplan's content band). In both,
 * the strip is at least `--carbide-tabs-list-size` tall when that is set (a
 * floorplan's tab band), with the triggers on its bottom rule.
 */
export type TabsLayout = "flow" | "fill";

export interface TabsProps {
  items: TabItem[];

  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  id?: string | undefined;

  /**
   * `"glass"` makes the tab strip a glass pane instead of a line of
   * triggers over a bottom rule: a framed, blurred sheet, for a page
   * whose other surfaces are panes too. Only the strip is a pane — the
   * panels below it stay transparent and sit on whatever the page puts
   * them on.
   */
  variant?: Variant | undefined;

  layout?: TabsLayout | undefined;
}

export function Tabs({
  items,
  value,
  onValueChange,
  id,
  variant = "default",
  layout = "flow",
}: TabsProps) {
  return (
    <Ark.Root
      className={styles.root}
      data-layout={layout}
      ids={id === undefined ? undefined : { root: id }}
      onValueChange={(details) => {
        if (details.value !== null) {
          onValueChange?.(details.value);
        }
      }}
      value={value}
    >
      <ScrollArea axis="horizontal">
        <Ark.List
          className={glassClassName(styles.list, variant)}
          data-variant={variantAttribute(variant)}
        >
          {items.map((item) => (
            <Ark.Trigger
              className={styles.trigger}
              disabled={item.disabled}
              key={item.value}
              value={item.value}
            >
              {item.icon !== undefined && <span className={styles.icon}>{item.icon}</span>}
              {item.label}
            </Ark.Trigger>
          ))}
          <Ark.Indicator className={styles.indicator} />
        </Ark.List>
      </ScrollArea>
      {items.map((item) => (
        <Ark.Content className={styles.content} key={item.value} value={item.value}>
          {layout === "fill" ? (
            <ScrollArea>
              <div className={styles.fillBody}>{item.content}</div>
            </ScrollArea>
          ) : (
            item.content
          )}
        </Ark.Content>
      ))}
    </Ark.Root>
  );
}
