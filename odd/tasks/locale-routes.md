# Locale routes (en / es / it)

## Objective
Give Google three indexable language versions of every public page. Server-rendered HTML must already be in the URL's language (today the server always renders English and swaps language on the client from localStorage).

## Decisions (fixed by the owner)
- English stays at the root, no prefix: `/`, `/projects`, `/projects/[id]`, `/privacy`, `/terms`. Spanish under `/es/...`, Italian under `/it/...`.
- No Accept-Language redirect. localStorage is no longer used for routing.
- `/admin` and `/api` stay unprefixed and untouched. Unknown prefixes (`/xx/projects`) 404.
- hreflang `en`, `es`, `it`, `x-default` (-> en) on every public page; canonical per locale; sitemap lists all three.

## Design choice
Middleware rewrite of root paths to an internal `en` segment + a single `app/[locale]/` page tree + one root layout.
- One page tree serves all locales: no duplicated page files (the alternative, a root tree plus a separate `app/[locale]` copy, duplicates every page).
- `/en/...` is never public: middleware 308-redirects it to the unprefixed path, so each page has one URL per language (no duplicate content).
- The middleware also sets an `x-locale` request header; the single root layout reads it (`headers()`) to render `<html lang>` and the `LanguageProvider`, so the server HTML is already in the URL's language. `/admin` and `/api` get no header and stay English. Cost: privacy/terms are no longer statically prerendered (home, projects and project detail were already `force-dynamic`).
- Tried and rejected: making `app/[locale]/layout.tsx` the root layout (route groups, html per group). Next 14.2 then renders the 404 as a client-only `__next_error__` shell and the layout runs without params in the global 404 pass; the header approach keeps one conventional root layout and `admin` untouched.
- Routing rules live in a pure module (`lib/locale.ts`: path<->locale, twin URLs, hreflang map, middleware decision) covered by node:test; the middleware only applies the decision.
- Language switcher and internal links are real `<a>`/`<Link>` built with `localePath()`; the language comes from the route, localStorage is no longer read or written.
- Unknown prefixes: `/xx/...` is rewritten under `en`, where `[locale]/[...rest]` calls `notFound()` -> 404 in the default language. Unknown project ids and unknown paths under es/it render the localized 404.
- Known Next 14.2 behavior (same as before this change): a page-level `notFound()` answers 404 with a client-rendered shell, so the localized 404 text appears after hydration.

## Tasks
- [x] L1 `lib/locale.ts` pure routing helpers + tests (RED/GREEN)
- [x] L2 `lib/sitemap-entries.ts`: three locales per page with alternates + tests
- [x] L3 `lib/page-metadata.ts` + `buildProjectMetadata(locale)`: per-locale title/description/OG/canonical/hreflang + tests
- [x] L4 Route tree: middleware, `app/[locale]`, root layout reading `x-locale`, LanguageProvider from route, per-locale metadata, localized 404/error + legal headings
- [x] L5 Links, switcher as links, hash nav, footer/header/cards keep locale
- [x] L6 Verify (tests, tsc, build, curl matrix, sitemap, admin, 404, screenshots)

## Acceptance
Raw HTML of `/es`, `/it`, `/es/projects`, `/it/projects/<id>`, `/es/privacy` has the right `<html lang>`, title, canonical, hreflang set and translated visible text. Switcher goes to the twin page. `/` and existing English URLs unchanged. `/xx/projects` is 404. `/admin` loads.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, `next start -p 3100` + curl, Playwright screenshots.

## Route
Single writer, inline (one coupled routing change); no delegation. TDD on, runner `node --test`.

## Progress
- L1 RED: `lib/locale.test.ts` failed (module missing, then 7/14 failing against the old middleware shape when `locale` was added); GREEN.
- L2 RED/GREEN: `lib/sitemap-entries.test.ts` rewritten for 3 locales + alternates. L3 RED: `lib/page-metadata.test.ts` and locale cases in `lib/project-pages.test.ts`; GREEN. Intentional change: a project without a cover now falls back to the site OG card instead of no image.
- Commits: `feat(i18n)` helpers+metadata+sitemap, `feat(i18n)` copy (legal headings, 404/error), `feat(i18n)` locale routes.
- Verification: see final report (curl matrix on `next start -p 3100`, Playwright switcher/hash/404 checks, screenshots es home, es project, es 404).
- Side effects to know: admin pages always use English (language no longer comes from localStorage); `components/language-switcher.tsx` (unused) removed.
- Not verified: Google's rendering of hreflang/sitemap (needs deploy + Search Console); apex->www redirect; the `/api/admin/contact-messages` route shows as static in the build (pre-existing).
