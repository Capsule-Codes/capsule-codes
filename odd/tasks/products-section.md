# products-section

## Objective
Add an "Our products" home section (Stagionaly, Orbys, Elevate) that mirrors how facundopascale.dev presents the company's own products, in en/es/it.

## Constraints
- Static data (`lib/products.ts`), no DB schema change or writes. Covers copied from facundopascale.dev `public/images/work/<slug>/cover.webp` into `public/images/products/`.
- Copy reuses the taglines in facundopascale.dev `src/content/work/{en,es}/*.mdx`; it is neutral professional Italian.
- Honesty: Stagionaly is co-built with Miguel (hotel industry co-founder). Elevate: website live, mobile apps NOT in stores, desktop pre-release.
- TDD: enabled (strict, config), runner `npm test` (node:test). Route: direct inline (small, single section).
- Home stays ISR (`revalidate = 300`).

## Tasks
- [x] T1 RED/GREEN `lib/products.ts` + `lib/products.test.ts` (products, links, locales, honesty, image files)
- [x] T2 i18n strings (`nav.products`, `products.*`) in en/es/it
- [x] T3 `components/products-section.tsx` (cards, Live chip, external links with noopener) placed after projects, before reviews
- [x] T4 Renumber eyebrows (products 06, reviews 07, contact 08); header and footer nav anchors
- [x] T5 Verification: tests, tsc, build, Playwright screenshots (en/es/it at 1440 and 390)

## Acceptance
- Three cards with cover, status chip, tagline, description, tags, link opening in a new tab.
- No English in es/it; no horizontal overflow at 390px; nav anchor `#products` works.

## Checks
`npm test`, `npx tsc --noEmit`, `npm run build` (ISR dot for home), local `next start -p 3100` + screenshots.

## Progress / evidence
RED: products.test.ts failed with module not found; GREEN: npm test 86/86.
