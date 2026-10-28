import { ScrollArea } from "@odinscode/carbide-core";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ShellMain.module.css";

/**
 * `scroll`: the content flows and the main area scrolls as a whole.
 * `fill`: the content fills exactly the height of the main area and does not
 * scroll as a whole -- for floorplans with fixed bands and a content band that
 * takes the rest, whose own surfaces scroll.
 */
export type ShellMainLayout = "scroll" | "fill";

export interface ShellMainProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  layout?: ShellMainLayout | undefined;
  children?: ReactNode | undefined;
}

export function ShellMain({ layout = "scroll", children, ...rest }: ShellMainProps) {
  return (
    <main {...rest} className={styles.root} data-layout={layout}>
      {layout === "fill" ? (
        <div className={styles.content}>{children}</div>
      ) : (
        <ScrollArea className={styles.scroll}>
          <div className={styles.content}>{children}</div>
        </ScrollArea>
      )}
    </main>
  );
}
