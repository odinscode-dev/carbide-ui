// @vitest-environment jsdom
/**
 * Every story is a test case -- here they all run.
 *
 * 80+ story files describe every component in every variant, but until now
 * nobody executed them: `pnpm build-storybook` only checks that they build,
 * not that they render. This test mounts every story through Storybook's
 * portable stories (`composeStories`, ships with `@storybook/react-vite`, no
 * dependency of its own) in jsdom, with the decorators from
 * `.storybook/preview.ts`, and runs its `play` function if it has one. An
 * error while rendering, a throw in an effect, a failed `play` step -- all of
 * it lands here instead of at the consumer.
 *
 * Not checked is the look: jsdom has no layout. That remains the job of
 * Storybook itself (story `Matrix`, both themes, three densities).
 */
import { readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { composeStories, setProjectAnnotations } from "@storybook/react-vite";
import { cleanup } from "@testing-library/react";
import { afterEach, describe, it } from "vitest";
import preview from "../.storybook/preview.js";

setProjectAnnotations(preview);

// import.meta.dirname instead of fileURLToPath(import.meta.url): under jsdom
// import.meta.url is no longer a file: URL (see comment in vitest.config.ts).
const root = resolve(import.meta.dirname, "..");
const packagesDir = join(root, "packages");

function collect(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== "dist") {
        collect(path, found);
      }
    } else if (entry.name.endsWith(".stories.tsx")) {
      found.push(path);
    }
  }
  return found;
}

const files = collect(packagesDir).sort();

/** A story module as `composeStories` expects it: default = meta, rest = stories. */
type StoryModule = Parameters<typeof composeStories>[0];

/** What the test needs from a composed story; the rest does not matter. */
interface RunnableStory {
  run: () => Promise<void>;
  play?: unknown;
}

function isRunnable(value: unknown): value is RunnableStory {
  // A composed story is itself a function (renders the component) with
  // attached fields -- hence typeof "function", not "object".
  return (
    (typeof value === "function" || typeof value === "object") &&
    value !== null &&
    "run" in value &&
    typeof value.run === "function"
  );
}

function isStoryModule(value: unknown): value is StoryModule {
  return typeof value === "object" && value !== null && "default" in value;
}

const modules = await Promise.all(
  files.map(async (file) => {
    const loaded: unknown = await import(file);
    if (!isStoryModule(loaded)) throw new Error(`${file} has no default export (the story meta)`);
    return { file: relative(root, file), stories: composeStories(loaded) };
  }),
);

afterEach(cleanup);

/**
 * Measured on 2026-09-16: the slowest story (Dialog/Matrix, many Ark dialogs
 * with portal) takes 1.7 s locally, 8.7 s on the CI runner -- Vitest's default of
 * 5 s broke a CI run. 30 s sit a factor of 3 above the server value and
 * still catch real hangs.
 */
const STORY_TIMEOUT_MS = 30_000;

for (const { file, stories } of modules) {
  describe(file, () => {
    const entries = Object.entries(stories);
    it("exports at least one story", () => {
      if (entries.length === 0) {
        throw new Error(`${file} exports no story`);
      }
    });
    for (const [name, story] of entries) {
      if (!isRunnable(story)) {
        throw new Error(`${file}: export ${name} is not a story`);
      }
      it(
        `${name} renders${story.play === undefined ? "" : " and play runs through"}`,
        { timeout: STORY_TIMEOUT_MS },
        async () => {
          await story.run();
        },
      );
    }
  });
}
