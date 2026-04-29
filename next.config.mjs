/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Full static export — all ~1,940 font detail pages are prerendered at
  // build time. Deploys as plain HTML/CSS/JS to any static host (Vercel
  // free tier, Cloudflare Pages, GitHub Pages, etc).
  output: "export",
  trailingSlash: true,
  images: {
    // Static export forbids the Next image optimiser; use unoptimized so
    // any next/image usage keeps working as plain <img>.
    unoptimized: true,
  },
};

export default nextConfig;
