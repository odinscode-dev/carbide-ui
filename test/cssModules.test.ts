/**
 * Contract between CSS module and component, checked mechanically.
 *
 * A CSS class is named exactly like the access in TypeScript --
 * `.headerCell` in the CSS, `styles.headerCell` in the TSX, no translation
 * through `css.modules.localsConvention`. Background: kebab-case classes
 * like `.header-cell` only worked in Storybook and Vitest because both had
 * set `camelCaseOnly`; in a consumer
 * without that line `styles.headerCell` was undefined, `className` empty,
 * the component unstyled. 17 classes in 15 files were affected, each one
 * surfaced only on its first real use.
 *
 * Checked for every `*.tsx` that imports a `*.module.css`:
 * 1. every class in the CSS is a valid TypeScript identifier (no hyphen) --
 *    otherwise there is no spelling that is the same on both sides;
 * 2. every `styles.xyz` access in the TSX has a class in the CSS --
 *    otherwise `className` is empty, and no test that only compares markup
 *    notices;
 * 3. no bracket access `styles[...]` -- it would bypass point 2.
 *
 * Rule: CSS classes are named exactly like their TypeScript access (camelCase).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = join(root, "packages");

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const MODULE_IMPORT = /import\s+([A-Za-z_$][\w$]*)\s+from\s+"(\.\/[^"]+\.module\.css)"/g;
const CLASS_SELECTOR = /\.([A-Za-z_][\w-]*)/g;

/** All matches of the first capture group; the pattern guarantees it exists. */
function captures(text: string, pattern: RegExp): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(pattern)) {
    const group = match[1];
    if (group !== undefined) {
      found.push(group);
    }
  }
  return found;
}

function collect(dir: string, suffix: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== "dist") {
        collect(path, suffix, found);
      }
    } else if (entry.name.endsWith(suffix)) {
      found.push(path);
    }
  }
  return found;
}

/**
 * Class names from the selectors of a stylesheet. Comments go first, then
 * every innermost declaration block `{ ... }` -- what remains are selectors
 * and at-rule preludes. There every `.name` is a class; numbers like `62.5em`
 * fail the letter-first pattern. `:global(...)` is dropped beforehand: those
 * are foreign classes (Prism tokens in CodeSnippet) that no `styles.x` ever
 * addresses.
 */
function cssClasses(css: string): Set<string> {
  const selectors = css
    .replaceAll(/\/\*[\s\S]*?\*\//g, "")
    .replaceAll(/:global\([^)]*\)/g, "")
    .replaceAll(/\{[^{}]*\}/g, " ");
  return new Set(captures(selectors, CLASS_SELECTOR));
}

interface Pair {
  tsx: string;
  css: string;
  binding: string;
}

function pairs(): Pair[] {
  const result: Pair[] = [];
  for (const tsx of collect(packagesDir, ".tsx")) {
    const source = readFileSync(tsx, "utf8");
    for (const match of source.matchAll(MODULE_IMPORT)) {
      const [, binding, specifier] = match;
      if (binding !== undefined && specifier !== undefined) {
        result.push({ tsx, css: resolve(dirname(tsx), specifier), binding });
      }
    }
  }
  return result;
}

const all = pairs();

describe("CSS modules", () => {
  it("are found at all", () => {
    expect(all.length).toBeGreaterThan(50);
  });

  for (const cssFile of new Set(all.map((pair) => pair.css))) {
    it(`${relative(root, cssFile)}: every class is a TypeScript identifier`, () => {
      const invalid = Array.from(cssClasses(readFileSync(cssFile, "utf8"))).filter(
        (name) => !IDENTIFIER.test(name),
      );
      expect(invalid).toEqual([]);
    });
  }

  for (const { tsx, css, binding } of all) {
    it(`${relative(root, tsx)}: every ${binding} access hits a class`, () => {
      const source = readFileSync(tsx, "utf8");
      const classes = cssClasses(readFileSync(css, "utf8"));

      const bracketAccess = source.match(new RegExp(`\\b${binding}\\[`, "g")) ?? [];
      expect(bracketAccess, "bracket access bypasses the check").toEqual([]);

      const accessed = captures(source, new RegExp(`\\b${binding}\\.([A-Za-z_$][\\w$]*)`, "g"));
      const missing = accessed.filter((name) => !classes.has(name));
      expect(missing).toEqual([]);
    });
  }
});
