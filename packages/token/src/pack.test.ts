import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageDir = fileURLToPath(new URL("..", import.meta.url));

const CSS = [
  "css/tokens.css",
  "css/primitive/gray.css",
  "css/primitive/ramps.css",
  "css/semantic/color.css",
  "css/semantic/status.css",
  "css/semantic/chart.css",
  "css/semantic/syntax.css",
  "css/density.css",
  "css/typography.css",
  "css/motion.css",
  "css/breakpoint.css",
];

const FONTS = [
  ...[100, 200, 300, 400, 500, 600, 800].map((weight) => `fonts/CarbideMono-${weight}.woff2`),
  "fonts/CarbideSans-Var.woff2",
  "fonts/CarbideSans-Italic-Var.woff2",
  "fonts/CarbideDisplay-Var.woff2",
  "fonts/CarbideDisplay-Italic-Var.woff2",
  "fonts/OFL.txt",
  "fonts/OFL-JetBrainsMono.txt",
];

const OTHER = ["package.json", "LIZENZEN.md", "NOTICE", "dist/index.js", "dist/index.d.ts"];

function archiveContents(): string[] {
  const tempDir = mkdtempSync(join(tmpdir(), "carbide-tokens-"));
  try {
    execFileSync("pnpm", ["build"], { cwd: packageDir, stdio: "pipe" });
    execFileSync("pnpm", ["pack", "--pack-destination", tempDir], {
      cwd: packageDir,
      stdio: "pipe",
    });
    const archive = readdirSync(tempDir).find((name) => name.endsWith(".tgz"));
    if (archive === undefined) {
      throw new Error("pnpm pack did not produce an archive");
    }
    const list = execFileSync("tar", ["-tzf", join(tempDir, archive)], { encoding: "utf8" });
    return list
      .split("\n")
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^package\//, ""));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe("published package @odinscode/carbide-token", () => {
  it("contains tokens, fonts, licenses and dist -- and nothing from src/", () => {
    const files = archiveContents();

    for (const expected of [...CSS, ...FONTS, ...OTHER]) {
      expect(files, `missing from the archive: ${expected}`).toContain(expected);
    }

    const foreign = files.filter(
      (file) =>
        file.startsWith("src/") ||
        file.startsWith("scripts/") ||
        file.includes(".stories.") ||
        file.includes(".test.") ||
        file.endsWith(".module.css"),
    );
    expect(foreign).toStrictEqual([]);
  }, 120_000);
});
