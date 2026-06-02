# projects — show-on-home toggle, custom gradient colors

**Status:** Applied to production (`qijznxwebaukhrkqkbdn`) on 2026-06-02 via Supabase migration `add_project_showonhome_custom_gradient`. Follows `2026-06-02-project-stores-gradient-cover.md`.

**Why:** The home grid now shows ALL published projects (the `featured` star only promotes one to the big bento card). Added a dedicated `show_on_home` toggle so the home grid can be curated independently of `featured`. Also added a "Custom" gradient option (two brand colors) alongside the curated presets.

## DDL applied

```sql
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS show_on_home boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS gradient_from text,
  ADD COLUMN IF NOT EXISTS gradient_to   text;
```

## New columns

| column | type | nullable | default | notes |
|---|---|---|---|---|
| `show_on_home` | `boolean` | YES | `true` | Whether the project appears in the home projects grid. DEFAULT true so existing projects keep showing. Home filter: `published === true && show_on_home !== false`. The detail page (`/projects/[id]`) stays reachable by direct link regardless. |
| `gradient_from` | `text` | YES | — | First color of a custom card gradient. Used only when `gradient_preset = 'custom'`. |
| `gradient_to` | `text` | YES | — | Second color of the custom gradient. |

## Related app changes

- `gradient_preset = 'custom'` (sentinel `CUSTOM_GRADIENT_KEY`) → `lib/gradient-presets.ts:resolveProjectGradient` builds a `linear-gradient(145deg, from, to)` with a neutral dark overlay for legibility. Any other value → curated preset (default cyan).
- `featured` semantics unchanged: it selects the single large bento card, NOT home visibility.
- The legacy `github_url` column is now **orphaned** — the GitHub URL was removed from the admin form and the project detail UI. The column and the `Project.githubUrl` type field remain (harmless) but are no longer written or displayed. The former "Demo URL" is relabeled "Web URL" (still the `live_url` column).
