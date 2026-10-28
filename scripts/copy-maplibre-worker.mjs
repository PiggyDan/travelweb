/**
 * MapLibre GL v6 runs tile parsing in a module Web Worker that it loads from
 * a URL relative to its own bundle, which breaks once Next bundles it. We
 * serve the worker ourselves instead, under a versioned name (cached
 * immutably, see next.config.ts), and point MapLibre at it with setWorkerUrl().
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = dirname(require.resolve("maplibre-gl/package.json"));
const { version } = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));

const outDir = join(root, "public", "vendor");
mkdirSync(outDir, { recursive: true });
for (const file of readdirSync(outDir)) {
  if (file.startsWith("maplibre-gl-worker-")) rmSync(join(outDir, file));
}
copyFileSync(join(pkgDir, "dist", "maplibre-gl-worker.mjs"), join(outDir, `maplibre-gl-worker-${version}.mjs`));
console.log(`MapLibre worker ${version} → public/vendor/`);
