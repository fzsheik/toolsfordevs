# toolsfordevs

Small tools. More headroom.

A loud, friendly side project for developers working with AI coding tools.

## Identity

- Look: neo-brutalist with developer details. Thick ink borders, hard offset shadows, window-chrome title bars on cards, mono labels written like terminal comments.
- Vendor colors: Claude is orange, Codex is blue. Any subtree wrapped in `.v-claude` or `.v-codex` picks up `--vc`, `--on-vc` and `--vc-soft`. Lime is the site's own accent.
- Logo: a terminal prompt in a lime tile with a hard shadow (`src/components/BrandMark.tsx`). Wordmark: lowercase `toolsfordevs`, with `for` in a quieter tone.
- Type: Bricolage Grotesque for headings, Figtree for body, JetBrains Mono for labels (all via `next/font/google`).
- Links have no underline. Hover highlights them in lime.
- Voice: useful, direct, a little human. Distinguish logged events from estimates.

## Palette

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#eef0ff` | `#0f0d1a` |
| Ink / borders | `#0f0d1a` | `#f1eeff` |
| Secondary text | `#5b5878` | `#a7a3c8` |
| Surface | `#ffffff` | `#1a1730` |
| Claude | `#ff7a3d` | same |
| Codex | `#3d5afe` | same |
| Accent (lime) | `#c8f43a` | same |
| Highlight (pink) | `#ff5fa2` | same |

## Assets

- `public/brand/logo.svg`: scalable standalone mark.
- `public/brand/wordmark.svg`: horizontal logo on a transparent background, for light surfaces.
- `public/brand/icon-192.png` and `icon-512.png`: app icons.
- `src/app/favicon.ico`: 16, 32, and 48 px browser icons.
- `src/app/icon.svg`: scalable browser icon.
- `src/app/apple-icon.png`: 180 px touch icon.

Regenerate raster icons with `node scripts/generate-brand-assets.mjs` after editing `public/brand/logo.svg`. Keep `src/lib/brand.ts` and the SVG wordmark in sync with changes to the mark or palette.

Social previews use the shared `src/lib/og.tsx` layout at 1200 × 630, with a local sans font. The home page, vendor pages, and individual events each supply their own text. Preview `/opengraph-image`, `/claude-reset/opengraph-image`, or any event URL followed by `/opengraph-image`.
