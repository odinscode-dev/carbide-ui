import { Pipe } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

/** Two triangles tip to tip with the ball between them; pipe stubs W and E. */
export function BallValveBody() {
  return (
    <>
      <Pipe d="M0,48 H30" />
      <Pipe d="M66,48 H96" />
      <path className={styles.body} d="M30,38 V58 L48,48 Z" />
      <path className={styles.body} d="M66,38 V58 L48,48 Z" />
      <circle className={styles.body} cx="48" cy="48" r="6" />
    </>
  );
}
