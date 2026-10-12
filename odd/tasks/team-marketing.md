# team-marketing

## Objective
Add a Marketing row to the team section (Camila Valdez, Marketing Lead) and stop rendering empty category rows (production currently shows an empty "Developers" label).

## Constraints
- Route: delegated writer (single writer). TDD enabled, runner `npm test` (node:test).
- DB: constraint migration applied only after local tests pass; row insert after the constraint.
- Constraint change is backward compatible with deployed code (unknown categories are not rendered).

## Tasks
- [x] T1 RED/GREEN `lib/team-groups.ts` (group, order, skip empty)
- [x] T2 team-section uses grouping; i18n `marketingTitle` (en/es/it); TeamMember type + admin select support `marketing`
- [x] T3 Migration doc under docs/migrations; apply constraint change via Supabase
- [x] T4 Insert Camila's row
- [x] T5 Local screenshots (desktop + mobile)

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, screenshots.

## Progress / evidence
RED then GREEN (npm test 17/17), tsc and build OK. Migration team_members_allow_marketing_category applied; Camila row 3d585ed6 inserted. Local screenshots reviewed (desktop/mobile): Co-founders + Marketing, no Developers row.
