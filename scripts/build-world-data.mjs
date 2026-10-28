/**
 * Builds the static world data the explorer (/explore) loads from /public/geo.
 *
 *   public/geo/countries.json      country facts, trimmed from mledoze/countries (ODbL 1.0)
 *   public/geo/countries-110m.json Natural Earth 1:110m country shapes (public domain, via
 *                                  the world-atlas package) with an ISO alpha-2 `iso2` property
 *
 * Usage (PowerShell):
 *   curl.exe -sSfL -o $env:TEMP\countries.json https://raw.githubusercontent.com/mledoze/countries/master/countries.json
 *   node scripts/build-world-data.mjs $env:TEMP\countries.json
 *
 * Only facts present in the source are kept. Nothing is filled in by hand.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/build-world-data.mjs <path to mledoze countries.json>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "geo");
mkdirSync(outDir, { recursive: true });

const raw = JSON.parse(readFileSync(source, "utf8"));

const countries = raw
  .map((c) => ({
    iso2: c.cca2,
    iso3: c.cca3,
    name: c.name.common,
    official: c.name.official,
    flag: c.flag,
    capitals: c.capital ?? [],
    region: c.region,
    subregion: c.subregion || null,
    lat: c.latlng[0],
    lon: c.latlng[1],
    areaKm2: c.area > 0 ? c.area : null,
    landlocked: Boolean(c.landlocked),
    independent: c.independent ?? null,
    currencies: Object.entries(c.currencies ?? {}).map(([code, v]) => ({ code, name: v.name, symbol: v.symbol ?? null })),
    languages: Object.values(c.languages ?? {}),
    callingCodes:
      c.idd?.root && c.idd.suffixes?.length && c.idd.suffixes.length <= 3
        ? c.idd.suffixes.map((s) => `${c.idd.root}${s}`)
        : c.idd?.root
          ? [c.idd.root]
          : [],
    tld: c.tld ?? [],
    altNames: [...new Set([...(c.altSpellings ?? []), ...Object.values(c.translations ?? {}).map((t) => t.common)])]
      .filter((n) => n.length > 2 && n !== c.name.common)
      .slice(0, 24),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(join(outDir, "countries.json"), JSON.stringify(countries));

// Tag each polygon with its ISO alpha-2 code so the map can join it to the facts above.
const require = createRequire(import.meta.url);
const topology = structuredClone(require("world-atlas/countries-110m.json"));
const byNumeric = new Map(raw.filter((c) => c.ccn3).map((c) => [c.ccn3, c.cca2]));
// Natural Earth shapes without an ISO numeric code. Disputed areas stay unlabelled.
const byName = { Kosovo: "XK" };

let tagged = 0;
for (const geometry of topology.objects.countries.geometries) {
  const iso2 = byNumeric.get(geometry.id) ?? byName[geometry.properties.name] ?? null;
  geometry.properties = { name: geometry.properties.name, iso2 };
  if (iso2) tagged += 1;
}
delete topology.objects.land;
writeFileSync(join(outDir, "countries-110m.json"), JSON.stringify(topology));

console.log(`countries.json: ${countries.length} countries`);
console.log(`countries-110m.json: ${tagged}/${topology.objects.countries.geometries.length} shapes tagged`);
