import type { MetadataRoute } from "next";
import { FONTS } from "@/lib/fonts";

const BASE = "https://fonts.sant.co.nz";

/**
 * One sitemap covering every static route. With 1,900-odd entries we are
 * comfortably under Google's 50,000-URL-per-file limit, so a single file
 * is fine — no chunking needed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/pairings`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/cli`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/mcp`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const fontRoutes: MetadataRoute.Sitemap = FONTS.map((f) => ({
    url: `${BASE}/${f.slug}`,
    // Use the family's Google Fonts lastModified when present; otherwise fall back to today.
    lastModified: f.lastModified ? new Date(f.lastModified) : now,
    changeFrequency: "monthly",
    // Bias by popularity rank so the canonical popular families are prioritised.
    priority: f.rank < 50 ? 0.9 : f.rank < 200 ? 0.7 : 0.5,
  }));

  return [...staticRoutes, ...fontRoutes];
}
