import type { CSSProperties, HTMLAttributes } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Timeline.module.css";

/** A stretch of the line: light on, a lockout. */
export interface TimelineRange {
  start: number;
  end: number;
  label: string;
  /** Any CSS colour; default the accent. */
  color?: string | undefined;
}

/** A moment on the line: a dose, an event. */
export interface TimelineMark {
  at: number;
  label: string;
  color?: string | undefined;
}

export interface TimelineTick {
  at: number;
  label: string;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the line for assistive tech; ranges and marks follow. */
  label: string;
  /** The ends of the line, in any unit (milliseconds, minutes of the day). */
  from: number;
  to: number;
  ranges?: readonly TimelineRange[] | undefined;
  marks?: readonly TimelineMark[] | undefined;
  /** Where now is; drawn as a bright line. */
  now?: number | undefined;
  /** Labels below the line. */
  ticks?: readonly TimelineTick[] | undefined;
}

// Position on the line in percent, clamped to its ends.
export function timelinePosition(value: number, from: number, to: number): number {
  if (to <= from) {
    return 0;
  }
  return ((Math.min(Math.max(value, from), to) - from) / (to - from)) * 100;
}

/** A stretch of time as a bar with coloured ranges, marks and now: the course of a day. */
export function Timeline({
  label,
  from,
  to,
  ranges = [],
  marks = [],
  now,
  ticks = [],
  className,
  ...rest
}: TimelineProps) {
  const at = (value: number): CSSProperties => ({
    insetInlineStart: `${timelinePosition(value, from, to)}%`,
  });
  const span = (range: TimelineRange): CSSProperties => {
    const start = timelinePosition(range.start, from, to);
    return {
      insetInlineStart: `${start}%`,
      inlineSize: `${timelinePosition(range.end, from, to) - start}%`,
      ...(range.color === undefined ? {} : { background: range.color }),
    };
  };
  const parts = [...ranges.map((range) => range.label), ...marks.map((mark) => mark.label)];
  return (
    <div {...rest} className={joinClassNames(styles.root, className)}>
      <div
        aria-label={parts.length === 0 ? label : `${label}. ${parts.join(", ")}`}
        className={styles.track}
        role="img"
      >
        {ranges.map((range) => (
          <span
            className={styles.range}
            key={`${range.label}-${range.start}`}
            style={span(range)}
            title={range.label}
          />
        ))}
        {marks.map((mark) => (
          <span
            className={styles.mark}
            key={`${mark.label}-${mark.at}`}
            style={{
              ...at(mark.at),
              ...(mark.color === undefined ? {} : { background: mark.color }),
            }}
            title={mark.label}
          />
        ))}
        {now === undefined ? null : (
          <span className={styles.now} style={at(now)} title={t("timeline.now")} />
        )}
      </div>
      {ticks.length === 0 ? null : (
        <div aria-hidden="true" className={styles.ticks}>
          {ticks.map((tick) => (
            <span
              className={styles.tick}
              data-edge={edge(timelinePosition(tick.at, from, to))}
              key={`${tick.label}-${tick.at}`}
              style={at(tick.at)}
            >
              {tick.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Labels at the ends stay inside the line instead of centring on their spot.
function edge(position: number): "start" | "end" | undefined {
  if (position <= 0) {
    return "start";
  }
  return position >= 100 ? "end" : undefined;
}
