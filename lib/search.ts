// Client-side font search powered by Fuse.js. Built once on first call,
// then reused — building the index over 1,900 entries costs ~80ms but
// only happens on first search.

import Fuse, { type IFuseOptions } from "fuse.js";
import { FONTS, type FontRecord } from "./fonts";

const OPTIONS: IFuseOptions<FontRecord> = {
  keys: [
    { name: "family", weight: 0.6 },
    { name: "designer", weight: 0.2 },
    { name: "slug", weight: 0.1 },
    { name: "category", weight: 0.1 },
  ],
  threshold: 0.32, // typo-tolerant but not loose
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
};

let cached: Fuse<FontRecord> | null = null;
function getIndex(): Fuse<FontRecord> {
  if (!cached) cached = new Fuse(FONTS, OPTIONS);
  return cached;
}

export interface SearchHit {
  font: FontRecord;
  score: number;
}

export function searchFonts(query: string, limit = 12): SearchHit[] {
  const q = query.trim();
  if (!q) {
    // Empty query: show a default starter set of the most popular families
    // so the picker isn't blank on first open.
    return [...FONTS]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit)
      .map((font) => ({ font, score: 0 }));
  }
  const hits = getIndex().search(q, { limit });
  return hits.map((h) => ({ font: h.item, score: h.score ?? 0 }));
}
