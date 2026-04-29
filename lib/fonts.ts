// Real catalog loader. Reads the manifest produced by scripts/ingest.mjs
// at build time. PAIRINGS stay hand-curated — they're the editorial
// commentary that no public API can give us.

import manifest from "../public/fonts.json";

export type FontCategory = "sans" | "serif" | "mono" | "display";

export interface FontRecord {
  slug: string;
  family: string;
  designer: string;
  category: FontCategory;
  weights: number[];
  italic: boolean;
  variable: boolean;
  subsets: string[];
  license: "OFL" | "Apache-2.0";
  /** CSS font-family value, including fallback. */
  cssFamily: string;
  blurb: string;
  pangram: string;
  version: string;
  lastModified: string | null;
  /** Popularity rank from the Google Fonts API (0 = most popular). */
  rank: number;
}

/** All families, alphabetically sorted (the manifest's natural order). */
export const FONTS: FontRecord[] = manifest as FontRecord[];

export const CATEGORIES: { id: FontCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
  { id: "display", label: "Display" },
];

export function getFontBySlug(slug: string): FontRecord | undefined {
  return FONTS.find((f) => f.slug === slug);
}

/**
 * Return the top-N most popular families, sorted by Google Fonts'
 * popularity rank. Used by the home hero + anywhere we need a small
 * curated subset rather than the full ~2000-family catalog.
 */
export function getPopularFonts(n: number): FontRecord[] {
  return [...FONTS]
    .filter((f) => f.rank !== undefined)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, n);
}

/**
 * Build a Google Fonts CSS API URL for a single family. Used by the
 * dynamic font loader (lib/font-loader.ts) to inject only the fonts
 * a component actually renders.
 */
export function cssUrlForFamily(font: FontRecord): string {
  const family = font.family.replace(/ /g, "+");
  const weights = font.weights.length ? font.weights : [400];
  // Compact ranges: if we have a contiguous 100..900 span, use the
  // range syntax; otherwise list explicit weights.
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const useRange = font.variable || max - min >= 300;
  const wghtSpec = useRange ? `${min}..${max}` : weights.join(";");

  if (font.italic) {
    return (
      `https://fonts.googleapis.com/css2?family=${family}:` +
      `ital,wght@0,${wghtSpec};1,${wghtSpec}&display=swap`
    );
  }
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${wghtSpec}&display=swap`;
}

/**
 * Curated font pairings. Each entry says: "if you use {key} as the lead,
 * here are the typefaces that complement it" — with a role and a
 * one-line editorial justification rendered on the detail page and the
 * /pairings showcase. Hand-curated; the public API can't give us this.
 */
export interface FontPairing {
  slug: string;
  role: "Body" | "Display" | "Code" | "Accent";
  reason: string;
}

export const PAIRINGS: Record<string, FontPairing[]> = {
  inter: [
    { slug: "fraunces", role: "Display", reason: "A serif partner that brings warmth to Inter's clinical edge." },
    { slug: "source-serif-4", role: "Body", reason: "Adobe's reading serif paired with Inter's UI clarity." },
    { slug: "jetbrains-mono", role: "Code", reason: "The default code companion for Inter-led product UIs." },
  ],
  geist: [
    { slug: "fraunces", role: "Display", reason: "Vercel's machined sans softened by Fraunces' optical curves." },
    { slug: "lora", role: "Body", reason: "Calligraphic body type beneath a clean, modern sans." },
    { slug: "geist-mono", role: "Code", reason: "A matched mono cut from the same drawing." },
  ],
  outfit: [
    { slug: "source-serif-4", role: "Body", reason: "Geometric headlines anchored by classical reading serif." },
    { slug: "lora", role: "Body", reason: "A warmer, calmer body counterweight." },
    { slug: "jetbrains-mono", role: "Code", reason: "Geometric meets monospaced." },
  ],
  "plus-jakarta-sans": [
    { slug: "lora", role: "Body", reason: "Editorial sans atop a calligraphic-rooted reading serif." },
    { slug: "source-serif-4", role: "Body", reason: "Versatile workhorse over a long-form serif." },
    { slug: "jetbrains-mono", role: "Code", reason: "Code voice for a Plus-Jakarta product." },
  ],
  "space-grotesk": [
    { slug: "fraunces", role: "Body", reason: "Mono-derived display with a bookish serif foil." },
    { slug: "lora", role: "Body", reason: "Distinctive grotesque, calmer reading body." },
    { slug: "jetbrains-mono", role: "Code", reason: "Same DNA — both descend from monospaced grids." },
  ],
  fraunces: [
    { slug: "inter", role: "Body", reason: "Editorial display tempered by neutral UI sans." },
    { slug: "geist", role: "Body", reason: "Optical curves above a precision modern sans." },
    { slug: "jetbrains-mono", role: "Code", reason: "Variable serif voice plus a monospaced supporting cast." },
  ],
  "source-serif-4": [
    { slug: "inter", role: "Display", reason: "Long-form serif under crisp UI headings." },
    { slug: "geist", role: "Display", reason: "Adobe's reading serif with Vercel's modern sans." },
    { slug: "plus-jakarta-sans", role: "Display", reason: "Editorial body, contemporary sans headlines." },
  ],
  lora: [
    { slug: "outfit", role: "Display", reason: "Reading body with geometric, quiet headlines." },
    { slug: "geist", role: "Display", reason: "Calligraphic-rooted serif beneath a machined sans." },
    { slug: "plus-jakarta-sans", role: "Display", reason: "Two warm, editorial siblings — one in each register." },
  ],
  "playfair-display": [
    { slug: "inter", role: "Body", reason: "Fashion-masthead display calmed by neutral UI sans." },
    { slug: "plus-jakarta-sans", role: "Body", reason: "Didone display over a versatile sans body." },
    { slug: "jetbrains-mono", role: "Accent", reason: "High-contrast display, monospaced labels." },
  ],
  "jetbrains-mono": [
    { slug: "inter", role: "Display", reason: "Code monotype under product-grade sans headings." },
    { slug: "fraunces", role: "Display", reason: "Ligatured mono with an editorial serif voice." },
    { slug: "geist", role: "Display", reason: "Mono body, modern sans display." },
  ],
  "geist-mono": [
    { slug: "geist", role: "Display", reason: "Family pairing — both cut from the same hand." },
    { slug: "fraunces", role: "Display", reason: "Mono code beneath a literary serif." },
    { slug: "inter", role: "Display", reason: "Universal product pairing." },
  ],
  "bricolage-grotesque": [
    { slug: "source-serif-4", role: "Body", reason: "Variable display grotesque with a long-form serif." },
    { slug: "jetbrains-mono", role: "Code", reason: "Optical-size display next to monospaced detail." },
    { slug: "inter", role: "Body", reason: "Display flair, neutral body." },
  ],
};

export function getPairings(slug: string): { font: FontRecord; pair: FontPairing }[] {
  const pairs = PAIRINGS[slug] ?? [];
  return pairs
    .map((p) => {
      const font = getFontBySlug(p.slug);
      return font ? { font, pair: p } : null;
    })
    .filter((x): x is { font: FontRecord; pair: FontPairing } => Boolean(x));
}
