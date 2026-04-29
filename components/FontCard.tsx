"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPairings, type FontRecord } from "@/lib/fonts";
import { loadFont } from "@/lib/font-loader";

interface Props {
  font: FontRecord;
  customText: string;
  size: number;
  index: number;
}

export function FontCard({ font, customText, size, index }: Props) {
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const display = customText.trim() || font.pangram;
  const num = String(index + 1).padStart(2, "0");
  const primaryPair = useMemo(() => getPairings(font.slug)[0], [font.slug]);

  // Lazy-load this font when the card scrolls within ~600px of the
  // viewport. The first 5-10 cards on the home page hit visible=true
  // almost immediately; the long tail is loaded on demand as the user
  // scrolls. Single IntersectionObserver per card — cheap.
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            loadFont(font);
            obs.disconnect();
            return;
          }
        }
      },
      { rootMargin: "600px 0px 600px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [font]);

  return (
    <Link
      ref={cardRef}
      href={`/${font.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative block border-t border-border-subtle py-10 transition-colors hover:bg-bg-surface md:py-14"
    >
      {/* meta — top row */}
      <div className="mb-7 flex items-baseline justify-between gap-6 px-6 md:px-10">
        <div className="flex items-baseline gap-5">
          <span className="font-mono text-[11px] tabular-nums text-text-faint">№{num}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
            {font.category}
          </span>
        </div>
        <div className="flex items-baseline gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          <span className="hidden md:inline">{font.weights.length} weights</span>
          {font.variable && (
            <span className="hidden text-accent md:inline">variable</span>
          )}
          <span className="text-text-faint">{font.license}</span>
        </div>
      </div>

      {/* the specimen — full bleed. leading + pb keeps descenders (g, p, y) from clipping. */}
      <div className="overflow-x-hidden px-6 md:px-10">
        <div
          className="pb-[0.18em] tracking-tight2 text-text-primary transition-colors group-hover:text-accent"
          style={{
            fontFamily: font.cssFamily,
            fontSize: `${size}px`,
            fontWeight: font.category === "display" ? 500 : 400,
            lineHeight: 1.1,
          }}
        >
          {display}
        </div>
      </div>

      {/* footer — name + designer + primary pair */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 md:px-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h3
            className="font-display text-[26px] font-medium leading-none tracking-tight2 text-text-primary md:text-[30px]"
            style={{ fontFamily: font.cssFamily }}
          >
            {font.family}
          </h3>
          <span className="font-sans text-[13px] text-text-muted">
            by {font.designer}
          </span>
          {primaryPair && (
            <span className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
              <span className="text-border-default">/</span>
              <span>pairs with</span>
              <span
                className="text-text-secondary"
                style={{
                  fontFamily: primaryPair.font.cssFamily,
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: "13px",
                }}
              >
                {primaryPair.font.family}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-5">
          <span
            className={[
              "font-sans text-[13px] italic text-text-secondary transition-opacity",
              hover ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {font.blurb}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-faint transition-colors group-hover:text-accent">
            View
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
