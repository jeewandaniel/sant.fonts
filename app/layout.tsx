import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://fonts.sant.co.nz";
const SITE_NAME = "sant.fonts";
const SITE_TITLE = "sant.fonts — 1,900+ free open-source fonts with curated pairings";
const SITE_DESC =
  "A free editorial catalog of every open-source typeface on the Google Fonts library. Hand-curated pairings, live custom-text specimen, copy CSS @import, ship. Zero accounts, zero tracking.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · sant.fonts",
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: "Sant", url: "https://sant.co.nz" }],
  creator: "Sant",
  publisher: "Sant",
  keywords: [
    "free fonts",
    "open source fonts",
    "Google Fonts",
    "font pairings",
    "typography",
    "OFL",
    "Apache 2.0",
    "web fonts",
    "font catalog",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "en_NZ",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  publisher: {
    "@type": "Organization",
    name: "Sant",
    url: "https://sant.co.nz",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnects only — actual font CSS is injected on demand by
            lib/font-loader.ts so we don't preload all ~1900 families. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
      </head>
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
