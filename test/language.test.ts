/**
 * Code is English -- identifiers, comments, strings, everything. Checked
 * mechanically, because the rule alone did not hold (Ticket #101; Odin,
 * 2026-09-13: "the rule should be anchored so that it can no longer be
 * ignored"). German stays in commit messages, tickets, Markdown documentation
 * and the knowledge base -- none of which this test reads.
 *
 * Two probes over every code file (TypeScript, CSS, scripts, workflows):
 * 1. no umlaut or sharp s anywhere -- English has none, German rarely gets by
 *    without them, and transliterations like "ue" are caught by probe 2;
 * 2. no German function word as a whole word. The list holds only words that
 *    are not also English ("die", "hat", "an" are missing on purpose), so a
 *    hit is a hit. Identifiers are checked too: a variable called `wert` or a
 *    keyframe called `aufklappen` shows up like a comment does.
 *
 * Markdown files, package.json descriptions and lockfiles are out of scope:
 * documentation is German by decision, the rest carries no prose.
 *
 * Rule: code (identifiers, comments, strings) is English, documentation
 * is German.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

const CODE_SUFFIXES = [".ts", ".tsx", ".mjs", ".js", ".css", ".yml", ".yaml"];
const SKIPPED_DIRS = new Set(["node_modules", "dist", "dist-storybook", ".git", ".changeset"]);

/**
 * Where code lives; everything else at the root is configuration or prose.
 * `.forgejo/issue_template` is addressed to Odin in the Forgejo UI, i.e.
 * communication, and stays out. This file excludes itself: it has to spell
 * the German it hunts.
 */
const ROOTS = ["packages", ".storybook", ".forgejo/workflows", "test"];
const ROOT_FILES = ["vitest.config.ts", "vitest.setup.ts"];
const SELF = resolve(import.meta.dirname, "language.test.ts");

/**
 * A line that has to contain German -- the CI grep for "geteilte Datei" in
 * commit messages, which are German by decision -- says so with this marker
 * and is skipped. Use it rarely and say why on the same line.
 */
const MARKER = "German on purpose";

/** Knowledge-base URIs carry German slugs; they are references, not prose. */
const OKF_URI = /okf:\/\/\S+/g;

const UMLAUT = /[äöüÄÖÜß]/;

/**
 * German function words that are not English words. Whole-word, case
 * sensitive for the lowercase forms so that `MIT` (the licence) and English
 * sentence starts do not trip it. Extend when a hit slipped through --
 * never shorten to make a file pass.
 */
const GERMAN_WORDS = [
  "und",
  "nicht",
  "oder",
  "aber",
  "wenn",
  "dann",
  "sonst",
  "auch",
  "noch",
  "schon",
  "kein",
  "keine",
  "keinen",
  "ohne",
  "dass",
  "weil",
  "deshalb",
  "siehe",
  "wird",
  "wurde",
  "werden",
  "sind",
  "ist",
  "haben",
  "kann",
  "muss",
  "soll",
  "darf",
  "fuer",
  "ueber",
  "zwischen",
  "nur",
  "immer",
  "jede",
  "jeder",
  "jedes",
  "dieser",
  "diese",
  "dieses",
  "mit",
  "bei",
  "vom",
  "zum",
  "zur",
  "eine",
  "einem",
  "einen",
  "einer",
  "eines",
  "nach",
  "vor",
  "aus",
  "auf",
  "beim",
  "durch",
  "gegen",
  "unter",
  "sich",
  "wie",
  "hier",
  "dort",
  "heisst",
  "gibt",
  "bleibt",
  "steht",
  "wert",
  "werte",
  "vorgabe",
  "zeile",
  "spalte",
  "datei",
  "dateien",
  "pruefen",
  "prueft",
  "geprueft",
  "laeuft",
  "rendert",
  "trifft",
  "klasse",
  "klassen",
  "wurzel",
  "aufklappen",
  "einblenden",
  "ausblenden",
  "erscheinen",
  "verschwinden",
  "drehen",
  "dichte",
  "dichten",
];

const GERMAN = new RegExp(`(?<![A-Za-z])(?:${GERMAN_WORDS.join("|")})(?![A-Za-z])`, "g");

function collect(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIPPED_DIRS.has(entry.name)) {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      collect(path, found);
    } else if (CODE_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) {
      found.push(path);
    }
  }
  return found;
}

const files = [
  ...ROOTS.flatMap((dir) => collect(join(root, dir))),
  ...ROOT_FILES.map((file) => join(root, file)),
]
  .filter((file) => file !== SELF)
  .sort();

interface Hit {
  line: number;
  text: string;
}

function hits(source: string, pattern: RegExp): Hit[] {
  const found: Hit[] = [];
  source.split("\n").forEach((line, index) => {
    if (line.includes(MARKER)) {
      return;
    }
    const text = line.replaceAll(OKF_URI, "");
    if (pattern.test(text)) {
      found.push({ line: index + 1, text: line.trim() });
    }
    pattern.lastIndex = 0;
  });
  return found;
}

describe("code is English", () => {
  it("looks at a meaningful number of files", () => {
    expect(files.length).toBeGreaterThan(300);
  });

  for (const file of files) {
    const name = relative(root, file);
    it(name, () => {
      const source = readFileSync(file, "utf8");
      expect(hits(source, UMLAUT), "umlaut or sharp s").toEqual([]);
      expect(hits(source, GERMAN), "German word").toEqual([]);
    });
  }
});
