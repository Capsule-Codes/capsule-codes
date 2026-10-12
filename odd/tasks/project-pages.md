# project-pages

## Objective
Re-enable the project detail pages (`/projects/[id]`) and project cards so each published project's cover (`image`, 16:10) and detail page are visible on the site.

## Why it was disabled (evidence)
- `d3af717` "feat: restyle in projects section" (Marco Galvan) replaced the detail page with `redirect('/')` and swapped the home section for the showcase. No stated reason; the diff only restyled the home section. Not tied to SEO, data or translations.
- `77e240e` parked the `/projects` listing in `app/projects/_disabled` ("until we have enough projects to justify a dedicated page"). There are now 8 published projects (2 have `show_on_home = false`, so they are unreachable today).
- The "View project" link in the showcase was left commented out.
- Reasons still applying: none found. Translations (en/es/it) exist for all rows; RLS has public read.

## Constraints
- Language is client-side (localStorage), no locale routes; server metadata uses English.
- Respect `published`; `/projects` lists all published (ignores `showOnHome`, which only curates the home).
- Keep the home `#projects` anchor and nav behaviour.
- TDD: enabled (source: strict TDD in project config), runner: `npm test` (node:test).
- Route: delegated writer (single writer).

## Tasks
- [x] T1 RED/GREEN pure logic `lib/project-pages.ts` (visibility filter, lookup, metadata builder)
- [x] T2 Re-enable `/projects/[id]` (server fetch, generateMetadata, 404 for unknown/unpublished)
- [x] T3 `/projects` index with cover cards; sitemap entries
- [x] T4 Link showcase items to detail page (i18n label)
- [x] T5 Local verification with Playwright screenshots (1440x900, 390x844)

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, screenshots.

## Progress / evidence
RED observed (module missing) then GREEN: npm test 18/18. tsc clean, build OK. Local prod build (anon read-only key) screenshots reviewed at 1440x900 and 390x844; unknown id returns 404 (required removing the unused Suspense in app/layout.tsx, which forced soft-404 200 responses).
