# Project cover rendering

Route: delegated writer (single writer, no parallel agents). TDD: node:test (built-in, Node 22 type stripping), no new deps.

## Objective
`projects.image` is now a 1600x1000 (16:10) marketing cover. `images[]` holds screenshots only.
Cards/thumbnails use `image`; carousels and detail gallery use `images[]` screenshots only and never show the cover.

## Tasks
- [x] T1 Pure helpers in `lib/project-media.ts` (getProjectCover, getProjectScreenshots with cover dedupe, getProjectThumb, isPortraitImage, resolvePrimaryImage) + failing tests first (RED) then GREEN
- [x] T2 Wire helpers: projects-carousel (cover thumb 16:10), showcase (screenshots only), detail page (cover hero banner + screenshot-only layout)
- [x] T3 Admin: stop overwriting `image` with images[0] on save/upload/delete (would clobber the cover)
- [x] T4 Checks: lint, tsc, tests, build, Playwright screenshots; PR

## Decisions
- Showcase stays screenshot-only (cover never in a phone frame).
- Dedupe is by `blobKey === image`; if `image` equals a screenshot, the thumb keeps that screenshot's dimensions so legacy mirrored portrait data still renders contained.

## Checks
npm run test, npm run lint, npx tsc --noEmit, npm run build

## Evidence
- RED: `npm test` failed (module missing) before lib/project-media.ts; GREEN: 12/12 pass.
- tsc --noEmit clean; `RESEND_API_KEY=re_dummy npm run build` passes (build needs that env var; unrelated to this change); `npm run lint` is not configured (next lint prompts for ESLint setup).
- Finding: app/projects/[id]/page.tsx redirects to "/", and components/projects-carousel.tsx default export is not mounted, so detail client + carousel are currently dead code; the live surface is the home showcase.
- Playwright screenshots of showcase (desktop HFlow, mobile Investamind) show screenshots only, no cover.
