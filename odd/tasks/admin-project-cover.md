# Admin project cover control

## Objective
Let the admin upload, replace and remove a project's marketing cover (`projects.image`, 16:10, 1600x1000 WebP) from `/admin/projects`, instead of editing the DB by hand.

## Scope and rules
- Cover only touches `projects.image`. Never `images[]`, never `coverMediaId`.
- Replacing or removing a cover never deletes the old storage object.
- Storage path: `projects/<id>/cover-<shortid>.webp` (bucket `images`).
- Auth: `/api/admin/*` is guarded by `middleware.ts` (admin_session cookie).
- Removed the gallery "set as cover" star (it wrote `coverMediaId`). The column, the API fields, `getProjectThumb` fallback and the "clear coverMediaId when its image is deleted" logic are untouched.

## Tasks
- [x] T1 Pure logic in `lib/project-cover.ts` (path builder, validation, patch rule) with `lib/project-cover.test.ts` (RED then GREEN).
- [x] T2 `POST /api/admin/projects/[id]/cover` + `processAndUploadCover` in `lib/server/media.ts` (sharp, cover-crop to 1600x1000, WebP).
- [x] T3 Admin UI: Cover section (16:10 preview, upload/replace/remove, saved immediately, edit mode only); star UI removed from gallery.

## Checks
`npm test`, `npx tsc --noEmit`, `RESEND_API_KEY=re_dummy npm run build`, local dev smoke (no writes to the hosted project).

## Progress
- RED: `npm test` failed with ERR_MODULE_NOT_FOUND for `lib/project-cover.ts`.
- GREEN: 32 pass, 0 fail.
- Not verified: real upload end to end (only the hosted Supabase project is available; no prod writes).
