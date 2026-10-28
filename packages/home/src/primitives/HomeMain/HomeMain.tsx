import { ScrollArea } from "@odinscode/carbide-core";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./HomeMain.module.css";

export interface HomeMainProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children?: ReactNode | undefined;
}

export function HomeMain({ children, ...rest }: HomeMainProps) {
  return (
    <main {...rest} className={styles.root}>
      <ScrollArea className={styles.scroll}>
        <div className={styles.content}>{children}</div>
      </ScrollArea>
    </main>
  );
}
