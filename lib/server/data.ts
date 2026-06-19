import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import type { Project, Technology, Review, TeamMember } from "@/lib/data-context";
import type { ContactInfo } from "@/lib/types/contact";

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
  };
}

/**
 * Fetch all projects from the database
 */
export async function getProjects(): Promise<Project[]> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return (data || []).map(mapProjectRow);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/**
 * Fetch a single project by ID from the database
 */
export async function getProject(id: string): Promise<Project | null> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // If record doesn't exist, return null
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching project:", error);
      return null;
    }

    return mapProjectRow(data);
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

/**
 * Fetch all technologies from the database
 */
export async function getTechnologies(): Promise<Technology[]> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("technologies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching technologies:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return [];
  }
}

/**
 * Fetch all reviews from the database
 */
export async function getReviews(): Promise<Review[]> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

/**
 * Fetch all team members from the database
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("category", { ascending: true })
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching team members:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

/**
 * Fetch contact info from the database
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return null;
  }

  try {
    // Get the first (and only) row from contact_info table
    const { data, error } = await supabaseAdmin
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      // If record doesn't exist, return null
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching contact info:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }
}

/**
 * Fetch all data needed for the homepage
 */
export async function getHomePageData() {
  const [projects, technologies, reviews, contactInfo, teamMembers] = await Promise.all([
    getProjects(),
    getTechnologies(),
    getReviews(),
    getContactInfo(),
    getTeamMembers(),
  ]);

  return {
    projects,
    technologies,
    reviews,
    contactInfo,
    teamMembers,
  };
}
