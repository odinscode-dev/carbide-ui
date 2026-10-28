import type { HTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./List.module.css";

export interface ListItemSpec {
  content: ReactNode;

  items?: readonly ListItemSpec[] | undefined;
}

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  ordered?: boolean | undefined;
  items?: readonly ListItemSpec[] | undefined;
  children?: ReactNode;
}

export function List({ ordered = false, items, children, className, ...rest }: ListProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-ordered={ordered ? "" : undefined}
    >
      {items === undefined
        ? children
        : items
            .map((item, index) => ({ item, index }))
            .map(({ item, index }) => (
              <li className={styles.item} key={index}>
                {item.content}
                {item.items !== undefined && <List items={item.items} ordered={ordered} />}
              </li>
            ))}
    </Tag>
  );
}
