import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment, useLayoutEffect, useRef } from "react";
import "../tokens.css";
import styles from "./Density.module.css";

const DENSITIES = ["compact", "dense", "large"] as const;

const TOKENS = [
  "--carbide-font-body",
  "--carbide-fs-body",
  "--carbide-tracking-body",
  "--carbide-control-h",
  "--carbide-row-h",
  "--carbide-gutter",
  "--carbide-touch-min",
  "--carbide-radius",
];

const ROWS = [
  { plant: "Boiler House 3", value: "82.4 °C" },
  { plant: "Supply North", value: "71.0 °C" },
  { plant: "Return North", value: "54.6 °C" },
  { plant: "Pump P-12", value: "1,240 min⁻¹" },
];

function Value({ token }: { token: string }) {
  const fieldRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = fieldRef.current;
    if (element === null) {
      throw new Error(`The field for ${token} is not in the document.`);
    }
    element.textContent = getComputedStyle(element).getPropertyValue(token).trim();
  }, [token]);

  return <span className={styles.value} ref={fieldRef} />;
}

function DensitySet({ density }: { density: (typeof DENSITIES)[number] }) {
  return (
    <section className={styles.set} data-density={density}>
      <h2 className={styles.title}>data-density="{density}"</h2>

      <div className={styles.table}>
        {TOKENS.map((token) => (
          <Fragment key={token}>
            <span className={styles.name}>{token}</span>
            <Value token={token} />
          </Fragment>
        ))}
      </div>

      <div className={styles.sample}>
        <div className={styles.bar}>
          <input aria-label={`Setpoint ${density}`} className={styles.field} defaultValue="82.4" />
          <button className={styles.button} type="button">
            Acknowledge
          </button>
        </div>

        <ul className={styles.list}>
          {ROWS.map(({ plant, value }) => (
            <li className={styles.row} key={plant}>
              <span>{plant}</span>
              <span className={styles.measurement}>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Density() {
  return (
    <div className={styles.sheet}>
      <p className={styles.hint}>
        The same building blocks at three densities. Height, spacing, font size and tracking come
        from the tokens &mdash; no fixed pixel value, no media query. Without the attribute, compact
        applies.
      </p>
      <div className={styles.sets}>
        {DENSITIES.map((density) => (
          <DensitySet density={density} key={density} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof Density> = {
  title: "Tokens/Density",
  component: Density,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Density>;

export const Default: Story = {};
