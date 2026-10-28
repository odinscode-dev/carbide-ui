import { Accordion as Ark } from "@ark-ui/react/accordion";
import type { HTMLAttributes, ReactNode } from "react";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Accordion.module.css";

export interface AccordionItemSpec {
  value: string;
  title: string;

  extra?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> {
  items: AccordionItemSpec[];

  value?: string[] | undefined;
  onValueChange?: ((value: string[]) => void) | undefined;

  multiple?: boolean | undefined;
  id?: string | undefined;
}

export function Accordion({
  items,
  value,
  onValueChange,
  multiple = false,
  id,
  className,
  ...rest
}: AccordionProps) {
  return (
    <Ark.Root
      {...rest}
      className={joinClassNames(styles.root, className)}
      collapsible
      ids={id === undefined ? undefined : { root: id }}
      multiple={multiple}
      onValueChange={(details) => onValueChange?.(details.value)}
      value={value}
    >
      {items.map((item) => (
        <Ark.Item
          className={styles.item}
          disabled={item.disabled}
          key={item.value}
          value={item.value}
        >
          <Ark.ItemTrigger className={styles.trigger}>
            <Ark.ItemIndicator className={styles.indicator}>
              <ChevronIcon />
            </Ark.ItemIndicator>
            <span className={styles.title}>{item.title}</span>
            {item.extra !== undefined && <span className={styles.extra}>{item.extra}</span>}
          </Ark.ItemTrigger>
          <Ark.ItemContent className={styles.content}>{item.content}</Ark.ItemContent>
        </Ark.Item>
      ))}
    </Ark.Root>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className={styles.chevron} fill="none" viewBox="0 0 16 16">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
