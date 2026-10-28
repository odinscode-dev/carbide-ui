import type { Decorator, Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { createElement, useLayoutEffect } from "react";
import "../packages/token/src/tokens.css";
import "./preview.css";

/**
 * Carbide's two switches live in the Storybook toolbar and nowhere else: in
 * an application the system decides, and the shell sets density and the theme
 * default.
 */

const THEMES = ["system", "light", "dark"] as const;
const DENSITIES = ["compact", "dense", "large"] as const;

interface Choice {
  theme: (typeof THEMES)[number];
  density: (typeof DENSITIES)[number];
}

/**
 * Writes the toolbar choice to the root element of the story frame.
 *
 * There and not on a wrapper around the story: the roles colour the whole
 * surface. `system` means no attribute -- then `prefers-color-scheme` applies.
 */
function Root({ theme, density, children }: Choice & { children?: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }

    root.setAttribute("data-density", density);
  }, [theme, density]);

  return children;
}

/** Takes the toolbar value if it belongs to the set, otherwise the fallback. */
function chosen<T extends string>(values: readonly T[], value: unknown, fallback: T): T {
  return values.find((candidate) => candidate === value) ?? fallback;
}

const switches: Decorator = (Story, { globals }) =>
  createElement(
    Root,
    {
      theme: chosen(THEMES, globals.theme, "system"),
      density: chosen(DENSITIES, globals.density, "compact"),
    },
    createElement(Story),
  );

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },

  globalTypes: {
    theme: {
      description: "Theme: light, dark or system setting",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        dynamicTitle: true,
        items: [
          { value: "system", title: "System" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },

    density: {
      description: "Density of the application, otherwise set by the shell",
      toolbar: {
        title: "Density",
        icon: "component",
        dynamicTitle: true,
        items: [
          { value: "compact", title: "compact" },
          { value: "dense", title: "dense" },
          { value: "large", title: "large" },
        ],
      },
    },
  },

  // Default as without attributes: system setting, compact.
  initialGlobals: { theme: "system", density: "compact" },

  decorators: [switches],
};

export default preview;
