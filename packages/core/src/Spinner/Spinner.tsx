import type { SVGAttributes } from "react";
import styles from "./Spinner.module.css";

export type SpinnerProps = SVGAttributes<SVGSVGElement>;

export function Spinner(props: SpinnerProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentcolor"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      width="1em"
      {...props}
    >
      <circle className={styles.track} cx="8" cy="8" r="6.5" />
      <circle className={styles.head} cx="8" cy="8" r="6.5" />
    </svg>
  );
}
