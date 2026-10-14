# projects — add the `case_study` jsonb column

**Status:** Pending. Not applied yet; the owner applies it to production (`qijznxwebaukhrkqkbdn`).

**Why:** The project detail page becomes a real case study (context, challenge, solution, key decisions, results), localized in en/es/it. The content lives in one nullable jsonb column so it can be authored as a single document and edited from the admin. Adding a nullable column is backward compatible: deployed code ignores it and the new code treats a missing/null value as "no case study" and renders the fallback layout.

## DDL to apply

```sql
alter table public.projects add column if not exists case_study jsonb;
```

## Shape

```ts
type CaseStudyLocale = {
  subtitle: string;        // short localized subtitle
  summary: string;         // 2–3 sentence lead
  challenge: string;       // markdown, 1–3 paragraphs
  solution: string;        // markdown, 1–3 paragraphs
  highlights: { title: string; body: string }[]; // 3–5 key decisions
  results: string;         // markdown, honest outcomes
  industry?: string;       // localized; falls back to meta.industry
  role?: string;           // localized; falls back to meta.role
};
type CaseStudy = {
  meta: {
    client?: string;       // record only, never rendered
    industry?: string;     // fallback for the locale's industry
    year: number;
    ongoing?: boolean;     // renders "2024 – Present" (localized)
    countries: string[];   // ISO 3166-1 alpha-2, e.g. ["ZA"]; names via Intl.DisplayNames
    platforms: string[];
    role?: string;         // fallback for the locale's role
    links?: { web?: string; appStore?: string; googlePlay?: string };
  };
  en: CaseStudyLocale; es: CaseStudyLocale; it: CaseStudyLocale;
};
```

## Related app changes

- `lib/case-study.ts`: the type and `parseCaseStudy` (tolerant: a missing/invalid `es`/`it` falls back to `en`; anything else invalid reads as `null`). Markdown fields render through `lib/markdown.ts` (safe subset, no raw HTML).
- `lib/server/data.ts` maps `case_study` to `Project.caseStudy`.
- `PUT /api/admin/projects/[id]` accepts `caseStudy` (validated; `null` clears) and revalidates the projects tag.
- The admin project editor has a "Case study" JSON section. It only sends `caseStudy` when that editor changed, so other saves keep working before this migration is applied (saving a case study before it fails with a column error).
