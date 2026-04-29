// Dynamic Google Fonts loader. With ~1900 families in the catalog we
// can't preload everything in <head> — too long URL, too much CSS, browser
// would tank. Instead, components call loadFont() the first time they
// need to render a particular family, and we inject a single <link>
// tag into <head> on demand. Subsequent calls are no-ops.

import { cssUrlForFamily, type FontRecord } from "./fonts";

const loaded = new Set<string>();

/** Inject a Google Fonts <link> for this family if we haven't already. */
export function loadFont(font: FontRecord): void {
  if (typeof document === "undefined") return;
  if (loaded.has(font.slug)) return;
  loaded.add(font.slug);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrlForFamily(font);
  link.dataset.fontSlug = font.slug;
  document.head.appendChild(link);
}

/** Inject a batch in one tick. Cheaper than calling loadFont() in a loop
 *  because it dedupes upfront. */
export function loadFonts(fonts: FontRecord[]): void {
  for (const f of fonts) loadFont(f);
}
