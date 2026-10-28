import { useId } from "react";
import styles from "./Symbol.module.css";

export interface VesselBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Body fill and fill level of a vessel: the fill area grows from the bottom of
 * `box` and is clipped to the silhouette `d`. The clip sits on a `<g>`, not on
 * a nested `<svg>`: Chromium ignores `clip-path` on an inner `<svg>`. The
 * caller draws the contour after it.
 */
export function VesselFill({
  d,
  box,
  level,
}: {
  d: string;
  box: VesselBox;
  /** Percent, held to 0..100. */
  level: number;
}) {
  const clipId = useId();
  const held = Math.min(Math.max(Number.isFinite(level) ? level : 0, 0), 100);
  const height = (box.height * held) / 100;

  return (
    <>
      <path className={styles.bodyFill} d={d} />
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect
          className={styles.level}
          height={height}
          width={box.width}
          x={box.x}
          y={box.y + box.height - height}
        />
      </g>
    </>
  );
}
