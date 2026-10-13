# Cookie consent (GDPR / ePrivacy)

## Objective
No tracking cookies before consent. The LinkedIn Insight Tag loads only after the visitor accepts, never before, and never again after a rejection.

## Findings
- The only tracker is the LinkedIn Insight Tag (`components/linkedin-insight-tag.tsx`, partner id in `lib/analytics/linkedin.ts`), rendered unconditionally in production from the root layout. It also shipped a `<noscript>` pixel (`px.ads.linkedin.com`) that fires for every no-JS visitor.
- Vercel Analytics (`@vercel/analytics`) is cookieless and does not need consent: kept. Speed Insights is not installed. The admin session cookie is strictly necessary (admin only). `next-themes` stores the theme in localStorage (functional preference, not tracking).
- LinkedIn sets third-party cookies on linkedin.com (`bcookie`, `lidc`, `UserMatchHistory`, ...), which the site cannot read or delete. It can only remove cookies on its own domain (e.g. `li_fat_id` if first-party cookies are enabled in Campaign Manager).

## Design choice
- Consent is a first-party cookie `cc_consent` with `{ v: 1, choice, ts }` (6 months, SameSite=Lax). Bumping the version re-asks everybody. A cookie (not localStorage) so the choice is also readable server-side later.
- Pure logic in `lib/consent.ts` (serialize/parse/version, cookie string builders, LinkedIn cookie cleanup list) with node:test coverage.
- `ConsentProvider` (client) reads the cookie after mount; nothing tracking-related renders until the state is known. `LinkedInInsightTag` renders its scripts only when `choice === "accepted"`. The `<noscript>` pixel is removed (no JS, no consent).
- Withdrawing (accepted -> rejected) clears the visible `li_*`-type cookies on our domain and reloads, so the already-running tag does not survive the session.
- Banner: Accept and Reject are the same component, size and weight (no dark pattern), short text, link to the privacy cookies section, localized. Footer "Cookie settings" reopens it; the privacy page cookies section has the same control.

## Tasks
- [x] K1 `lib/consent.ts` + tests (RED/GREEN)
- [x] K2 Consent copy (en/es/it) and privacy cookies text naming the Insight Tag, purpose, how to change consent
- [x] K3 `ConsentProvider`, banner, gated `LinkedInInsightTag`, footer link, privacy control
- [x] K4 Verify with Playwright (no request/cookie before consent, reject persists, accept loads, footer reopen + reject) and screenshots (mobile 390, desktop)

## Acceptance
Fresh context: no request to `snap.licdn.com`/`px.ads.linkedin.com`, no `li_*` cookies. After Reject: still none after reload. After Accept: tag loads. Reopen via footer and Reject: next load has none.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, Playwright against `next start -p 3100` (LinkedIn requests are aborted at the network layer, never sent).

## Route
Single writer, inline. TDD on, runner `node --test`.

## Progress
- K1 RED: `lib/consent.test.ts` failed (module missing); GREEN with `lib/consent.ts` (9 tests, added to the `test` script).
- K2: `consent` copy and the privacy cookies section (en/es/it) name the LinkedIn Insight Tag, its purpose, what it sends, that it loads only after Accept, how to change consent (footer link / button on the page), that Vercel Analytics is cookieless and that the choice lives in `cc_consent` for six months. Privacy "last updated" bumped to October 2026.
- K3: `hooks/use-consent.tsx`, `components/cookie-banner.tsx`, gated `components/linkedin-insight-tag.tsx` (noscript pixel removed), footer "Cookie settings", privacy section `#cookies` with the same control. Buttons needed explicit `dark:` classes: the outline variant's `dark:bg-input/30` made both look invisible on the dark surface.
- K4 (Playwright on `next start -p 3100`, LinkedIn URLs aborted at the network layer so no real hit): fresh load 0 LinkedIn requests and no cookies except none; Reject -> `cc_consent` only, reload and `/it/projects` 0 requests; footer reopen + Accept -> `insight.min.js` requested, again after reload; footer reopen + Reject -> reload, next load 0 requests; `cc_consent` expires in 182 days.
- Not verified: LinkedIn's own cookies on linkedin.com (the tag was blocked, so none were ever set); light theme banner; screen reader behavior; real production behavior behind Vercel (secure cookie flag is set from `location.protocol`).
