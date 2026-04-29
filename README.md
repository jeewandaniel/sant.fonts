# sant.fonts

A free, editorial catalog of open-source typography. **[fonts.sant.co.nz](https://fonts.sant.co.nz)**

- 1,938 OFL / Apache-2.0 families pulled from the Google Fonts library
- Hand-curated editorial pairings, one composition at a time
- Live custom-text specimen + variable-axis support
- Static export — deployed as plain HTML/CSS/JS to Vercel free tier
- Built quietly in Christchurch by [Sant](https://sant.co.nz)

## Stack

- Next.js 14 (App Router) — `output: 'export'` static
- Tailwind CSS + CSS variables for the editorial palette
- Fuse.js for client-side search
- `@tanstack/react-virtual` for the catalog grid
- Google Fonts CSS API loaded dynamically (one `<link>` per visible font)

## Local development

```bash
pnpm install
pnpm dev   # https://fonts.localhost:1355 via portless
```

## Refresh the catalog

The catalog is shipped as a JSON manifest at `public/fonts.json`. Re-run the ingestion when Google Fonts adds new families:

```bash
GOOGLE_FONTS_API_KEY=xxx pnpm ingest
```

The script fetches the full Web Fonts Developer API response, normalises into `FontRecord` shape, and writes the manifest. Hand-curated overrides (designers, editorial blurbs) live in `scripts/ingest.mjs`.

## Build

```bash
pnpm build
```

Generates one static HTML page per font (~1,940 routes) into `out/`.

## Coming next

- `@santfonts/cli` — terminal-first companion
- `@santfonts/mcp` — Model Context Protocol server for Claude Code / Cursor

## License

Code under MIT. The fonts themselves are OFL or Apache-2.0 — see each typeface's detail page.
