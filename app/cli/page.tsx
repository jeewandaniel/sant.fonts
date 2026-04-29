import type { Metadata } from "next";
import { CodeBlock, GitHubLink, ProseSection, SimplePage } from "@/components/SimplePage";

export const metadata: Metadata = {
  title: "CLI — sant.fonts",
  description:
    "A terminal-first companion to the sant.fonts catalog. Search, fetch CSS, install pairings — without leaving your editor.",
};

export default function CliPage() {
  return (
    <SimplePage
      eyebrow="CLI · coming soon"
      title="Find a font"
      italic="without leaving your terminal."
      intro="A small Node CLI that wraps the catalog. Search by name, by category, by pairing role. Print a CSS @import to stdout, or write it straight to your stylesheet."
    >
      <ProseSection label="Install">
        <CodeBlock filename="terminal">{`npx @santfonts/cli search "serif"`}</CodeBlock>
      </ProseSection>

      <ProseSection label="What it does">
        <p>The CLI exposes the same catalog the website uses, in three commands:</p>
        <CodeBlock filename="terminal">{`# search the catalog
santfonts search "modern sans"

# print the CSS @import for one family
santfonts get inter --weights 400,600 --subset latin

# show curated pairings for a family
santfonts pairs fraunces`}</CodeBlock>
        <p>
          Output is plain text by default; pass <code className="font-mono text-[14px] text-text-primary">--json</code>{" "}
          for tooling. Bundled offline manifest so it works on a plane.
        </p>
      </ProseSection>

      <ProseSection label="Status">
        <p>
          Not published yet &mdash; the catalog ingestion just landed and
          we&rsquo;re wiring the package next. Watch the GitHub repo for the
          <code className="font-mono text-[14px] text-text-primary"> v0.1</code> release.
        </p>
        <p>
          <GitHubLink href="https://github.com/jeewandaniel/sant.fonts">
            jeewandaniel/sant.fonts →
          </GitHubLink>
        </p>
      </ProseSection>
    </SimplePage>
  );
}
