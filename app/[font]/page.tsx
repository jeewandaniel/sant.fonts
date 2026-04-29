import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FONTS, getFontBySlug, type FontRecord } from "@/lib/fonts";
import { FontDetailClient } from "./FontDetailClient";

const BASE = "https://fonts.sant.co.nz";

/**
 * Build-time generation: emit one HTML page per font in the catalog.
 * Required by `output: 'export'` in next.config.mjs — Next refuses to
 * statically export a dynamic route without a finite param list.
 */
export function generateStaticParams() {
  return FONTS.map((f) => ({ font: f.slug }));
}

/** Per-font SEO metadata: title, description, social cards, canonical. */
export function generateMetadata({
  params,
}: {
  params: { font: string };
}): Metadata {
  const font = getFontBySlug(params.font);
  if (!font) return { title: "Not found — sant.fonts" };

  const title = `${font.family} — free ${font.category} font · sant.fonts`;
  const description = `${font.blurb} ${font.weights.length} weights, ${font.license}, designed by ${font.designer}. Specimen, copy CSS, ship.`;
  const url = `${BASE}/${font.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${font.family} — sant.fonts`,
      description,
      url,
      siteName: "sant.fonts",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${font.family} — sant.fonts`,
      description,
    },
    keywords: [
      font.family,
      `${font.family} font`,
      `${font.family} CSS`,
      `${font.family} download`,
      `${font.category} font`,
      "Google Fonts",
      "open source font",
      "free font",
      `${font.license} font`,
    ],
  };
}

/** Schema.org JSON-LD payload — helps search engines understand what
 *  this page is about and how to surface it as a rich result. */
function fontJsonLd(font: FontRecord) {
  const url = `${BASE}/${font.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${font.family} on sant.fonts`,
    url,
    description: font.blurb,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "sant.fonts", item: BASE },
        {
          "@type": "ListItem",
          position: 2,
          name: font.category,
          item: `${BASE}/?category=${font.category}`,
        },
        { "@type": "ListItem", position: 3, name: font.family, item: url },
      ],
    },
    mainEntity: {
      "@type": "CreativeWork",
      name: font.family,
      alternateName: font.slug,
      author: { "@type": "Person", name: font.designer },
      license:
        font.license === "OFL"
          ? "https://openfontlicense.org/"
          : "https://www.apache.org/licenses/LICENSE-2.0",
      keywords: [font.category, ...(font.subsets ?? [])].join(", "),
      version: font.version,
      datePublished: font.lastModified ?? undefined,
    },
  };
}

export default function Page({ params }: { params: { font: string } }) {
  const font = getFontBySlug(params.font);
  if (!font) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fontJsonLd(font)) }}
      />
      <FontDetailClient font={font} />
    </>
  );
}
