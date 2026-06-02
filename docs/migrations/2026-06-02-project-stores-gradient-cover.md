# projects — store links, gradient preset, cover image

**Status:** Applied to production (`qijznxwebaukhrkqkbdn`) on 2026-06-02 via Supabase migration `add_project_stores_gradient_cover`.

**Why:** The project detail page gained App Store / Google Play buttons, and the home cards gained an admin-selectable cover image plus a curated gradient preset. All four are additive, nullable columns — no backfill, no breaking change.

## DDL applied

```sql
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS app_store_url   text,
  ADD COLUMN IF NOT EXISTS play_store_url  text,
  ADD COLUMN IF NOT EXISTS gradient_preset text,
  ADD COLUMN IF NOT EXISTS cover_media_id  text;
```

## New columns

| column | type | nullable | notes |
|---|---|---|---|
| `app_store_url` | `text` | YES | Apple App Store listing URL. Renders an "App Store" button on the detail page when set. |
| `play_store_url` | `text` | YES | Google Play listing URL. Renders a "Google Play" button when set. |
| `gradient_preset` | `text` | YES | Curated preset KEY (`cyan`/`emerald`/`violet`/`amber`/`rose`/`slate`) — see `lib/gradient-presets.ts`. NULL → default `cyan` (reproduces the previous hard-coded FALLBACK_BG). Stores a key, never raw colors. |
| `cover_media_id` | `text` | YES | `mediaId` of the image (within `images[]` jsonb) used as the home-card preview/cover. NULL → first image. Orientation of the card follows the chosen cover. |

## camelCase mapping (IMPORTANT)

`.select("*")` returns snake_case. The app's `Project` type is camelCase. `lib/server/data.ts:mapProjectRow` maps snake→camel and is now applied on **both** read paths:

- Public site: `getProjects` / `getProject`.
- Admin API: GET / POST / PUT in `app/api/admin/projects/route.ts` and `app/api/admin/projects/[id]/route.ts`.

Before this change the admin and public reads returned raw snake_case, so `liveUrl`/`githubUrl` (and now the new fields) read as `undefined` — their UI never rendered, and editing a project could overwrite them with empty values. The mapping fixes that round-trip. Writes already mapped camel→snake in the admin API.
