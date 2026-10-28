import { ScrollArea as Ark } from "@ark-ui/react/scroll-area";
import { type HTMLAttributes, type Ref, useCallback, useEffect, useRef, useState } from "react";
import styles from "./ScrollArea.module.css";

export type ScrollAreaAxis = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  axis?: ScrollAreaAxis | undefined;

  disabled?: boolean | undefined;

  ref?: Ref<HTMLDivElement> | undefined;
}

interface Overflow {
  x: boolean;
  y: boolean;
}

const NO_OVERFLOW: Overflow = { x: false, y: false };

/**
 * Whether the viewport actually has something to scroll, measured
 * ourselves instead of trusting zag-js's `hiddenState`: that state's
 * `scrollbarYHidden`/`scrollbarXHidden` can stay stuck at their `false`
 * default even once content fits, which showed a hover thumb with
 * nothing to scroll.
 */
function useOverflow(disabled: boolean): [Overflow, (node: HTMLDivElement | null) => void] {
  const [overflow, setOverflow] = useState<Overflow>(NO_OVERFLOW);
  const observerRef = useRef<ResizeObserver | null>(null);

  const attach = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (node === null || disabled) {
        setOverflow(NO_OVERFLOW);
        return;
      }

      const measure = () => {
        setOverflow({
          x: node.scrollWidth > node.clientWidth,
          y: node.scrollHeight > node.clientHeight,
        });
      };
      measure();

      const observer = new ResizeObserver(measure);
      observer.observe(node);
      observerRef.current = observer;
    },
    [disabled],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return [overflow, attach];
}

export function ScrollArea({
  axis = "vertical",
  disabled = false,
  children,
  className,
  id,
  ref,
  ...rest
}: ScrollAreaProps) {
  const rootClassName = className === undefined ? styles.root : `${styles.root} ${className}`;
  const [overflow, attachOverflowObserver] = useOverflow(disabled);

  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      attachOverflowObserver(node);
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [attachOverflowObserver, ref],
  );

  if (disabled) {
    return (
      <div {...rest} className={rootClassName} data-axis={axis} data-disabled="" id={id}>
        <div className={styles.viewport} ref={ref}>
          {children}
        </div>
      </div>
    );
  }

  const showsVertical = axis === "vertical" || axis === "both";
  const showsHorizontal = axis === "horizontal" || axis === "both";

  return (
    <Ark.Root
      {...rest}
      {...(id === undefined ? {} : { ids: { root: id } })}
      className={rootClassName}
      data-axis={axis}
    >
      <Ark.Viewport className={styles.viewport} ref={setViewportRef}>
        {/* zag gives the content min-width: fit-content, which horizontal
            scrolling needs. Without that axis a wide child (a long code line)
            would stretch the content past the viewport and get cut off, so
            the content stays exactly as wide as the viewport (#469). */}
        <Ark.Content style={showsHorizontal ? undefined : { minWidth: 0 }}>{children}</Ark.Content>
      </Ark.Viewport>
      {showsVertical && (
        <Ark.Scrollbar
          className={styles.scrollbarVertical}
          orientation="vertical"
          data-has-overflow={overflow.y ? "" : undefined}
        >
          <Ark.Thumb className={styles.thumbVertical} />
        </Ark.Scrollbar>
      )}
      {showsHorizontal && (
        <Ark.Scrollbar
          className={styles.scrollbarHorizontal}
          orientation="horizontal"
          data-has-overflow={overflow.x ? "" : undefined}
        >
          <Ark.Thumb className={styles.thumbHorizontal} />
        </Ark.Scrollbar>
      )}
    </Ark.Root>
  );
}
