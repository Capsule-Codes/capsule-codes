# team_members — allow the `marketing` category

**Status:** Applied to production (`qijznxwebaukhrkqkbdn`) on 2026-10-12 via Supabase migration `team_members_allow_marketing_category`.

**Why:** The team section gains a Marketing row (Camila Valdez, Marketing Lead). The `team_members_category_check` constraint only allowed `cofounder` and `developer`. Adding a value is backward compatible: deployed code that does not know `marketing` simply does not render those rows.

## DDL applied

```sql
ALTER TABLE team_members DROP CONSTRAINT team_members_category_check;
ALTER TABLE team_members
  ADD CONSTRAINT team_members_category_check
  CHECK (category = ANY (ARRAY['cofounder'::text, 'marketing'::text, 'developer'::text]));
```

## Related app changes

- `lib/team-groups.ts` groups members into rows (cofounder, marketing, developer) and omits empty ones, so an unpublished developer set no longer leaves an empty "Developers" label.
- Admin team form gains a `Marketing` option; `lib/i18n.ts` adds `team.marketingTitle`.
