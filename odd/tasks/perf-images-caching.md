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
- [x] P0 Branch, baseline numbers (this file)
- [x] P1 Right-sized images (decision below)
- [x] P2 ISR: locale from the route, cached data, on-demand revalidation
- [x] P3 Verify and record after numbers

## Decisions

### Images: Next/Vercel optimizer (option a), not Supabase render
- Supabase `/render/image` works on this project (HTTP 200, 60 KB -> 31 KB at width 640), but needs a custom loader, bills per unique origin image beyond the plan quota, and gives no AVIF.
- `next/image` was already used for most gallery images; only `unoptimized: true` defeated it. Enabled the optimizer (`remotePatterns` for `*.supabase.co/storage/v1/object/public/**`, AVIF/WebP, 30 day `minimumCacheTTL` because uploads are uuid-named and immutable) and migrated the remaining plain `<img>` (project cards, team and review avatars) via `SiteImage`.
- `SiteImage` falls back to `unoptimized` for hosts outside `remotePatterns` (`lib/image-src.ts`, tested) so legacy external URLs do not throw.
- Quota: Vercel image optimization counts unique source images x transformations; this site has about 100 source images, far below the Pro included quota.
- `sizes` set per layout (card grid, 200 px phone frames, detail gallery, 52/44 px avatars); lightbox keeps `100vw` (larger size). `priority` only on the detail hero (or the first gallery image when there is no cover); showcase carousel no longer preloads below the fold.

### ISR
- `app/layout.tsx` removed. `app/[locale]/layout.tsx` is the root layout of the public site (`<html lang>` from the route param, `generateStaticParams` for en/es/it, per-locale metadata); `app/admin/layout.tsx` is a second root layout (English, noindex). Both render the shared `components/app-document.tsx`. The middleware keeps rewriting unprefixed paths to `/en`, 308s `/en/*`, and no longer sets `x-locale`.
- Reads in `lib/server/data.ts` use `unstable_cache` with per-resource tags (`lib/cache-tags.ts`), revalidate 300 s. They throw on DB errors so a failed regeneration keeps the last good page instead of caching an empty one.
- All admin write handlers (`app/api/admin/**`, 13 files) are wrapped with `revalidating([...])`: after a 2xx response they call `revalidateTag` and `revalidatePath('/[locale]', 'layout')`. Logic tested with fakes (`lib/cache-tags.test.ts`).
- Project detail: `generateStaticParams` (published x locales), `dynamicParams = true`.
- Not-found: a root `app/not-found.tsx` is impossible without a shared root layout (Next 14.2: "not-found.tsx doesn't have a root layout"), so it was dropped. A page-level `notFound()` answers 404 + noindex but the initial HTML is Next's client shell (`<html id="__next_error__">`) which hydrates into the localized 404. Reproduced on a minimal stock Next 14.2.35 app (static and force-dynamic) and on `main`: framework behaviour, not caused by this change.

## Results (same local conditions)
| Page | Perf | LCP | Image bytes (requests) |
|---|---|---|---|
| `/` | 80 -> 90 | 4.8 -> 3.5 s | 219,552 (5) -> 38,806 (1) |
| `/es` | 82 -> 89 | 4.7 -> 3.8 s | 219,567 -> 38,805 |
| phone project | 81 -> 91 | 5.2 -> 3.5 s | 675,495 (9) -> 259,920 (9) |
| HFlow | 88 -> 89 | 3.9 -> 3.8 s | 560,414 (12) -> 158,861 (12) |

Home Speed Index 4560 -> 1390 ms. Build: public pages `ƒ` -> `●` (24 project pages prerendered). Local `next start`: HTML of `/`, `/es`, `/it/projects/<id>`, `/es/privacy` is `x-nextjs-cache: HIT`, TTFB 3-6 ms (was 0.3-2 s dynamic render). After calling the revalidation logic from a temporary route, pages went `MISS` then `HIT` again.
