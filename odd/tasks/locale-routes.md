# Locale routes (en / es / it)

## Objective
Give Google three indexable language versions of every public page. Server-rendered HTML must already be in the URL's language (today the server always renders English and swaps language on the client from localStorage).

## Decisions (fixed by the owner)
- English stays at the root, no prefix: `/`, `/projects`, `/projects/[id]`, `/privacy`, `/terms`. Spanish under `/es/...`, Italian under `/it/...`.
- No Accept-Language redirect. localStorage is no longer used for routing.
- `/admin` and `/api` stay unprefixed and untouched. Unknown prefixes (`/xx/projects`) 404.
- hreflang `en`, `es`, `it`, `x-default` (-> en) on every public page; canonical per locale; sitemap lists all three.

## Design choice
Middleware rewrite of root paths to an internal `en` segment + a single `app/(site)/[locale]/` tree.
- One page tree serves all locales: no duplicated page files (the alternative, a root tree plus an `app/[locale]` copy, duplicates every page).
- `/en/...` is never public: middleware 308-redirects it to the unprefixed path, so there is one URL per page (no duplicate content).
- Route groups give two root layouts: `(site)/[locale]/layout.tsx` renders `<html lang={locale}>` (static, no `headers()` so privacy/terms stay statically rendered), `(admin)/layout.tsx` keeps the admin shell. Admin files are only moved (`git mv`), not edited.
- Routing rules live in a pure module (`lib/locale.ts`: path<->locale, twin URLs, hreflang map, middleware decision) with node:test coverage; middleware just applies the decision.
- Language switcher and all internal links are real `<a>` links built with `localePath()`.
- Side effect: the LinkedIn tag and Analytics now load from the site layout only (before, they also loaded on /admin).

## Tasks
- [ ] L1 `lib/locale.ts` pure routing helpers + tests (RED/GREEN)
- [ ] L2 `lib/sitemap-entries.ts`: three locales per page with alternates + tests
- [ ] L3 `lib/page-metadata.ts` + `buildProjectMetadata(locale)`: per-locale title/description/OG/canonical/hreflang + tests
- [ ] L4 Route tree: middleware, `(site)/[locale]`, `(admin)`, LanguageProvider from route, per-locale metadata, localized 404
- [ ] L5 Links, switcher as links, hash nav, footer/header/cards keep locale
- [ ] L6 Verify (tests, tsc, build, curl matrix, sitemap, admin, 404, screenshots)

## Acceptance
Raw HTML of `/es`, `/it`, `/es/projects`, `/it/projects/<id>`, `/es/privacy` has the right `<html lang>`, title, canonical, hreflang set and translated visible text. Switcher goes to the twin page. `/` and existing English URLs unchanged. `/xx/projects` is 404. `/admin` loads.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, `next start -p 3100` + curl, Playwright screenshots.

## Route
Delegated direct was not used: single writer (this agent) inline, because the work is one coupled routing change; trigger evidence: >4 files mapped, mapped inline by one reader. TDD: on (explicit), runner `node --test`.

## Progress
(see below)
