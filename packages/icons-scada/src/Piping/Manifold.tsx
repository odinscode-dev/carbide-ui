import { Pipe, SymbolSvg } from "../symbol/Symbol.js";
import styles from "../symbol/Symbol.module.css";

export type ManifoldOutlets = 2 | 4 | 6 | 8;

const OUTLET_X: Record<ManifoldOutlets, readonly number[]> = {
  2: [24, 72],
  4: [12, 36, 60, 84],
  6: [18, 30, 42, 54, 66, 78],
  8: [6, 18, 30, 42, 54, 66, 78, 90],
};

/**
 * Manifold: inlet N into a distributor block, outlets down to S. The inlet sits
 * on the module's centre line (x = 48), exactly between the two middle outlets,
 * so a tank above feeds it straight. A pipe, dripper or nozzle docks on an
 * outlet when its centre line (x = 48) is moved to the outlet's x; that needs a
 * 12 px drawing grid (6 px for the 8 outlets).
 */
export function Manifold({ outlets }: { outlets: ManifoldOutlets }) {
  const xs = OUTLET_X[outlets];
  const first = (xs[0] ?? 0) - 3;
  const last = (xs[xs.length - 1] ?? 0) + 3;

  return (
    <SymbolSvg label={`Manifold, ${outlets} outlets`}>
      <Pipe d="M48,0 V40" />
      {xs.map((x) => (
        <Pipe d={`M${x},56 V96`} key={x} />
      ))}
      <rect className={styles.body} height="16" width={last - first} x={first} y="40" />
    </SymbolSvg>
  );
}
