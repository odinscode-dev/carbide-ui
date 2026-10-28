import type { Decorator } from "@storybook/react-vite";
import styles from "./matrix.module.css";

/**
 * Renders a story in all six combinations of two themes and three densities:
 * three columns (densities) by two rows (themes).
 *
 * This is the only place that sets `data-theme` explicitly to both values --
 * everywhere else the system (prefers-color-scheme) or the shell decides.
 * The cells are descendants of the document; that is why the roles hang on
 * `[data-theme]` without `:root`.
 *
 * Usage in a story file:
 *
 * ```tsx
 * export const Matrix: Story = { decorators: [matrix], parameters: { layout: "fullscreen" } };
 * ```
 */

const THEMES = ["light", "dark"] as const;
const DENSITIES = ["compact", "dense", "large"] as const;

export const matrix: Decorator = (Story) => (
  <div className={styles.grid}>
    {THEMES.map((theme) =>
      DENSITIES.map((density) => (
        <section
          className={styles.cell}
          data-density={density}
          data-theme={theme}
          key={`${theme}-${density}`}
        >
          <h2 className={styles.caption}>
            {theme} &middot; {density}
          </h2>
          <div className={styles.stage}>
            <Story />
          </div>
        </section>
      )),
    )}
  </div>
);
