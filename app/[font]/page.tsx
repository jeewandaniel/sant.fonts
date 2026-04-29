import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FONTS, getFontBySlug } from "@/lib/fonts";
import { FontDetailClient } from "./FontDetailClient";

/**
 * Build-time generation: emit one HTML page per font in the catalog.
 * Required by `output: 'export'` in next.config.mjs — Next refuses to
 * statically export a dynamic route without a finite param list.
 */
export function generateStaticParams() {
  return FONTS.map((f) => ({ font: f.slug }));
}

/** Per-font SEO metadata. */
export function generateMetadata({
  params,
}: {
  params: { font: string };
}): Metadata {
  const font = getFontBySlug(params.font);
  if (!font) return { title: "Not found — sant.fonts" };
  return {
    title: `${font.family} — ${font.category} · sant.fonts`,
    description: `${font.blurb} ${font.weights.length} weights · ${font.license} · designed by ${font.designer}.`,
    openGraph: {
      title: `${font.family} on sant.fonts`,
      description: font.blurb,
    },
  };
}

export default function Page({ params }: { params: { font: string } }) {
  const font = getFontBySlug(params.font);
  if (!font) notFound();
  return <FontDetailClient font={font} />;
}
