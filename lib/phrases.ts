// A small pool of editorial specimen phrases — pangrams, type-design
// aphorisms, and a few literary fragments. Cycled in order so the user
// gets a predictable rotation rather than random surprises.

export const PHRASES: string[] = [
  "The quick brown fox\njumps over the lazy dog.",
  "Sphinx of black quartz,\njudge my vow.",
  "Type is the voice\nof the page.",
  "Form follows function.",
  "A beautiful collection\nof letters.",
  "Reading is invisible —\nthe page should disappear.",
  "Pack my box with five\ndozen liquor jugs.",
  "How vexingly quick\ndaft zebras jump!",
  "Whereas recognition\nof the inherent dignity",
  "Setting type\nis laying down lines.",
  "Letters acted like\nphysical objects.",
  "Type, with intent.\nPick your voice.",
];

/** Returns the phrase that comes after `current` in the pool. */
export function nextPhrase(current: string): string {
  const idx = PHRASES.indexOf(current);
  if (idx === -1) return PHRASES[0];
  return PHRASES[(idx + 1) % PHRASES.length];
}
