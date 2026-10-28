/**
 * Copies every `*.module.css` from src/ to the same relative path under
 * dist/. `tsc` only compiles .ts/.tsx and leaves
 * `import styles from "./BoardShell.module.css"` untouched -- without this
 * copy, a consuming app's bundler wouldn't find the file in dist/, see the
 * same need in @odinscode/carbide-core/scripts/copy-css.mjs.
 *
 * Unlike @odinscode/carbide-token, there is no @import graph to follow here: every
 * component's CSS is self-contained, so a plain copy with the same folder
 * structure is enough.
 */
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(packageDir, "src");
const target = join(packageDir, "dist");

function collect(dir, found) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      collect(path, found);
    } else if (entry.name.endsWith(".module.css")) {
      found.push(path);
    }
  }
}

const files = [];
collect(source, files);

for (const file of files) {
  const output = join(target, relative(source, file));
  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(file, output);
}
console.log(`dist/: copied ${files.length} CSS modules from src/`);
