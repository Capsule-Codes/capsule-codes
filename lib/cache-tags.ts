/**
 * Data Cache tags for the content the public site reads from Supabase.
 * `lib/server/data.ts` tags every cached read with one of these; the admin
 * write routes invalidate them (see `revalidateContent`) so edits show up
 * immediately instead of waiting for the time-based revalidation.
 */
export const CACHE_TAGS = {
  projects: "projects",
  technologies: "technologies",
  reviews: "reviews",
  team: "team-members",
  contactInfo: "contact-info",
} as const;

export type ContentResource = keyof typeof CACHE_TAGS;

export interface RevalidationDeps {
  revalidateTag: (tag: string) => void;
  revalidatePath: (path: string, type?: "layout" | "page") => void;
}

/**
 * Invalidates the cached reads of the given resources and the cached HTML of
 * every public page (`app/[locale]/**`). Takes `next/cache` functions as
 * dependencies so the logic is testable without a Next runtime.
 */
export function revalidateContent(
  resources: readonly ContentResource[],
  deps: RevalidationDeps,
): void {
  if (resources.length === 0) return;
  const tags = new Set(resources.map((resource) => CACHE_TAGS[resource]));
  for (const tag of tags) deps.revalidateTag(tag);
  deps.revalidatePath("/[locale]", "layout");
}

/** Wraps a route handler: after a successful (2xx) response, revalidates `resources`. */
export function withRevalidation<A extends unknown[]>(
  resources: readonly ContentResource[],
  handler: (...args: A) => Promise<Response>,
  deps: RevalidationDeps,
): (...args: A) => Promise<Response> {
  return async (...args) => {
    const response = await handler(...args);
    if (response.ok) revalidateContent(resources, deps);
    return response;
  };
}
