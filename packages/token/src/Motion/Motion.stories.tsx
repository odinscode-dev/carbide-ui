import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import "../tokens.css";
import styles from "./Motion.module.css";

const DURATIONS = [
  { token: "--carbide-duration-fast-1", usage: "Hover, focus, toggle" },
  { token: "--carbide-duration-fast-2", usage: "Tooltip, small fade in/out" },
  { token: "--carbide-duration-moderate-1", usage: "Dropdown, popover" },
  { token: "--carbide-duration-moderate-2", usage: "Measurement change, dialog, drawer" },
  { token: "--carbide-duration-slow-1", usage: "large surfaces" },
  { token: "--carbide-duration-slow-2", usage: "reserve, rare" },
];

const CURVES = [
  { token: "--carbide-ease-standard", usage: "change in place" },
  { token: "--carbide-ease-entrance", usage: "appears" },
  { token: "--carbide-ease-exit", usage: "disappears" },
];

const LEVELS = [62, 18, 94, 47, 73, 8];

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

function Panel({ title, rows }: { title: string; rows: typeof DURATIONS }) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.table}>
        {rows.map(({ token, usage }) => (
          <Fragment key={token}>
            <span className={styles.name}>{token}</span>
            <Value token={token} />
            <span className={styles.usage}>{usage}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function Motion() {
  const [step, setStep] = useState(0);
  const level = LEVELS[step % LEVELS.length];
  const measurementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = measurementRef.current;
    if (element === null) {
      throw new Error("The measurement is not in the document.");
    }
    element.style.setProperty("--level", String(level));
  }, [level]);

  return (
    <div className={styles.sheet}>
      <Panel rows={DURATIONS} title="Durations" />
      <Panel rows={CURVES} title="Curves" />

      <section className={styles.panel}>
        <h2 className={styles.title}>A measurement moves</h2>
        <p className={styles.hint}>
          Number and fill move over --carbide-duration-moderate-2 with --carbide-ease-standard from
          the old to the new value. No overshoot, no blink. Whoever advances again mid-motion sees
          it continue from the current in-between value.
        </p>

        <div className={styles.measurement} ref={measurementRef}>
          <span className={styles.number} />
          <span className={styles.unit}>%</span>
          <div className={styles.bar}>
            <div className={styles.fill} />
          </div>
        </div>

        <button className={styles.button} onClick={() => setStep(step + 1)} type="button">
          Next measurement
        </button>
      </section>
    </div>
  );
}

const meta: Meta<typeof Motion> = {
  title: "Tokens/Motion",
  component: Motion,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Motion>;

export const Default: Story = {};
