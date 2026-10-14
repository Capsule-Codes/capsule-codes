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
- [ ] T1 RED/GREEN `lib/case-study.ts` + tests (route: inline)
- [ ] T2 RED/GREEN `lib/markdown.ts` + tests (route: inline)
- [ ] T3 RED/GREEN `getNextProject` + case-study-aware `buildProjectMetadata` in `lib/project-pages.ts` (route: inline)
- [ ] T4 Data mapping, `Project.caseStudy`, admin PUT route, migration doc (route: inline, mechanical)
- [ ] T5 Page redesign + i18n strings (route: inline, single writer; parent is the executor)
- [ ] T6 Admin "Case study" JSON editor (route: inline)
- [ ] T7 Verification: tests, tsc, build, screenshots at 1440/390 for UR POV (fixture) and HFlow (fallback), one design iteration

## Acceptance
- Case study renders hero (meta + links + cover), challenge, what we built, key decisions grid, results, gallery, stack, CTA, next project, all localized.
- Null case study renders the same layout from existing fields with no empty sections.
- No horizontal overflow at 390px. Invalid JSON is never saved from the admin.

## Checks
`npm test`, `npx tsc --noEmit`, `npm run build` with public env, local `next start` + Playwright screenshots.

## Progress / evidence
(pending)
