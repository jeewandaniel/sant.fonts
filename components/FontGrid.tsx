"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { FONTS, type FontCategory, type FontRecord } from "@/lib/fonts";
import { FontCard } from "./FontCard";
import { FilterPills } from "./FilterPills";

interface Props {
  customText: string;
  size: number;
}

/**
 * Virtualised catalog grid. Only the rows currently inside (or within
 * the overscan band of) the viewport are rendered to the DOM, so we
 * stay performant at the full ~1,900-family scale.
 *
 * Each row is one full-bleed editorial FontCard. Heights vary because of
 * the dynamic `size` prop and viewport width, so we use measureElement
 * for accurate dynamic measurement.
 */
export function FontGrid({ customText, size }: Props) {
  const [active, setActive] = useState<FontCategory | "all">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FONTS) c[f.category] = (c[f.category] ?? 0) + 1;
    return c;
  }, []);

  // Filter by category, sort by popularity rank.
  const filtered: FontRecord[] = useMemo(() => {
    const list = active === "all" ? FONTS : FONTS.filter((f) => f.category === active);
    return [...list].sort((a, b) => a.rank - b.rank);
  }, [active]);

  // Track the offset of the scroll container relative to the document
  // so the virtualizer knows where the grid starts.
  const [scrollMargin, setScrollMargin] = useState(0);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      setScrollMargin(rect.top + window.scrollY);
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(node);
    window.addEventListener("resize", update);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Estimated row height. Real heights come back via measureElement.
  // ~520 is a reasonable mid-point: meta row + giant specimen + footer.
  const virtualizer = useWindowVirtualizer({
    count: filtered.length,
    estimateSize: () => 520,
    overscan: 3,
    scrollMargin,
  });

  // Force a re-measure when the size prop changes (cards grow/shrink
  // with the global font-size slider, but we don't have that here yet —
  // future-proofing).
  useEffect(() => {
    virtualizer.measure();
  }, [size, virtualizer]);

  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10">
      <FilterPills
        active={active}
        onChange={setActive}
        counts={counts}
        total={FONTS.length}
      />

      <div ref={containerRef} className="-mx-6 md:-mx-10">
        <div
          style={{
            height: `${totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {items.map((vi) => {
            const font = filtered[vi.index];
            if (!font) return null;
            return (
              <div
                key={font.slug}
                data-index={vi.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vi.start - virtualizer.options.scrollMargin}px)`,
                }}
              >
                <FontCard
                  font={font}
                  customText={customText}
                  size={size}
                  index={vi.index}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center px-6 py-16 md:px-10 md:py-20 font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint">
          <span>{filtered.length.toLocaleString()} curated families · End of catalog</span>
        </div>
      </div>
    </section>
  );
}
