"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPairings, getPopularFonts } from "@/lib/fonts";
import { loadFont } from "@/lib/font-loader";
import { nextPhrase, PHRASES } from "@/lib/phrases";

const DEFAULT_LINES = PHRASES[PHRASES.length - 1].split("\n");
// Cycle through the top-50 most popular families rather than the full
// ~1900-strong catalog. The catalog grid below is where users browse
// the long tail; the hero stays curated.
const HERO_FONTS = getPopularFonts(50);
const FRAUNCES_IDX = Math.max(0, HERO_FONTS.findIndex((f) => f.slug === "fraunces"));

/**
 * Cover specimen w/ manual font picker.
 * Click-to-edit two-line phrase, ← → / [ ] swap typeface, ↻ try a phrase
 * pulls from the curated pool, live pair preview row cycles through the
 * current font's 3 pairings.
 */
export function HeroA() {
  const [lines, setLines] = useState<string[]>(DEFAULT_LINES);
  const [fontIdx, setFontIdx] = useState(FRAUNCES_IDX);
  const [size, setSize] = useState(140);
  const [focused, setFocused] = useState(false);
  const [pairIdx, setPairIdx] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const font = HERO_FONTS[fontIdx];

  const text = lines.join("\n");
  const isPlaceholder = text.trim() === DEFAULT_LINES.join("\n").trim() && !focused;
  const allPairs = useMemo(() => getPairings(font.slug), [font.slug]);
  const activePair = allPairs[pairIdx % Math.max(allPairs.length, 1)];

  // Inject the Google Fonts CSS for the lead font + the active pair the
  // first time each one is shown. lib/font-loader.ts dedupes internally.
  useEffect(() => {
    loadFont(font);
  }, [font]);

  useEffect(() => {
    if (activePair) loadFont(activePair.font);
  }, [activePair]);

  // Reset pair index when the lead font changes.
  useEffect(() => {
    setPairIdx(0);
  }, [font.slug]);

  // [ ] / ← → cycle the lead font (when not typing in the textarea).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) return;
      if (e.key === "[" || e.key === "ArrowLeft") {
        setFontIdx((i) => (i - 1 + HERO_FONTS.length) % HERO_FONTS.length);
      } else if (e.key === "]" || e.key === "ArrowRight") {
        setFontIdx((i) => (i + 1) % HERO_FONTS.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative border-b border-border-subtle">
      <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-16 md:px-10 md:pb-20 md:pt-24">
        {/* Top bar — current font + ← name → cycle controls */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-y-4">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
            <span className="h-px w-8 bg-border-default" />
            <span>Type pad</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setFontIdx((i) => (i - 1 + HERO_FONTS.length) % HERO_FONTS.length)}
              className="rounded-full border border-border-default px-3 py-1.5 font-mono text-[11px] text-text-secondary hover:border-border-accent hover:text-accent"
              aria-label="Previous font"
            >
              ←
            </button>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums text-text-secondary">
              <span className="text-text-primary">{font.family}</span>
              <span className="ml-3 text-text-faint">
                {String(fontIdx + 1).padStart(2, "0")}/{String(HERO_FONTS.length).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={() => setFontIdx((i) => (i + 1) % HERO_FONTS.length)}
              className="rounded-full border border-border-default px-3 py-1.5 font-mono text-[11px] text-text-secondary hover:border-border-accent hover:text-accent"
              aria-label="Next font"
            >
              →
            </button>
          </div>
        </div>

        {/* The phrase — click to edit */}
        <div className="relative">
          <div
            onClick={() => inputRef.current?.focus()}
            className={[
              "min-h-[44vh] cursor-text whitespace-pre-wrap break-words pb-[0.18em] tracking-tight2 transition-colors",
              isPlaceholder ? "text-text-faint" : "text-text-primary",
            ].join(" ")}
            style={{
              fontFamily: font.cssFamily,
              fontSize: `clamp(56px, ${size / 1.05}px, 220px)`,
              fontWeight: 400,
              lineHeight: 1.02,
            }}
          >
            {text}
            {focused && (
              <span className="ml-1 inline-block h-[0.85em] w-[0.04em] -translate-y-[0.1em] animate-pulse bg-accent align-middle" />
            )}
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setLines(e.target.value.split("\n"))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={2}
            spellCheck={false}
            aria-label="Edit specimen phrase"
            className="absolute inset-0 h-full w-full resize-none bg-transparent text-transparent caret-transparent focus:outline-none"
            style={{ caretColor: "transparent" }}
          />
        </div>

        {/* Live pair preview — current font's pairings, shuffle within */}
        {activePair && (
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-border-subtle pt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
              Pairs with
            </span>
            <Link
              href={`/${activePair.font.slug}`}
              className="group flex flex-wrap items-baseline gap-x-4 gap-y-1"
            >
              <span
                className="text-text-primary transition-colors group-hover:text-accent"
                style={{
                  fontFamily: activePair.font.cssFamily,
                  fontSize: "clamp(20px, 2.4vw, 32px)",
                  lineHeight: 1.2,
                  fontWeight: 400,
                }}
              >
                {activePair.font.family}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                · {activePair.pair.role} · {activePair.font.category}
              </span>
              <span className="hidden font-sans text-[13px] italic text-text-secondary md:ml-2 md:inline">
                {activePair.pair.reason}
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] tabular-nums text-text-faint">
                {pairIdx + 1}/{allPairs.length}
              </span>
              <button
                type="button"
                onClick={() => setPairIdx((i) => (i + 1) % allPairs.length)}
                className="inline-flex items-center gap-2 rounded-full border border-border-default px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary transition-colors hover:border-border-accent hover:text-accent"
                aria-label="Next pairing"
              >
                <ShuffleIconSm /> Next pair
              </button>
              <Link
                href={`/${activePair.font.slug}`}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint hover:text-accent"
              >
                View →
              </Link>
            </div>
          </div>
        )}

        {/* Footer rail — try a phrase + size + meta */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-y-4 border-t border-border-subtle pt-6">
          <div className="flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
            <button
              type="button"
              onClick={() => setLines(nextPhrase(text).split("\n"))}
              className="inline-flex items-center gap-2 rounded-full border border-border-default px-3.5 py-1.5 text-text-secondary transition-colors hover:border-border-accent hover:text-accent"
            >
              <RefreshIcon />
              Try a phrase
            </button>
            <span className="hidden md:inline">Size</span>
            <input
              type="range"
              min={48}
              max={220}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-1 w-48 cursor-pointer accent-accent md:w-72"
            />
            <span className="tabular-nums">{size}px</span>
          </div>

          <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
            <span>{font.weights.length} weights</span>
            {font.variable && <span className="text-accent">variable</span>}
            <span className="text-text-faint">{font.license}</span>
            <span className="hidden md:inline">
              <kbd className="rounded border border-border-default px-1.5 py-0.5 text-[9px]">[</kbd>{" "}
              <kbd className="rounded border border-border-default px-1.5 py-0.5 text-[9px]">]</kbd>{" "}
              swap font
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ShuffleIconSm() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}
