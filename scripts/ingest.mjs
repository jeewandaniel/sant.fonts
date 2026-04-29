/**
 * Ingestion — pulls the full Google Fonts catalogue and writes a manifest
 * to public/fonts.json. The dev/build server reads that manifest at boot.
 *
 * Run locally:
 *   GOOGLE_FONTS_API_KEY=XYZ node scripts/ingest.mjs
 *
 * The Google Fonts Developer API is free and unauthenticated quotas are
 * generous — one daily run per repo via GitHub Actions is plenty.
 *
 * Manifest schema is the FontRecord type in lib/fonts.ts. This script is
 * the single place that knows how to translate Google's response into our
 * schema, including weight extraction, OFL/Apache mapping and popularity
 * rank (we sort families alphabetically and let Google's `popularity`
 * sort drive the rank field).
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/fonts.json");

const KEY = process.env.GOOGLE_FONTS_API_KEY;
if (!KEY) {
  console.error(
    "Missing GOOGLE_FONTS_API_KEY. Get one (free) at console.cloud.google.com\n" +
    "→ enable 'Web Fonts Developer API' → create API key → run again with:\n" +
    "  GOOGLE_FONTS_API_KEY=... node scripts/ingest.mjs",
  );
  process.exit(1);
}

const ENDPOINT =
  "https://www.googleapis.com/webfonts/v1/webfonts" +
  `?key=${KEY}&sort=popularity`;

/** Map Google Fonts categories to ours. */
function mapCategory(g) {
  switch (g) {
    case "serif":
      return "serif";
    case "sans-serif":
      return "sans";
    case "display":
      return "display";
    case "handwriting":
      return "display"; // bucket script/handwriting under display for the catalog
    case "monospace":
      return "mono";
    default:
      return "sans";
  }
}

/** Family -> its first available designer. Google's API doesn't expose
 * designer info, so we leave the field empty unless an external override
 * is provided. The detail page will fall back to "Open source community". */
const DESIGNER_OVERRIDES = {
  Inter: "Rasmus Andersson",
  Geist: "Vercel",
  Outfit: "Smile Type Studio",
  "Plus Jakarta Sans": "Tokotype",
  "Space Grotesk": "Florian Karsten",
  Fraunces: "Undercase Type",
  "Source Serif 4": "Adobe / Frank Grießhammer",
  Lora: "Cyreal",
  "Playfair Display": "Claus Eggers Sørensen",
  "JetBrains Mono": "JetBrains",
  "Geist Mono": "Vercel",
  "Bricolage Grotesque": "Mathieu Triay",
  Roboto: "Christian Robertson",
  "Open Sans": "Steve Matteson",
  Lato: "Łukasz Dziedzic",
  Montserrat: "Julieta Ulanovsky",
  Merriweather: "Sorkin Type",
  "Roboto Slab": "Christian Robertson",
  "Roboto Mono": "Christian Robertson",
  "Fira Code": "Nikita Prokopov",
  "IBM Plex Sans": "Mike Abbink",
  "IBM Plex Serif": "Mike Abbink",
  "IBM Plex Mono": "Mike Abbink",
  "DM Sans": "Colophon Foundry",
  "DM Serif Display": "Colophon Foundry",
  "DM Mono": "Colophon Foundry",
  Manrope: "Mikhail Sharanda",
  "Crimson Pro": "Sebastian Kosch",
  "Libre Baskerville": "Pablo Impallari",
  "Libre Caslon Text": "Pablo Impallari",
  "Work Sans": "Wei Huang",
  "Public Sans": "USWDS / Dan O. Williams",
  "Noto Sans": "Google",
  "Noto Serif": "Google",
};

