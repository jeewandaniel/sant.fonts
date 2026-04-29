"use client";

import { CATEGORIES, type FontCategory } from "@/lib/fonts";

interface Props {
  active: FontCategory | "all";
  onChange: (id: FontCategory | "all") => void;
  counts: Record<string, number>;
  total: number;
}

export function FilterPills({ active, onChange, counts, total }: Props) {
  return (
    <div className="sticky top-14 z-20 -mx-6 border-b border-border-subtle bg-bg-base/85 px-6 backdrop-blur-md md:-mx-10 md:px-10">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-wrap items-center gap-1">
          {CATEGORIES.map((c) => {
            const isActive = active === c.id;
            const count = c.id === "all" ? total : counts[c.id] ?? 0;
            return (
              <button
                key={c.id}
                onClick={() => onChange(c.id)}
                className={[
                  "group inline-flex items-baseline gap-2 rounded-full border px-4 py-1.5 font-sans text-[13px] transition-all",
                  isActive
                    ? "border-border-accent bg-bg-accent text-accent"
                    : "border-transparent text-text-secondary hover:border-border-default hover:bg-bg-surface hover:text-text-primary",
                ].join(" ")}
              >
                <span>{c.label}</span>
                <span
                  className={[
                    "font-mono text-[10px] tabular-nums tracking-tight",
                    isActive ? "text-accent/70" : "text-text-faint",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted md:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span>live preview</span>
        </div>
      </div>
    </div>
  );
}
