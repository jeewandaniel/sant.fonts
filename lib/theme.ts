export type Theme = "light" | "dark";

const STORAGE_KEY = "sant-fonts:theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {}
  return "light";
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  document.documentElement.dataset.theme = theme;
}

/** Inline boot script — runs in <head> before React hydrates so there's no
 *  flash of the wrong theme. Editorial aesthetic defaults to LIGHT. */
export const BOOT_SCRIPT = `
(function() {
  try {
    var t = localStorage.getItem('${STORAGE_KEY}');
    document.documentElement.dataset.theme = (t === 'dark' ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`;