/** Convert a Google variant string ("100", "100italic", "regular", "italic") to a numeric weight. */
function variantWeight(v) {
  if (v === "regular" || v === "italic") return 400;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

/** True if the variant is italic. */
function variantItalic(v) {
  return v.endsWith("italic");
}

function slugify(family) {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickWeights(variants) {
  const weights = new Set();
  for (const v of variants) {
    const w = variantWeight(v);
    if (w !== null) weights.add(w);
  }
  return [...weights].sort((a, b) => a - b);
}

function hasItalic(variants) {
  return variants.some(variantItalic);
}

/** Some families on Google Fonts ship both static and variable axes. We
 * detect "variable" by the presence of axes in the API response or by
 * seeing the very common 100..900 weight ladder. */
function isVariable(family, variants) {
  const weights = pickWeights(variants);
  // Heuristic: ≥7 distinct weights usually means it's been engineered with
  // a variable axis or has equivalent coverage.
  return weights.length >= 7;
}

function mapLicense(family) {
  // Google Fonts is overwhelmingly OFL with a small Apache-2.0 minority
  // (Roboto family, the original Material families). The API doesn't
  // surface license per family, so we treat unknowns as OFL — the user
  // should verify any family before commercial deployment.
  const APACHE = new Set([
    "Roboto",
    "Roboto Mono",
    "Roboto Slab",
    "Roboto Condensed",
    "Roboto Flex",
    "Roboto Serif",
    "Open Sans",
    "Open Sans Condensed",
  ]);
  return APACHE.has(family) ? "Apache-2.0" : "OFL";
}

/** A short editorial-feeling blurb. Google's API doesn't ship one, so we
 * leave it null — the detail page renders a placeholder until curated. */
function blurb(family, category) {
  // Optional: hand-curated blurbs for the top families. Anything else
  // gets a generic fallback.
  const HAND = {
    Inter: "Designed for screens. The default sans for product UI.",
    Geist: "Vercel's house typeface. Cool, mechanical, modern.",
    Roboto: "Google's workhorse sans. Neutral, ubiquitous, dependable.",
    Lora: "Calligraphic-rooted serif. Body-text reliable, screen-friendly.",
    Fraunces:
      "A variable old-style serif with a softness axis. Made for editorial display.",
    "Playfair Display":
      "High-contrast didone for fashion mastheads and editorial display.",
    "JetBrains Mono":
      "The default code monotype. Ligatures for code, large x-height.",
  };
  if (HAND[family]) return HAND[family];

  const noun =
    category === "serif"
      ? "serif"
      : category === "mono"
        ? "monospace"
        : category === "display"
          ? "display face"
          : "sans-serif";
  return `An open-source ${noun} from the Google Fonts library.`;
}

/**
 * Families to skip — icon fonts, emoji fonts, music notation. Rendering
 * a pangram in any of these gives a tofu mess because every glyph is a
 * UI icon, not a letter.
 */
const SKIP_FAMILIES = new Set([
  "Material Icons",
  "Material Icons Outlined",
  "Material Icons Round",
  "Material Icons Sharp",
  "Material Icons Two Tone",
  "Material Symbols",
  "Material Symbols Outlined",
  "Material Symbols Rounded",
  "Material Symbols Sharp",
  "Music Symbols",
  "Noto Music",
  "Noto Sans Symbols",
  "Noto Sans Symbols 2",
  "Noto Emoji",
  "Noto Color Emoji",
]);

function shouldSkip(item) {
  if (SKIP_FAMILIES.has(item.family)) return true;
  // Drop anything without a Latin subset — unrenderable in our chrome.
  if (!Array.isArray(item.subsets) || !item.subsets.includes("latin")) return true;
  return false;
}

async function main() {
  console.log(`→ fetching Google Fonts catalogue (sort: popularity)`);
  const res = await fetch(ENDPOINT);
  if (!res.ok) {
    console.error(
      `Google Fonts API error: ${res.status} ${res.statusText}\n` +
      "Check your API key and that 'Web Fonts Developer API' is enabled.",
    );
    process.exit(1);
  }
  const data = await res.json();
  const allItems = data.items || [];
  const items = allItems.filter((it) => !shouldSkip(it));
  console.log(
    `  got ${allItems.length} families · keeping ${items.length} ` +
    `(skipped ${allItems.length - items.length} icon/emoji/non-Latin)`,
  );

  /** Sort key — already by popularity from the API, so rank is index. */
  const records = items.map((it, rank) => {
    const family = it.family;
    const category = mapCategory(it.category);
    const variants = it.variants || [];
    const weights = pickWeights(variants);

    return {
      slug: slugify(family),
      family,
      designer: DESIGNER_OVERRIDES[family] ?? "Open source community",
      category,
      weights: weights.length ? weights : [400],
      italic: hasItalic(variants),
      variable: isVariable(family, variants),
      subsets: it.subsets || [],
      license: mapLicense(family),
      cssFamily: `'${family}', ${cssFallback(category)}`,
      blurb: blurb(family, category),
      pangram: "The quick brown fox jumps over the lazy dog.",
      version: it.version || "v1",
      lastModified: it.lastModified || null,
      rank, // 0 = most popular
    };
  });

  // Sort the manifest alphabetically for stable diffs in git, but keep
  // the popularity rank field so the UI can sort by it cheaply.
  records.sort((a, b) => a.family.localeCompare(b.family));

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(records, null, 0));

  // Summary
  const byCat = records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  console.log(`✓ wrote ${records.length} families → ${OUT}`);
  console.log(`  by category:`, byCat);
  console.log(`  size: ${(JSON.stringify(records).length / 1024).toFixed(1)}KB`);
}

function cssFallback(category) {
  switch (category) {
    case "serif":
      return "ui-serif, Georgia, serif";
    case "mono":
      return "ui-monospace, monospace";
    case "display":
      return "ui-sans-serif, system-ui, sans-serif";
    default:
      return "ui-sans-serif, system-ui, sans-serif";
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
