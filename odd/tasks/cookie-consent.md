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
- [ ] K1 `lib/consent.ts` + tests (RED/GREEN)
- [ ] K2 Consent copy (en/es/it) and privacy cookies text naming the Insight Tag, purpose, how to change consent
- [ ] K3 `ConsentProvider`, banner, gated `LinkedInInsightTag`, footer link, privacy control
- [ ] K4 Verify with Playwright (no request/cookie before consent, reject persists, accept loads, footer reopen + reject) and screenshots (mobile 390, desktop)

## Acceptance
Fresh context: no request to `snap.licdn.com`/`px.ads.linkedin.com`, no `li_*` cookies. After Reject: still none after reload. After Accept: tag loads. Reopen via footer and Reject: next load has none.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, Playwright against `next start -p 3100` (LinkedIn requests are aborted at the network layer, never sent).

## Route
Single writer, inline. TDD on, runner `node --test`.

## Progress
(see below)
