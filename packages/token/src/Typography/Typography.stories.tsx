import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment, useLayoutEffect, useRef } from "react";
import "../tokens.css";
import styles from "./Typography.module.css";

const SANS_WEIGHTS = [
  { value: 300, name: "Light" },
  { value: 400, name: "Regular" },
  { value: 500, name: "Medium" },
  { value: 600, name: "SemiBold" },
  { value: 700, name: "Bold" },
];

const DISPLAY_WEIGHTS = [
  { value: 300, name: "Light" },
  { value: 400, name: "Regular" },
  { value: 500, name: "Medium" },
  { value: 600, name: "SemiBold" },
  { value: 700, name: "Bold" },
  { value: 800, name: "ExtraBold" },
  { value: 900, name: "Black" },
];

const MONO_WEIGHTS = [
  { value: 100, name: "Thin" },
  { value: 200, name: "ExtraLight" },
  { value: 300, name: "Light" },
  { value: 400, name: "Regular" },
  { value: 500, name: "Medium" },
  { value: 600, name: "SemiBold" },
  { value: 800, name: "ExtraBold" },
];

const SAMPLE = "Boiler House 3 - Supply 82.4 °C";

const SIZES = [
  { token: "--carbide-fs-display", tracking: "--carbide-tracking-display" },
  { token: "--carbide-fs-h1", tracking: "--carbide-tracking-display" },
  { token: "--carbide-fs-h2", tracking: "--carbide-tracking-heading" },
  { token: "--carbide-fs-h3", tracking: "--carbide-tracking-heading" },
  { token: "--carbide-fs-lead", tracking: "--carbide-tracking-body" },
  { token: "--carbide-fs-body", tracking: "--carbide-tracking-small" },
  { token: "--carbide-fs-small", tracking: "--carbide-tracking-small" },
  { token: "--carbide-fs-label", tracking: "--carbide-tracking-label" },
];

const TRACKINGS = [
  { token: "--carbide-tracking-display", appliesTo: "Display from 32 px" },
  { token: "--carbide-tracking-heading", appliesTo: "Headings 20 to 31 px" },
  { token: "--carbide-tracking-body", appliesTo: "Body text 15 to 19 px" },
  { token: "--carbide-tracking-small", appliesTo: "Text 13 to 14 px, tables" },
  { token: "--carbide-tracking-label", appliesTo: "Labels 11 to 12 px, table headers" },
  { token: "--carbide-tracking-caps", appliesTo: "Small caps, eyebrows, chips" },
  {
    token: "--carbide-tracking-dense",
    appliesTo: "Extra tracking in density dense for roles under 16 px",
  },
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

  return <span className={styles.name} ref={fieldRef} />;
}

function Typography() {
  return (
    <div className={styles.sheet}>
      <section className={styles.panel}>
        <h2 className={styles.title}>Carbide Sans: five weights</h2>
        <p className={styles.hint}>
          Red Hat Text as a variable font, only on the wght axis (300 to 700) &mdash; unlike Plex
          before it, this font has no width axis. Density has run on font size and tracking since
          Ticket #83, no longer on width: see Tokens/Density.
        </p>
        <div className={`${styles.grid} ${styles.weights}`}>
          <span className={styles.head}>Weight</span>
          <span className={styles.head}>Sample</span>
          {SANS_WEIGHTS.map(({ value, name }) => (
            <Fragment key={value}>
              <span className={styles.name}>
                {value} {name}
              </span>
              <span style={{ fontWeight: value }}>{SAMPLE}</span>
            </Fragment>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.title}>Carbide Display: seven weights, headings only</h2>
        <p className={styles.hint}>
          Red Hat Display, its own third family since Ticket #84 (wght 300 to 900) via{" "}
          <code className={styles.name}>--carbide-font-display</code>. Not for body text or UI
          chrome — that stays Carbide Sans.
        </p>
        <div className={`${styles.grid} ${styles.weights}`}>
          <span className={styles.head}>Weight</span>
          <span className={styles.head}>Sample</span>
          {DISPLAY_WEIGHTS.map(({ value, name }) => (
            <Fragment key={value}>
              <span className={styles.name}>
                {value} {name}
              </span>
              <span className={styles.display} style={{ fontWeight: value }}>
                {SAMPLE}
              </span>
            </Fragment>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.title}>Carbide Mono: the slashed zero</h2>
        <p className={styles.hint}>
          The zero is baked in, not switched via CSS: U+0030 points at the slashed glyph. There is
          no <code className={styles.name}>font-variant-numeric</code> here. The zero must be
          slashed and the O round. Seven cuts, up to 800 instead of 700 since Ticket #82.
        </p>
        <div className={`${styles.grid} ${styles.weightsMono}`}>
          <span className={styles.head}>Weight</span>
          <span className={styles.head}>0O 0123456789</span>
          <span className={styles.head}>Measurement</span>
          {MONO_WEIGHTS.map(({ value, name }) => (
            <Fragment key={value}>
              <span className={styles.name}>
                {value} {name}
              </span>
              <span className={`${styles.mono} ${styles.zero}`} style={{ fontWeight: value }}>
                0O 0123456789
              </span>
              <span className={styles.mono} style={{ fontWeight: value }}>
                1,024.50 kWh
              </span>
            </Fragment>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.title}>Sizes with their tracking</h2>
        <p className={styles.hint}>
          <code className={styles.name}>--carbide-fs-body</code> follows density and comes from
          <code className={styles.name}>density.css</code>; this sheet stays at the default
          <code className={styles.name}>compact</code>. Tokens/Density shows all three sets.
        </p>
        <div className={`${styles.grid} ${styles.sizes}`}>
          {SIZES.map(({ token, tracking }) => (
            <Fragment key={token}>
              <span className={styles.name}>{token}</span>
              <Value token={token} />
              <span
                style={{
                  fontFamily:
                    token.startsWith("--carbide-fs-h") || token === "--carbide-fs-display"
                      ? "var(--carbide-font-display)"
                      : undefined,
                  fontSize: `var(${token})`,
                  letterSpacing: `var(${tracking})`,
                  fontWeight: token.startsWith("--carbide-fs-h") ? 600 : 400,
                }}
              >
                Control room
              </span>
            </Fragment>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.title}>Tracking</h2>
        <p className={styles.hint}>
          Large sizes tighten, small ones open up. Mono gets no tracking, otherwise the digits jump
          out of the grid.
        </p>
        <div className={`${styles.grid} ${styles.sizes}`}>
          {TRACKINGS.map(({ token, appliesTo }) => (
            <Fragment key={token}>
              <span className={styles.name}>{token}</span>
              <Value token={token} />
              <span style={{ letterSpacing: `var(${token})` }}>{appliesTo}</span>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof Typography> = {
  title: "Tokens/Typography",
  component: Typography,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {};
