import "server-only";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "./supabase-admin";
import type { Project, Technology, Review, TeamMember } from "@/lib/data-context";
import { isProjectPublished } from "@/lib/project-pages";
import type { ContactInfo } from "@/lib/types/contact";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Public reads go through the Next Data Cache, tagged per resource: pages are
 * served from the ISR cache and the admin write routes invalidate the tags
 * (`revalidateContent`). `REVALIDATE_SECONDS` is the safety net for edits made
 * outside the admin panel.
 *
 * Reads throw on database errors on purpose: a failed regeneration keeps
 * serving the last good page/data instead of caching an empty result.
 */
export const REVALIDATE_SECONDS = 300;

/**
 * Map a raw `projects` row (snake_case columns) to the camelCase `Project`
 * shape the app consumes. `.select("*")` returns snake_case, so without this
 * the camelCase fields (liveUrl, githubUrl, appStoreUrl, …) read as undefined
 * and their UI never renders. jsonb columns (translations, images) already
 * carry the correct internal shape and pass through untouched.
 */
export function mapProjectRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    subtitle: (row.subtitle as string) || undefined,
    translations: row.translations as Project["translations"],
    image: row.image as string,
    images: (row.images as Project["images"]) ?? undefined,
    technologies: (row.technologies as string[]) ?? [],
    liveUrl: (row.live_url as string) || undefined,
    githubUrl: (row.github_url as string) || undefined,
    appStoreUrl: (row.app_store_url as string) || undefined,
    playStoreUrl: (row.play_store_url as string) || undefined,
    gradientPreset: (row.gradient_preset as string) || undefined,
    gradientFrom: (row.gradient_from as string) || undefined,
    gradientTo: (row.gradient_to as string) || undefined,
    coverMediaId: (row.cover_media_id as string) || undefined,
    category: row.category as Project["category"],
    imageOrientation: (row.image_orientation as Project["imageOrientation"]) || undefined,
    featured: (row.featured as boolean) ?? undefined,
    showOnHome: (row.show_on_home as boolean) ?? undefined,
    published: (row.published as boolean) ?? undefined,
    updatedAt: (row.updated_at as string) || undefined,
  };
}

/** Runs `read` through the Data Cache under `tag`; `keyParts` identify the entry. */
function cached<T>(keyParts: string[], tag: string, read: () => Promise<T>): Promise<T> {
  return unstable_cache(read, keyParts, { tags: [tag], revalidate: REVALIDATE_SECONDS })();
}

/** Fetch all projects from the database */
export async function getProjects(): Promise<Project[]> {
  return cached(["projects"], CACHE_TAGS.projects, async () => {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return [];
    }
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Error fetching projects: ${error.message}`);
    return (data || []).map(mapProjectRow);
  });
}

/** Fetch a single project by ID from the database */
export async function getProject(id: string): Promise<Project | null> {
  return cached(["project", id], CACHE_TAGS.projects, async () => {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return null;
    }
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    // PGRST116: no such record. Unknown ids are cached as "not found" too.
    if (error?.code === "PGRST116") return null;
    if (error) throw new Error(`Error fetching project: ${error.message}`);
    return mapProjectRow(data);
  });
}

/** Fetch all technologies from the database */
export async function getTechnologies(): Promise<Technology[]> {
  return cached(["technologies"], CACHE_TAGS.technologies, async () => {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return [];
    }
    const { data, error } = await supabaseAdmin
      .from("technologies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Error fetching technologies: ${error.message}`);
    return data || [];
  });
}

/** Fetch all reviews from the database */
export async function getReviews(): Promise<Review[]> {
  return cached(["reviews"], CACHE_TAGS.reviews, async () => {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return [];
    }
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Error fetching reviews: ${error.message}`);
    return data || [];
  });
}

/** Fetch published team members from the database */
export async function getTeamMembers(): Promise<TeamMember[]> {
  return cached(["team-members"], CACHE_TAGS.team, async () => {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return [];
    }
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("category", { ascending: true })
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Error fetching team members: ${error.message}`);
    return data || [];
  });
}

/** Fetch contact info (the single row of `contact_info`) from the database */
export async function getContactInfo(): Promise<ContactInfo | null> {
  return cached(["contact-info"], CACHE_TAGS.contactInfo, async () => {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return null;
    }
    const { data, error } = await supabaseAdmin
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();
    if (error?.code === "PGRST116") return null;
    if (error) throw new Error(`Error fetching contact info: ${error.message}`);
    return data;
  });
}

/** Fetch all data needed for the homepage */
export async function getHomePageData() {
  const [projects, technologies, reviews, contactInfo, teamMembers] = await Promise.all([
    getProjects(),
    getTechnologies(),
    getReviews(),
    getContactInfo(),
    getTeamMembers(),
  ]);

  return { projects, technologies, reviews, contactInfo, teamMembers };
}

/**
 * Fetch a project for public pages: unknown ids and unpublished projects both
 * resolve to null so the caller can 404.
 */
export async function getPublishedProject(id: string): Promise<Project | null> {
  const project = await getProject(id);
  return project && isProjectPublished(project) ? project : null;
}
