import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment, useLayoutEffect, useRef } from "react";
import "../tokens.css";
import styles from "./Ramps.module.css";

const THEMES = ["light", "dark"] as const;
const HUES = ["red", "orange", "yellow", "green", "teal", "blue-1", "blue-2", "purple", "pink"];
const STEPS = [300, 400, 500, 600, 700, 800, 900];

function Step({ token }: { token: string }) {
  const fieldRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = fieldRef.current;
    if (element === null) {
      throw new Error(`The field for ${token} is not in the document.`);
    }
    element.textContent = getComputedStyle(element).getPropertyValue(token).trim();
  }, [token]);

  return (
    <span className={styles.cell}>
      <span className={styles.swatch} style={{ background: `var(${token})` }} />
      <span className={styles.value} ref={fieldRef} />
    </span>
  );
}

function Theme({ theme }: { theme: (typeof THEMES)[number] }) {
  return (
    <section className={styles.theme} data-theme={theme}>
      <h2 className={styles.title}>data-theme="{theme}"</h2>
      <div className={styles.grid}>
        <span />
        {STEPS.map((step) => (
          <span className={styles.head} key={step}>
            {step}
          </span>
        ))}
        {HUES.map((hue) => (
          <Fragment key={hue}>
            <span className={styles.hue}>{hue}</span>
            {STEPS.map((step) => (
              <Step key={step} token={`--carbide-${hue}-${step}`} />
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function Ramps() {
  return (
    <div className={styles.sheet}>
      <p className={styles.hint}>
        Nine tonal ramps, seven steps, values from Cloudscape&apos;s system palette. The step is a
        lightness: 300 is the lightest, 900 the darkest, 600 is the hue&apos;s main color. The same
        values serve both themes &mdash; a light surface reads 600, a dark one 400 or 500; which
        step, the roles decide. Ramps are primitives: components only reach for the roles.
      </p>
      <div className={styles.themes}>
        {THEMES.map((theme) => (
          <Theme key={theme} theme={theme} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof Ramps> = {
  title: "Tokens/Ramps",
  component: Ramps,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Ramps>;

export const Default: Story = {};
