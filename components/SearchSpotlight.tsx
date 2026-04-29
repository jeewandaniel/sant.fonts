"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchFonts, type SearchHit } from "@/lib/search";
import { loadFonts } from "@/lib/font-loader";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Centered command-palette overlay. Triggered by `/` or `Cmd+K` from
 * anywhere on the site. Type to filter ~1,900 families; ↑↓ moves the
 * highlight, Enter navigates to the highlighted font's detail page.
 */
export function SearchSpotlight({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const hits: SearchHit[] = useMemo(() => searchFonts(q, 12), [q]);

  // Lazy-load each visible result so the family name renders in its own
  // typeface in the list, not the fallback.
  useEffect(() => {
    if (!open) return;
    loadFonts(hits.map((h) => h.font));
  }, [hits, open]);

  // Reset state every time the overlay opens.
  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      // requestAnimationFrame so the input is focused after the overlay
      // is actually mounted.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Clamp the highlight when results shrink.
  useEffect(() => {
    if (active >= hits.length) setActive(0);
  }, [hits.length, active]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc / nav keys.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, hits.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const hit = hits[active];
        if (hit) {
          router.push(`/${hit.font.slug}`);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hits, active, onClose, router]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg-base/70 px-4 pt-[14vh] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] overflow-hidden rounded-xl border border-border-default bg-bg-base shadow-2xl"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-4">
          <SearchGlyph />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${(1938).toLocaleString()} typefaces…`}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent font-sans text-[16px] text-text-primary placeholder:text-text-faint focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded border border-border-subtle px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
          >
            esc
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {hits.length === 0 ? (
            <div className="px-5 py-8 font-sans text-[14px] text-text-muted">
              No matches for &ldquo;{q}&rdquo;.
            </div>
          ) : (
            <ul role="listbox">
              {hits.map((h, i) => (
                <li key={h.font.slug}>
                  <Link
                    href={`/${h.font.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    className={[
                      "flex items-baseline justify-between gap-4 px-5 py-3 transition-colors",
                      i === active
                        ? "bg-bg-hover"
                        : "hover:bg-bg-surface",
                    ].join(" ")}
                  >
                    <span className="flex items-baseline gap-4">
                      <span
                        className="text-[20px] leading-none text-text-primary"
                        style={{
                          fontFamily: h.font.cssFamily,
                          fontWeight: 400,
                        }}
                      >
                        {h.font.family}
                      </span>
                      <span className="font-sans text-[12px] text-text-muted">
                        by {h.font.designer}
                      </span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
                      {h.font.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="rounded border border-border-subtle px-1.5 py-0.5">↑</kbd>{" "}
              <kbd className="rounded border border-border-subtle px-1.5 py-0.5">↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded border border-border-subtle px-1.5 py-0.5">↵</kbd> open
            </span>
          </div>
          <div className="text-text-faint">{hits.length} matches</div>
        </div>
      </div>
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted shrink-0"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
