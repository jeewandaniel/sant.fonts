"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FONTS, getPairings, type FontRecord } from "@/lib/fonts";
import { loadFont, loadFonts } from "@/lib/font-loader";
import { nextPhrase } from "@/lib/phrases";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";

const SAMPLES = [
  "The quick brown fox jumps over the lazy dog.",
  "Whereas recognition of the inherent dignity",
  "Forty-two is the answer.",
  "Type is the voice of the page.",
];

const CHARS = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789  & @ $ £ € ¥",
  "! ? . , ; : / \\ | ( ) [ ] { } < >",
];

const BODY_LOREM =
  "Type is the voice of the page. A typeface paired well becomes a system — display and body holding hands across paragraphs, captions, code blocks. Specimen them next to each other before you commit.";

export function FontDetailClient({ font }: { font: FontRecord }) {
  const [customText, setCustomText] = useState("");
  const [size, setSize] = useState(140);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const pairings = useMemo(() => getPairings(font.slug), [font.slug]);
  const others = useMemo(
    () => FONTS.filter((f) => f.slug !== font.slug).slice(0, 4),
    [font.slug],
  );

  // Load the lead font + every font this page renders (pair fonts + the
  // 4 'See also' tiles) so they show in their own typeface, not fallback.
  useEffect(() => {
    loadFont(font);
    loadFonts(pairings.map((p) => p.font));
    loadFonts(others);
  }, [font, pairings, others]);

  const showPlaceholder = !customText && !focused;

  const cssSnippet = `@import url("https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, "+")}:wght@${font.weights[0]}..${font.weights[font.weights.length - 1]}&display=swap");

body {
  font-family: ${font.cssFamily};
  font-weight: 400;
}`;

  return (
    <>
      <TopBar />

      {/* Breadcrumb */}
      <div className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted md:px-10">
          <Link href="/" className="hover:text-text-primary">
            Library
          </Link>
          <span className="text-text-faint">/</span>
          <span>{font.category}</span>
          <span className="text-text-faint">/</span>
          <span className="text-text-primary">{font.family}</span>
        </div>
      </div>

      {/* Hero — family name set in its own typeface */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-16 md:px-10 md:pb-20 md:pt-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                <span className="rounded-full border border-border-default px-3 py-1">
                  {font.category}
                </span>
                {font.variable && (
                  <span className="rounded-full border border-border-accent bg-bg-accent px-3 py-1 text-accent">
                    variable
                  </span>
                )}
                <span className="text-text-faint">{font.license}</span>
              </div>
              <h1
                className="pb-[0.1em] font-display text-[clamp(64px,10vw,180px)] font-light leading-[0.95] tracking-tight2 text-text-primary"
                style={{ fontFamily: font.cssFamily }}
              >
                {font.family}
              </h1>
              <p className="mt-8 max-w-xl font-sans text-[18px] leading-relaxed text-text-secondary">
                {font.blurb} Designed by{" "}
                <span className="text-text-primary">{font.designer}</span>.
              </p>
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <DataRow label="Designer" value={font.designer} />
              <DataRow label="Family" value={font.family} />
              <DataRow label="Category" value={font.category} />
              <DataRow
                label="Weights"
                value={font.weights.map((w) => w).join(" · ")}
              />
              <DataRow label="Variable" value={font.variable ? "Yes" : "No"} />
              <DataRow label="License" value={font.license} />
            </div>
          </div>
        </div>
      </section>

      {/* Specimen — click-to-edit huge headline */}
      <section className="border-b border-border-subtle bg-bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-y-3">
            <SectionLabel>The Specimen</SectionLabel>
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setCustomText(nextPhrase(customText))}
                className="inline-flex items-center gap-2 rounded-full border border-border-default px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary transition-colors hover:border-border-accent hover:text-accent"
              >
                <RefreshIcon />
                Try a phrase
              </button>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                Size
              </div>
              <input
                type="range"
                min={64}
                max={260}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="h-1 w-40 cursor-pointer accent-accent md:w-64"
              />
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted tabular-nums">
                {size}px
              </div>
              {customText && (
                <button
                  onClick={() => {
                    setCustomText("");
                    inputRef.current?.focus();
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted hover:text-accent"
                >
                  clear
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              onClick={() => inputRef.current?.focus()}
              className={[
                "min-h-[40vh] cursor-text break-words pb-[0.18em] tracking-tight2 transition-colors",
                showPlaceholder ? "text-text-faint italic" : "text-text-primary",
              ].join(" ")}
              style={{
                fontFamily: font.cssFamily,
                fontSize: `clamp(56px, ${size / 1.05}px, 240px)`,
                fontWeight: 400,
                lineHeight: 1.05,
                fontStyle: showPlaceholder ? "italic" : "normal",
              }}
            >
              {showPlaceholder ? "Type your own…" : customText}
              {focused && (
                <span className="ml-1 inline-block h-[0.85em] w-[0.04em] -translate-y-[0.1em] animate-pulse bg-accent align-middle" />
              )}
            </div>

            <textarea
              ref={inputRef}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={1}
              spellCheck={false}
              aria-label={`Type to specimen ${font.family}`}
              className="absolute inset-0 h-full w-full resize-none bg-transparent text-transparent caret-transparent focus:outline-none"
              style={{ caretColor: "transparent" }}
            />
          </div>
        </div>
      </section>

      {/* Weight ladder */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <SectionLabel>Weights</SectionLabel>

          <div className="divide-y divide-border-subtle">
            {font.weights.map((w, i) => (
              <div
                key={w}
                className="grid grid-cols-12 items-baseline gap-4 py-6 md:py-8"
              >
                <div className="col-span-2 md:col-span-1 font-mono text-[11px] tabular-nums text-text-muted">
                  {w}
                </div>
                <div className="col-span-2 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  {weightLabel(w)}
                </div>
                <div
                  className="col-span-8 truncate pb-[0.1em] leading-[1.1] text-text-primary md:col-span-9"
                  style={{
                    fontFamily: font.cssFamily,
                    fontWeight: w,
                    fontSize: "clamp(28px, 4.5vw, 60px)",
                  }}
                >
                  {SAMPLES[i % SAMPLES.length]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Character set */}
      <section className="border-b border-border-subtle bg-bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <SectionLabel>Character set</SectionLabel>
          <div
            className="space-y-6"
            style={{ fontFamily: font.cssFamily, fontWeight: 400 }}
          >
            {CHARS.map((row) => (
              <div
                key={row}
                className="pb-[0.1em] leading-[1.1] tracking-tight2 text-text-primary"
                style={{ fontSize: "clamp(28px, 4.5vw, 52px)" }}
              >
                {row}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pairings */}
      {pairings.length > 0 && (
        <section className="border-b border-border-subtle">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
              <SectionLabel>Pairs well with</SectionLabel>
              <p className="max-w-md font-sans text-[14px] text-text-secondary">
                Editorial pairings &mdash; <span className="text-text-primary">{font.family}</span> as the lead voice,
                supported below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden border border-border-subtle bg-border-subtle md:grid-cols-3">
              {pairings.map(({ font: pair, pair: meta }) => (
                <Link
                  key={pair.slug}
                  href={`/${pair.slug}`}
                  className="group relative flex flex-col bg-bg-base p-7 transition-colors hover:bg-bg-hover md:p-9"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                      Use as {meta.role}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-faint">
                      {pair.category}
                    </span>
                  </div>

                  <div
                    className="pb-[0.1em] leading-[0.95] tracking-tight2 text-text-primary transition-colors group-hover:text-accent"
                    style={{
                      fontFamily: font.cssFamily,
                      fontSize: "clamp(36px, 4.5vw, 64px)",
                      fontWeight: 400,
                    }}
                  >
                    {font.family}
                  </div>

                  <div
                    className="mt-1 leading-[1] tracking-tight2 text-text-secondary"
                    style={{
                      fontFamily: pair.cssFamily,
                      fontSize: "clamp(20px, 2.6vw, 32px)",
                      fontWeight: 400,
                    }}
                  >
                    + {pair.family}
                  </div>

                  <p
                    className="mt-7 line-clamp-3 text-text-secondary"
                    style={{
                      fontFamily: pair.cssFamily,
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {BODY_LOREM}
                  </p>

                  <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-border-subtle pt-5">
                    <p className="font-sans text-[12.5px] italic leading-relaxed text-text-muted">
                      {meta.reason}
                    </p>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint transition-colors group-hover:text-accent">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Use it — code block (ALWAYS dark) */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <SectionLabel>Use it</SectionLabel>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h3 className="font-display text-[36px] font-light leading-[1.05] tracking-tight2 text-text-primary md:text-[44px]">
                Drop in. Ship.
              </h3>
              <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-text-secondary">
                Three lines of CSS. No build step, no font-loading library, no
                FOIT. Cached on Google Fonts CDN.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-sans text-[13px] font-medium text-white transition-opacity hover:opacity-90">
                  Copy CSS
                  <CopyIcon />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border-default bg-transparent px-5 py-2.5 font-sans text-[13px] text-text-primary transition-colors hover:bg-bg-hover">
                  Download .ttf
                </button>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="overflow-hidden rounded-lg border border-ink-border bg-ink-base">
                <div className="flex items-center justify-between border-b border-ink-border px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                    style.css
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                    css
                  </span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-ink-text">
                  <code>{cssSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See also */}
      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <SectionLabel>You might also like</SectionLabel>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className="group block border-t border-border-subtle pt-6 transition-colors hover:border-border-accent"
              >
                <div
                  className="pb-1 text-[64px] leading-none tracking-tight2 text-text-primary transition-colors group-hover:text-accent"
                  style={{ fontFamily: o.cssFamily }}
                >
                  Aa
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="font-display text-[15px] font-medium text-text-primary">
                    {o.family}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    {o.category}
                  </span>
                </div>
                <p className="mt-1 font-sans text-[12px] text-text-muted">
                  by {o.designer}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
      <span className="h-px w-10 bg-border-default" />
      <span>{children}</span>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 items-baseline gap-4 border-b border-border-subtle py-3">
      <div className="col-span-5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
        {label}
      </div>
      <div className="col-span-7 font-sans text-[13px] text-text-primary">
        {value}
      </div>
    </div>
  );
}

function weightLabel(w: number) {
  return (
    {
      100: "Thin",
      200: "ExtraLight",
      300: "Light",
      400: "Regular",
      500: "Medium",
      600: "SemiBold",
      700: "Bold",
      800: "ExtraBold",
      900: "Black",
    }[w] ?? `${w}`
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

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
