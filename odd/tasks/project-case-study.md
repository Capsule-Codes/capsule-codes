# project-case-study

## Objective
Turn `/[locale]/projects/[id]` into a real case study page (context, challenge, solution, key decisions, results, gallery, stack, CTA, next project) and make the case study editable from the admin.

## Problem / why
The detail page was a full-bleed cover, one sentence, a wall of screenshots and stack chips. No client context, no story, no CTA, no next project. The es/it subtitle fell back to the English top-level `subtitle` column.

## Scope
- New nullable jsonb column `projects.case_study` (migration doc only; the owner applies it).
- `lib/case-study.ts`: `CaseStudy` type (fixed shape, content is authored in parallel) + tolerant `parseCaseStudy`.
- `lib/markdown.ts`: tiny safe markdown subset (paragraphs, bold, italics, links, lists) parsed to an AST rendered by React (no raw HTML).
- Data mapping (`caseStudy` on `Project`), admin PUT route accepts `caseStudy` (validated server-side), admin JSON editor.
- Page redesign + graceful fallback when `caseStudy` is null; SEO uses localized subtitle/summary.

## Constraints
- Data shape is FIXED (see task brief). Do not apply the migration. Do not commit `.claude/` or `supabase/`.
- TDD: enabled (strict, from the brief), runner `npm test` (`node --test`, files listed in the `test` script).
- ISR (`revalidate = 300`, `generateStaticParams`), canonical and hreflang unchanged.
- Before the migration is applied, admin saves must keep working: `case_study` is only sent when the editor was changed.
- Delivery strategy: `ask-on-risk`; forecast ~900 authored lines, single branch, no push (owner decides PR shape).

## Tasks
- [x] T1 RED/GREEN `lib/case-study.ts` + tests (route: inline)
- [x] T2 RED/GREEN `lib/markdown.ts` + tests (route: inline)
- [x] T3 RED/GREEN `getNextProject` + case-study-aware `buildProjectMetadata` in `lib/project-pages.ts` (route: inline)
- [x] T4 Data mapping, `Project.caseStudy`, admin PUT route, migration doc (route: inline, mechanical)
- [x] T5 Page redesign + i18n strings (route: inline, single writer; parent is the executor)
- [x] T6 Admin "Case study" JSON editor (route: inline)
- [x] T7 Verification: tests, tsc, build, screenshots at 1440/390 for UR POV (fixture) and HFlow (fallback), one design iteration

## Acceptance
- Case study renders hero (meta + links + cover), challenge, what we built, key decisions grid, results, gallery, stack, CTA, next project, all localized.
- Null case study renders the same layout from existing fields with no empty sections.
- No horizontal overflow at 390px. Invalid JSON is never saved from the admin.

## Checks
`npm test`, `npx tsc --noEmit`, `npm run build` with public env, local `next start` + Playwright screenshots.

## Progress / evidence
- T1 RED: `lib/case-study.test.ts` module not found; GREEN 10/10.
- T2 RED: `lib/markdown.test.ts` module not found; GREEN 10/10.
- T3 RED: `getNextProject` export missing; GREEN project-pages 13/13.
- T5 design iteration: v1 screenshots showed the HFlow 10-shot wall (stacked on mobile), a 5+3 phone row and a 3+1 decisions row. v2: mobile snap strips for all shots, balanced phone columns (8 -> 4+4) capped at ~220px, 4 decisions in one row at xl. v3: `desktopGalleryLayout` (RED: export missing; GREEN 13/13) fills every row on a 6-col grid (featured 4x2 + thirds/halves).
- Final: `npm test` 111/111, `npx tsc --noEmit` clean, `npm run build` OK with `/[locale]/projects/[id]` still `●` (ISR). No horizontal overflow at 390 (scrollWidth - innerWidth = 0) for UR POV (fixture) and HFlow (null fallback). Canonical/hreflang unchanged on `/es/projects/<id>`.
- Local fixture: uncommitted stub in `lib/server/data.ts` reading a UR POV case study JSON from the scratchpad (en/es, it falls back to en); reverted before committing.
- RDD: assess on the first two commits = medium (`slice_budget_reached`, executable change in the admin PUT route); review not started by the delegated worker because candidate consent is human-owned.
- Found, not fixed (pre-existing): `/es/projects/<non-uuid>` returns 500 because `getProject` surfaces the Postgres uuid cast error instead of 404.

## Next step
Owner applies `docs/migrations/2026-10-14-project-case-study.md`, then content is loaded per project (admin JSON editor or SQL).
