# Site audit fixes

## Objective
Fix the findings of the live audit of 2026-10-12 on capsulecodes.com (SEO, i18n leftovers, a11y, perf, data quality).

## Scope and rules
- Single writer, branch `fix/site-audit`. No push, no PR.
- DB writes only for C4 (translations) and C11 (gallery sortOrder), each with a JSON backup of the affected row first; `jsonb_set` on specific keys only; nothing deleted.
- Out of scope: stats/about copy, locale URLs/hreflang, cookie banner, Horus cover.
- TDD: node:test for pure logic (site constants, sitemap builder). Copy-only changes need no tests.
- Prod redirects apex to www with 307 (Vercel domain config, not touched here): consider making it 308/permanent.

## Tasks
- [ ] C1 Canonical host: `lib/site.ts` SITE_URL (www) used by metadataBase, OG, sitemap, robots, project canonicals; home canonical
- [ ] C2 Localize eyebrows, hero chips, "Mobile App" label (es/it)
- [ ] C3 Typos in es/it strings
- [ ] C4 DB: full es/it descriptions for EstudialoAI and HFlow; paste-junk indentation
- [ ] C5 Logo optimization; evaluate `images.unoptimized`
- [ ] C6 /privacy, /terms metadata; /projects h1; 404 title
- [ ] C7 Language switcher aria-label
- [ ] C8 Remove `generator`; sitemap lastmod
- [ ] C9 Detail-page subtitle consistency
- [ ] C10 Heading order; carousel dot target size
- [ ] C11 Festival PRO gallery sortOrder (DB)

## Acceptance
Each item matches the audit description; no regressions in en.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, local smoke (es/it screenshots, canonical/OG, sitemap, logo, subtitles).

## Progress
(see commits)
