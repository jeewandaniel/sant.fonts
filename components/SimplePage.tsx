import Link from "next/link";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";

interface Props {
  eyebrow: string;
  title: string;
  italic: string;
  intro: string;
  children: React.ReactNode;
}

/**
 * Editorial chrome shared by /about, /cli, /mcp. Tight max-width,
 * Fraunces headline with a brick-italic accent fragment, then a slot
 * for the page-specific content.
 */
export function SimplePage({ eyebrow, title, italic, intro, children }: Props) {
  return (
    <>
      <TopBar />
      <main>
        <section className="border-b border-border-subtle">
          <div className="mx-auto max-w-[1100px] px-6 pb-12 pt-16 md:px-10 md:pb-20 md:pt-24">
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
              <span className="h-px w-10 bg-border-default" />
              <span>{eyebrow}</span>
            </div>
            <h1 className="font-display text-[clamp(48px,8vw,108px)] font-light leading-[0.98] tracking-tight2 text-text-primary">
              {title}{" "}
              <span
                className="italic text-accent"
                style={{ fontVariationSettings: "'SOFT' 100" }}
              >
                {italic}
              </span>
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-[18px] leading-relaxed text-text-secondary">
              {intro}
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function ProseSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border-subtle pt-10 first:border-t-0 first:pt-0">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
            {label}
          </div>
        </div>
        <div className="md:col-span-9 max-w-[640px] space-y-5 font-sans text-[16px] leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </section>
  );
}

export function CodeBlock({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink-border bg-ink-base">
      <div className="flex items-center justify-between border-b border-ink-border px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          {filename}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          shell
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-ink-text">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function GitHubLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}
