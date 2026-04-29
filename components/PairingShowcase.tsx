"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FONTS, PAIRINGS, type FontPairing, type FontRecord } from "@/lib/fonts";
import { loadFont } from "@/lib/font-loader";

interface Spread {
  lead: FontRecord;
  pair: FontRecord;
  meta: FontPairing;
}

const ROLES = ["all", "Display", "Body", "Code", "Accent"] as const;
type Role = (typeof ROLES)[number];

// Each composition pulls one item from each pool, indexed by spread idx.
// Together they read as a single mock article opener — eyebrow, headline,
// dek, body paragraphs, continued-on tag — so both fonts appear in their
// natural editorial roles instead of sitting in unrelated columns.

const SECTIONS = ["ESSAY", "FIELD NOTES", "PROFILE", "LETTER", "FEATURE", "INTERVIEW"];

const HEADLINES = [
  "Quiet conversations\non the page.",
  "Form\nand voice.",
  "A grammar\nof type.",
  "Letters looking\nfor their\npartner.",
  "The book\nyou could not\nput down.",
  "Type, paired\nwith intent.",
];

const DEKS = [
  "A typographic essay.",
  "On the discipline of pairing.",
  "An argument in two voices.",
  "Notes for the practising designer.",
  "From the foundry's notebook.",
  "A short field-guide.",
];

const BODY_PARAS: { p1: string; p2: string }[] = [
  {
    p1: "A pairing is the second sentence in a typographic argument. The display sets the voice; the body lets it breathe across paragraphs, captions and code blocks. Treat both ends with the same care.",
    p2: "Choose pairs that share a vertical rhythm even when their personalities differ. The reader's eye should travel from headline to body without feeling the seam.",
  },
  {
    p1: "Contrast in shape, agreement in proportion — that is how a foundry pair earns its keep. Distinct enough to register a switch, related enough to feel of a piece.",
    p2: "When the seam between display and body is invisible to the reader, the typographer has done their work. Look for parents in common.",
  },
  {
    p1: "The eye remembers proportion before it remembers shape. A long-form serif and a clinical sans can sing together if their x-heights and stroke contrasts agree.",
    p2: "Two typefaces drawn under the same constraint will speak the same dialect even when their accents differ. Trust that family resemblance.",
  },
  {
    p1: "A typographic system is a household — display takes the floor, body keeps the lights on, mono whispers in the corner. Each does its work and stays out of the others' way.",
    p2: "Let your display surprise the reader at the door. Let your body keep them in the room. Let your mono answer the questions they did not know they had.",
  },
  {
    p1: "Editorial type is what happens when a designer chooses two voices to tell one story. The reader should never feel the choosing.",
    p2: "Set the headline first. Then set the body. If the page falls flat, you have chosen against yourself — start over and listen more carefully.",
  },
  {
    p1: "The right pair is older than the brief that called for it. It pre-existed in the foundries, in the books on your shelf, in the way you remember reading as a child.",
    p2: "Trust that recognition. Type pairing is taste, then craft. Both can be sharpened, neither can be skipped.",
  },
];

interface Props {
  /** Compact = hero use on /. Full = standalone /pairings page. */
  variant?: "compact" | "full";
}

/**
 * Single-spread pairing shuffler. One pair on screen at a time. Step with
 * arrows, shuffle for serendipity, filter by role. Used as both the home
 * hero (compact) and the /pairings page (full).
 */
