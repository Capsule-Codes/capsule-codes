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
- [x] C1 Canonical host: `lib/site.ts` SITE_URL (www) used by metadataBase, OG, sitemap, robots, project canonicals; home canonical
- [x] C2 Localize eyebrows, hero chips, "Mobile App" label (es/it)
- [x] C3 Typos in es/it strings
- [x] C4 DB: full es/it descriptions for EstudialoAI and HFlow; paste-junk indentation
- [x] C5 Logo optimization; evaluate `images.unoptimized`
- [x] C6 /privacy, /terms metadata; /projects h1; 404 title
- [x] C7 Language switcher aria-label
- [x] C8 Remove `generator`; sitemap lastmod
- [x] C9 Detail-page subtitle consistency
- [x] C10 Heading order; carousel dot target size
- [x] C11 Festival PRO gallery sortOrder (DB)

## Acceptance
Each item matches the audit description; no regressions in en.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, local smoke (es/it screenshots, canonical/OG, sitemap, logo, subtitles).

## Progress
- C1/C8 RED: `npm test` failed with ERR_MODULE_NOT_FOUND for `lib/site.ts`; GREEN after `lib/site.ts` + `lib/sitemap-entries.ts` (new `lib/site.test.ts`, `lib/sitemap-entries.test.ts` in the `test` script). `app/robots.ts` replaces `public/robots.txt`.
- C9 RED: `resolveProjectSubtitle` missing; GREEN. Cause: Horus/UR POV store the subtitle only in the top-level `subtitle` column, not in `translations.*.subtitle`; `mapProjectRow` never mapped it.
- C2: eyebrows reuse `t.nav.*`; new `hero.chips` keys; es "App móvil", it "App mobile". C3: only "despúes" was a clear typo.
- C4 (DB): EstudialoAI es/it descriptions rewritten; HFlow es/it rewritten; paste-junk `\n  ` collapsed in EstudialoAI (description, en, es, it), Happiness To Go (description, en, es, it), HFlow (es, it, replaced). Backups in scratchpad `db-backup/*.pre-audit.json`.
- C11 (DB): Festival PRO `images[].sortOrder` now 0..6 in the existing array order. The 1600x2275 first image is the app splash screen ("Your Festival Guide, All Year Round").
- C5: `public/images/capsule-codes-logo-360.webp` (68 KB); `images.unoptimized` left on (see report).
- Not verified: Lighthouse; DB triggers bumped `updated_at` on the edited rows.
- Remote note: apex to www redirect is 307 on Vercel; make it 308 in domain settings.
