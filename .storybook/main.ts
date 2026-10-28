import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // Storybook lives at the root and reads the stories of every package.
  stories: ["../packages/*/src/**/*.stories.tsx"],
  framework: { name: "@storybook/react-vite", options: {} },
  // Send no anonymous usage statistics to Storybook.
  core: { disableTelemetry: true },
  // Deliberately no css.modules.localsConvention: CSS classes are named
  // exactly like the TypeScript access (camelCase), so Storybook sees the same
  // as any consumer without special configuration.
};

export default config;
