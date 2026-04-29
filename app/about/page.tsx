import type { Metadata } from "next";
import Link from "next/link";
import { FONTS } from "@/lib/fonts";
import { ProseSection, SimplePage } from "@/components/SimplePage";

export const metadata: Metadata = {
  title: "About — sant.fonts",
  description:
    "A free, zero-account catalog of open-source typography. Specimen, pair, copy CSS — built quietly in Christchurch.",
};

export default function AboutPage() {
  const total = FONTS.length;
  const variableCount = FONTS.filter((f) => f.variable).length;
  return (
    <SimplePage
      eyebrow="About"
      title="A quiet library of"
      italic="open-source type."
      intro={`${total.toLocaleString()} families. Hand-picked editorial pairings. Zero accounts, zero tracking. Specimen everything in your browser, copy a CSS @import, ship.`}
    >
      <ProseSection label="What this is">
        <p>
          <span className="text-text-primary">sant.fonts</span> is a free
          editorial catalog of every open-source typeface on the Google Fonts
          library, presented in a calmer way than the source &mdash; one pair
          at a time, one specimen at a time, and rendered in the actual
          typeface so you see the type, not just its name.
        </p>
        <p>
          Today the catalog spans <span className="text-text-primary">{total.toLocaleString()}</span> families;{" "}
          <span className="text-text-primary">{variableCount.toLocaleString()}</span> ship a variable axis. Every
          family is OFL or Apache-2.0 licensed and free for commercial use.
        </p>
      </ProseSection>

      <ProseSection label="The pairings">
        <p>
          Every catalog site can list typefaces. Few of them tell you what
          to put one beside. The pairings index is hand-curated &mdash; one
          editorial composition at a time, the lead font as the headline,
          the pair as the body. Shuffle for serendipity, filter by role.
        </p>
        <p>
          <Link href="/pairings" className="text-text-primary underline decoration-border-default underline-offset-4 hover:decoration-accent">
            Browse the pairings →
          </Link>
        </p>
      </ProseSection>

      <ProseSection label="Coming next">
        <p>
          A CLI &mdash; <code className="font-mono text-[14px] text-text-primary">npx santfonts search</code> &mdash;
          and an MCP server so an agent like Claude Code can find the right
          typeface without leaving your terminal. Same trick that makes
          sant.icons useful for developers.
        </p>
      </ProseSection>

      <ProseSection label="Built by">
        <p>
          A small studio in <span className="text-text-primary">Christchurch, New Zealand</span> called{" "}
          <a href="https://sant.co.nz" className="text-text-primary underline decoration-border-default underline-offset-4 hover:decoration-accent">
            Sant
          </a>
          . If a font is missing, mis-categorised, or its designer attribution
          is wrong, open an issue on{" "}
          <a
            href="https://github.com/jeewandaniel/sant.fonts"
            target="_blank"
            rel="noreferrer"
            className="text-text-primary underline decoration-border-default underline-offset-4 hover:decoration-accent"
          >
            GitHub
          </a>
          .
        </p>
      </ProseSection>
    </SimplePage>
  );
}