export function PairingShowcase({ variant = "compact" }: Props) {
  const [role, setRole] = useState<Role>("all");
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pulse, setPulse] = useState(0);

  const allSpreads = useMemo<Spread[]>(() => {
    const out: Spread[] = [];
    for (const lead of FONTS) {
      const pairs = PAIRINGS[lead.slug] ?? [];
      for (const meta of pairs) {
        const pair = FONTS.find((f) => f.slug === meta.slug);
        if (pair) out.push({ lead, pair, meta });
      }
    }
    return out;
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of allSpreads) c[s.meta.role] = (c[s.meta.role] ?? 0) + 1;
    return c;
  }, [allSpreads]);

  const spreads = useMemo(() => {
    if (role === "all") return allSpreads;
    return allSpreads.filter((s) => s.meta.role === role);
  }, [role, allSpreads]);

  useEffect(() => {
    setIdx((i) => (i >= spreads.length ? 0 : i));
  }, [spreads.length]);

  // Load the lead + pair fonts of whichever spread is currently active.
  // The font-loader dedupes, so cycling through fonts you've already
  // seen costs nothing.
  const activeSpread = spreads[(idx >= spreads.length ? 0 : idx)];
  useEffect(() => {
    if (!activeSpread) return;
    loadFont(activeSpread.lead);
    loadFont(activeSpread.pair);
  }, [activeSpread]);

  const advance = (delta: 1 | -1) => {
    setDirection(delta);
    setIdx((i) => (i + delta + spreads.length) % spreads.length);
    setPulse((p) => p + 1);
  };

  const shuffle = () => {
    if (spreads.length < 2) return;
    let next = idx;
    while (next === idx) next = Math.floor(Math.random() * spreads.length);
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
    setPulse((p) => p + 1);
  };

  // Keyboard nav (only when no input/textarea has focus)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") advance(1);
      else if (e.key === "ArrowLeft") advance(-1);
      else if (e.key === " ") {
        e.preventDefault();
        shuffle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads.length, idx]);

  const spread = spreads[idx];
  const section = spread ? SECTIONS[idx % SECTIONS.length] : "";
  const headline = spread ? HEADLINES[idx % HEADLINES.length] : "";
  const dek = spread ? DEKS[idx % DEKS.length] : "";
  const para = spread ? BODY_PARAS[idx % BODY_PARAS.length] : null;
  const continuedPage = 24 + idx;

  // Sizing scales — compact hero is smaller than the full /pairings spread.
  const leadSize = variant === "compact" ? "clamp(40px, 6.5vw, 80px)" : "clamp(48px, 7vw, 96px)";
  const dekSize = variant === "compact" ? "clamp(18px, 1.7vw, 24px)" : "clamp(20px, 1.9vw, 28px)";
  const bodySize = variant === "compact" ? "clamp(15px, 1.1vw, 17px)" : "clamp(16px, 1.15vw, 18px)";
  const padY = variant === "compact" ? "py-12 md:py-16" : "py-14 md:py-20";

  return (
    <section className="relative border-b border-border-subtle">
      {/* Top control rail */}
      <div className="border-b border-border-subtle">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-y-3 gap-x-6 px-6 py-4 md:px-10">
          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-3 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted md:inline">
              Pairings
            </span>
            {ROLES.map((r) => {
              const active = role === r;
              const count = r === "all" ? allSpreads.length : counts[r] ?? 0;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={[
                    "inline-flex items-baseline gap-2 rounded-full border px-3.5 py-1.5 font-sans text-[12.5px] transition-all",
                    active
                      ? "border-border-accent bg-bg-accent text-accent"
                      : "border-transparent text-text-secondary hover:border-border-default hover:bg-bg-surface hover:text-text-primary",
                  ].join(" ")}
                >
                  <span>{r === "all" ? "All" : r}</span>
                  <span
                    className={[
                      "font-mono text-[10px] tabular-nums",
                      active ? "text-accent/70" : "text-text-faint",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => advance(-1)}
              className="rounded-full border border-border-default px-3 py-1.5 font-mono text-[11px] text-text-secondary hover:border-border-accent hover:text-accent"
              aria-label="Previous pairing"
              title="←"
            >
              ←
            </button>
            <button
              onClick={shuffle}
              className="inline-flex items-center gap-2 rounded-full border border-border-accent bg-bg-accent px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-opacity hover:opacity-90"
              title="space"
            >
              <ShuffleIcon /> Shuffle
            </button>
            <button
              onClick={() => advance(1)}
              className="rounded-full border border-border-default px-3 py-1.5 font-mono text-[11px] text-text-secondary hover:border-border-accent hover:text-accent"
              aria-label="Next pairing"
              title="→"
            >
              →
            </button>
            <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-[0.22em] tabular-nums text-text-faint md:inline">
              {String(idx + 1).padStart(2, "0")} / {String(spreads.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* The active spread.
          Animation is opacity-only (no translate) so the spread cross-fades
          in place — feels closer to the home hero's instant font cycle and
          stops the page reading as if it were sliding on every nav. */}
      {spread ? (
        <div
          key={pulse}
          className="relative"
          style={{
            animation: "showcaseFadeIn 320ms ease-out",
          }}
        >
          <div className={`mx-auto max-w-[1400px] px-6 md:px-10 ${padY}`}>
            {/* THE COMPOSITION — full-bleed mock article opener.
                One consolidated meta rail at the top (pairing identity +
                article fiction), then headline → dek → body → continued →
                foot meta. */}
            <article>
              {/* Single meta rail — folds the pairing chrome (№ + role +
                  linked family names) and the article fiction (section +
                  dateline) into one horizontal strip so we don't get two
                  duplicate-looking mono caps rows stacked. */}
              <div className="mb-10 flex flex-wrap items-baseline justify-between gap-y-2 gap-x-6 border-b border-border-subtle pb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="tabular-nums text-text-faint">
                    №{String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{section}</span>
                  <span className="text-text-faint">·</span>
                  <span>April 2026</span>
                  <span className="text-text-faint">·</span>
                  <span>{spread.meta.role} pair</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <Link href={`/${spread.lead.slug}`} className="text-text-primary hover:text-accent">
                    {spread.lead.family}
                  </Link>
                  <span className="text-text-faint">+</span>
                  <Link href={`/${spread.pair.slug}`} className="text-text-primary hover:text-accent">
                    {spread.pair.family}
                  </Link>
                </div>
              </div>

              {/* Headline + dek — both in the LEAD font.
                  Headline upright, dek italic, separated by a thin rule. */}
              <Link href={`/${spread.lead.slug}`} className="group block">
                <h2
                  className="pb-[0.12em] tracking-tight2 text-text-primary transition-colors group-hover:text-accent"
                  style={{
                    fontFamily: spread.lead.cssFamily,
                    fontSize: leadSize,
                    fontWeight: 400,
                    lineHeight: 1.0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {headline}
                </h2>
                <p
                  className="mt-4 italic text-text-secondary transition-colors group-hover:text-accent"
                  style={{
                    fontFamily: spread.lead.cssFamily,
                    fontSize: dekSize,
                    fontWeight: 300,
                    lineHeight: 1.25,
                  }}
                >
                  &mdash; {dek}
                </p>
              </Link>

              {/* Drop-cap divider */}
              <div className="my-10 flex items-center gap-4">
                <span className="h-px flex-1 bg-border-subtle" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                  ✦
                </span>
                <span className="h-px flex-1 bg-border-subtle" />
              </div>

              {/* Body — paragraphs in the PAIR font.
                  At wide widths, run in two columns so line lengths stay
                  in the comfortable 60-75 character reading band. */}
              {para && (
                <Link href={`/${spread.pair.slug}`} className="group grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
                  <p
                    className="text-text-primary transition-colors group-hover:text-accent"
                    style={{
                      fontFamily: spread.pair.cssFamily,
                      fontSize: bodySize,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    {para.p1}
                  </p>
                  <p
                    className="text-text-primary transition-colors group-hover:text-accent"
                    style={{
                      fontFamily: spread.pair.cssFamily,
                      fontSize: bodySize,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    {para.p2}
                  </p>
                </Link>
              )}

              {/* Continued line — mono italic kicker, like a real article */}
              <div
                className="mt-8 italic text-text-muted"
                style={{
                  fontFamily: spread.pair.cssFamily,
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                &mdash; Continued on page {continuedPage}.
              </div>

              {/* Foot meta — mono caps, names + categories + license */}
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border-subtle pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted md:grid-cols-3">
                <div>
                  <div className="text-text-faint">Lead</div>
                  <Link
                    href={`/${spread.lead.slug}`}
                    className="text-text-primary hover:text-accent"
                  >
                    {spread.lead.family}
                  </Link>
                  <span className="ml-2 text-text-faint">· {spread.lead.category}</span>
                </div>
                <div>
                  <div className="text-text-faint">Body</div>
                  <Link
                    href={`/${spread.pair.slug}`}
                    className="text-text-primary hover:text-accent"
                  >
                    {spread.pair.family}
                  </Link>
                  <span className="ml-2 text-text-faint">· {spread.pair.category}</span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-text-faint">License</div>
                  <span className="text-text-primary">
                    {spread.lead.license} · {spread.pair.license}
                  </span>
                </div>
              </div>
            </article>

            {/* Why this pairs — editorial commentary, sits OUTSIDE the
                composition so it does not break the article fiction. */}
            <div className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-l-2 border-border-accent pl-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                Why this pairs
              </span>
              <p className="flex-1 font-sans text-[14px] italic leading-relaxed text-text-secondary">
                {spread.meta.reason}
              </p>
            </div>

            {/* Keyboard hint — only on the full page */}
            {variant === "full" && (
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                <span>
                  <kbd className="rounded border border-border-default px-1.5 py-0.5">←</kbd>{" "}
                  <kbd className="rounded border border-border-default px-1.5 py-0.5">→</kbd> step
                </span>
                <span>
                  <kbd className="rounded border border-border-default px-1.5 py-0.5">space</kbd>{" "}
                  shuffle
                </span>
                <span className="ml-auto text-text-faint">{allSpreads.length} curated pairs</span>
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes showcaseFadeIn {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>
        </div>
      ) : (
        <div className="mx-auto max-w-[1400px] px-6 py-24 text-center font-sans text-text-muted md:px-10">
          No pairings match that role.
        </div>
      )}
    </section>
  );
}

function ShuffleIcon() {
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
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}
