/**
 * Copies the token files to css/, so `@odinscode/carbide-token/css/tokens.css` exists
 * in the published package. Ticket #41: the files live in src/, `tsc`
 * doesn't copy CSS, and `files` points at css/.
 *
 * Copies exactly the @import graph starting at src/tokens.css -- nothing
 * else, so no story styles like Density.module.css and no tests. The
 * folder structure is kept so relative @import and url() paths
 * (typography.css points at ../fonts/) keep working.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(packageDir, "src");
const target = join(packageDir, "css");

const IMPORT = /@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/g;

function collect(file, found) {
  if (found.has(file)) {
    return;
  }
  found.add(file);
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(IMPORT)) {
    const path = resolve(dirname(file), match[1]);
    if (!path.startsWith(source)) {
      throw new Error(`import outside of src/: ${match[1]} in ${file}`);
    }
    collect(path, found);
  }
}

const files = new Set();
collect(join(source, "tokens.css"), files);

rmSync(target, { recursive: true, force: true });
for (const file of files) {
  const output = join(target, relative(source, file));
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, readFileSync(file));
}
console.log(`css/: ${files.size} files from the import graph of tokens.css`);
