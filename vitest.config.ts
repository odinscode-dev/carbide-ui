import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
    // CSS modules are processed for real so class names reach the markup and a
    // missing match (empty className) shows up in a test.
    css: true,
    // The default stays node: tokens.test.ts reads tokens.css via
    // readFileSync(new URL(...)) and breaks under jsdom's URL shim.
    // jsdom plus @testing-library/react (both MIT, Ticket #8) apply only
    // where a file puts `// @vitest-environment jsdom` at its head -- for
    // clicks and keyboard, which renderRoot (packages/*/src/test/render.ts)
    // cannot check.
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
});
