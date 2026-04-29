import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border-subtle">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-[40px] font-light leading-[1] tracking-tight2 text-text-primary md:text-[64px]">
              Built quietly
              <br />
              <span className="italic text-accent" style={{ fontVariationSettings: "'SOFT' 100" }}>
                in Christchurch.
              </span>
            </h2>
            <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-text-secondary">
              sant.fonts is a free, open library by{" "}
              <a href="https://sant.co.nz" className="text-text-primary underline decoration-border-default underline-offset-4 hover:decoration-accent">
                sant.co.nz
              </a>{" "}
              &mdash; a small studio that makes things on the open web. No accounts. No tracking. Forever free.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <FooterCol
              label="Library"
              links={[
                { label: "Browse all", href: "/" },
                { label: "By designer", href: "/designers" },
                { label: "By license", href: "/licenses" },
                { label: "Submit a font", href: "/submit" },
              ]}
            />
          </div>

          <div className="md:col-span-3">
            <FooterCol
              label="Tools"
              links={[
                { label: "CLI", href: "/cli" },
                { label: "MCP server", href: "/mcp" },
                { label: "API", href: "/api" },
                { label: "GitHub", href: "https://github.com/jeewandaniel/sant.fonts", external: true },
              ]}
            />
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-y-3 border-t border-border-subtle pt-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            sant.fonts &mdash; v0.1 &mdash; April 2026
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            All typefaces under OFL or Apache-2.0
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
        {label}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) =>
          l.external ? (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-[14px] text-text-secondary hover:text-text-primary"
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-sans text-[14px] text-text-secondary hover:text-text-primary"
              >
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
