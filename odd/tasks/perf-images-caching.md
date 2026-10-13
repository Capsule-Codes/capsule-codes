# Performance: right-sized images and cached HTML

## Objective
Cut mobile load time of the public site: serve every Supabase image at the size it is rendered, and serve public HTML from the Vercel cache (ISR) instead of rendering every request.

## Problem (baseline, measured)
- `images.unoptimized: true` in `next.config.mjs`: `next/image` and plain `<img>` download the stored file at full size.
- Root layout reads the `x-locale` header (`headers()`), which makes every page dynamic: `x-vercel-cache: MISS`, TTFB 0.3-0.5 s on production.

Local baseline (`next build && next start -p 3100`, Lighthouse 12 mobile preset, performance only, public Supabase data, Chrome headless). Prod and local differ; compare before/after under the same conditions.

| Page | Perf | LCP | Image requests | Image bytes | Total bytes |
|---|---|---|---|---|---|
| `/` | 80 | 4.8 s | 5 | 219,552 | 636,554 |
| `/es` | 82 | 4.7 s | 5 | 219,567 | 636,946 |
| `/projects/<Investamind, phone>` | 81 | 5.2 s | 9 | 675,495 | 1,041,057 |
| `/projects/<HFlow>` | 88 | 3.9 s | 12 | 560,414 | 926,135 |

Local build: every public page is `ƒ` (dynamic). Lighthouse only counts images that load (lazy ones below the fold are not requested).

## Tasks
- [ ] P0 Branch, baseline numbers (this file)
- [ ] P1 Right-sized images (decision below)
- [ ] P2 ISR: locale from the route, cached data, on-demand revalidation
- [ ] P3 Verify and record after numbers

## Decisions
