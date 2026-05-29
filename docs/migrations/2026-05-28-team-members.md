# team_members table — adopted as-is

**Status:** Pre-existing in production (`qijznxwebaukhrkqkbdn`). No DDL applied as part of the 2026-05-28 Capsule Codes redesign — we adopt the existing schema and data.

**Discovered:** 2026-05-28 while attempting Task 5 of the redesign. The redesign spec assumed the table needed to be created from scratch and seeded from `lib/i18n.ts`. The table was already present with 4 rows, so the spec is updated to consume the existing shape rather than create a new one.

## Schema (live)

| column | type | nullable | default | notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key. |
| `translations` | `jsonb` | YES | `'{"en": {"name": "", "role": "", "description": ""}, "es": {"name": "", "role": "", "description": ""}, "it": {"name": "", "role": "", "description": ""}}'::jsonb` | Per-language `{ name, role, description }` payload. |
| `avatar` | `text` | YES | `null` | Direct URL to the avatar image. Can be empty string in current data. |
| `category` | `text` | NO | — | Discriminator. Current values: `cofounder`, `developer`. |
| `order` | `integer` | YES | `0` | Display order within category. Reserved word — must be quoted as `"order"` in SQL. |
| `published` | `boolean` | YES | `true` | Public visibility flag. |
| `created_at` | `timestamptz` | YES | `timezone('utc'::text, now())` | Set on insert. |
| `updated_at` | `timestamptz` | YES | `timezone('utc'::text, now())` | Auto-updated by trigger (see below). |
| `avatar_blob_key` | `text` | YES | `null` | Optional blob storage key (alternative to `avatar` URL). Currently unused in all rows. |

## RLS policies (live)

| policy | cmd | qual | with_check |
|---|---|---|---|
| `Allow authenticated full access` | `ALL` | `(auth.role() = 'authenticated'::text)` | — |
| `Allow public read access` | `SELECT` | `(published = true)` | — |

Public anon role can read published rows only. Authenticated users (admin) have full CRUD.

## Trigger (live)

| trigger | timing | event | level | action |
|---|---|---|---|---|
| `update_team_members_timestamp` | `BEFORE` | `UPDATE` | `ROW` | `EXECUTE FUNCTION update_team_members_updated_at()` |

Automatically refreshes `updated_at` on every row update.

## translations JSONB shape (live)

The `translations` column is keyed by language code (`en` / `es` / `it`) and each value is an object with:

```json
{ "name": "...", "role": "...", "description": "..." }
```

Note: `name` is INSIDE translations (unlike the spec which proposed a top-level `name` column).

Live example (`id = 664df16f-00ae-42f1-a16c-b344ccffb75e`):

```json
{
  "en": {
    "name": "Miguel Scala",
    "role": "Co-founder & Business Lead",
    "description": "Handles all client relationships, project management, and business strategy. Your main point of contact who ensures your vision becomes reality on time and on budget."
  },
  "es": {
    "name": "Miguel Scala",
    "role": "Co-founder y Líder de Negocios",
    "description": "Maneja todas las relaciones con los clientes, gestión de proyectos y estrategia de negocio. Tu punto de contacto principal que asegura que tu visión se convierta en realidad a tiempo y dentro del presupuesto."
  },
  "it": {
    "name": "Miguel Scala",
    "role": "Co-founder e Leader di Business",
    "description": "Gestisce tutte le relazioni con i clienti, la gestione dei progetti e la strategia di business. Il tuo punto di contatto principale che assicura che la tua visione diventi realtà nei tempi e nel budget."
  }
}
```

## Rows currently in the table

4 rows. All `published = true`. All have `avatar` populated (text, non-null), none have `avatar_blob_key`. All have `en`, `es`, `it` translation languages.

| id | category | order | published | has_avatar | has_blob_key | translation_langs | name (en) | role (en) |
|---|---|---|---|---|---|---|---|---|
| `664df16f-00ae-42f1-a16c-b344ccffb75e` | `cofounder` | 1 | true | true | false | en, es, it | Miguel Scala | Co-founder & Business Lead |
| `9bb5e04a-e72c-4bc8-b9d1-cb63694534f1` | `cofounder` | 1 | true | true | false | en, es, it | Facundo Pascale | Co-founder y Tech Lead |
| `b8820f36-cf2f-4897-b1c6-c819be21d27f` | `developer` | 2 | true | true | false | en, es, it | Marco Galván | Senior Full Stack Developer |
| `293d4bde-cdb7-45c4-ba64-0fcdc129fc56` | `developer` | 3 | true | true | false | en, es, it | Juan Segundo Sosa | Senior Full Stack Developer |

Note: both cofounders share `order = 1`. The redesign team component should handle ties deterministically (e.g., secondary sort by `created_at` or `id`).

Lucas (from `lib/i18n.ts`) is NOT present in the table. Task 8 will need to decide whether to insert him or drop him from the i18n source of truth.

## Impact on subsequent tasks

- **Task 6** (TypeScript types + server fetcher): use these column names — `category` not `type`, `order` not `display_order`, `avatar` + `avatar_blob_key` (not `avatar_url`), `published`. The TeamMember `translations` interface is `{ en: {name, role, description}, es: {...}, it: {...} }`.
- **Task 7** (API routes + context): same column names.
- **Task 8** (seed): re-purposed — verify all i18n members are present in the table; Lucas is missing from the 4 rows discovered, so insert him (or drop him from i18n if no longer on the team — decide with stakeholder). NO truncate/recreate.
- **Task 15** (public Team component): consume the shape above. Filter `published = true` server-side (RLS already enforces this for the anon role, but include it explicitly for clarity). Order by `category` then `"order"` (quote-needed because `order` is a reserved word). Apply a deterministic tie-breaker for rows sharing the same `order` within a category.
- **Task 25** (admin Team page): edit existing rows + create new with the same shape. Use the `Allow authenticated full access` policy via the standard authed Supabase client.

## What was NOT done

- No `CREATE TABLE` ran. Spec's proposed DDL is superseded by this doc.
- No DDL changes to columns, policies, or triggers.
- No row inserts/updates/deletes.
