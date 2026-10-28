import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment, useLayoutEffect, useRef } from "react";
import "../tokens.css";
import styles from "./Status.module.css";

const THEMES = ["light", "dark"] as const;

const STATUSES = [
  { name: "info", sample: "Backup running, 3 of 7 volumes" },
  { name: "success", sample: "Pump P-12 back in automatic" },
  { name: "warn", sample: "Certificate expires in 12 days" },
  { name: "critical", sample: "Supply North above limit, 91.4 °C" },
  { name: "error", sample: "Connection to Boiler House 3 lost" },
];

const ROLES = ["bg", "border", "text"] as const;

function Values({ name }: { name: string }) {
  const fieldsRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = fieldsRef.current;
    if (element === null) {
      throw new Error(`The values for ${name} are not in the document.`);
    }
    const card = element.parentElement;
    if (card === null) {
      throw new Error(`The card for ${name} is missing.`);
    }
    const style = getComputedStyle(card);
    const resolved = {
      bg: style.backgroundColor,
      border: style.borderTopColor,
      text: style.color,
    };
    for (const field of element.querySelectorAll<HTMLElement>("[data-role]")) {
      const role = field.dataset.role;
      if (role === "bg" || role === "border" || role === "text") {
        field.textContent = resolved[role];
      }
    }
  }, [name]);

  return (
    <span className={styles.values} ref={fieldsRef}>
      {ROLES.map((role) => (
        <Fragment key={role}>
          <span className={styles.role}>
            --carbide-status-{name}-{role}
          </span>
          <span data-role={role} />
        </Fragment>
      ))}
    </span>
  );
}

function Card({ name, sample }: { name: string; sample: string }) {
  return (
    <div
      className={styles.card}
      style={{
        background: `var(--carbide-status-${name}-bg)`,
        borderColor: `var(--carbide-status-${name}-border)`,
        color: `var(--carbide-status-${name}-text)`,
      }}
    >
      <span className={styles.name}>{name}</span>
      <span className={styles.sample}>{sample}</span>
      <Values name={name} />
    </div>
  );
}

function Theme({ theme }: { theme: (typeof THEMES)[number] }) {
  return (
    <section className={styles.theme} data-theme={theme}>
      <h2 className={styles.title}>data-theme="{theme}"</h2>
      <div className={styles.stage}>
        {STATUSES.map(({ name, sample }) => (
          <Card key={name} name={name} sample={sample} />
        ))}
      </div>
    </section>
  );
}

function Status() {
  return (
    <div className={styles.sheet}>
      <p className={styles.hint}>
        Five statuses, each a surface, border and text. Border and text are the hue's main step 600
        on a light surface (yellow text 800), 400 or 500 on a dark one; the surface is the border
        mixed into the card surface. Info takes the accent, so there stays one blue in the UI. A
        status color never appears without an icon and text.
      </p>
      <div className={styles.themes}>
        {THEMES.map((theme) => (
          <Theme key={theme} theme={theme} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof Status> = {
  title: "Tokens/Status",
  component: Status,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Status>;

export const Default: Story = {};
