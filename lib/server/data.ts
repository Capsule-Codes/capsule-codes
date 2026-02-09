import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import type { Project, Technology, Review, TeamMember } from "@/lib/data-context";
import type { ContactInfo } from "@/lib/types/contact";

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

    return data || [];
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

    return data;
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
      .order("order", { ascending: true });

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
 * Fetch all data needed for the homepage
 */
export async function getHomePageData() {
  const [projects, technologies, reviews, teamMembers, contactInfo] = await Promise.all([
    getProjects(),
    getTechnologies(),
    getReviews(),
    getTeamMembers(),
    getContactInfo(),
  ]);

  return {
    projects,
    technologies,
    reviews,
    teamMembers,
    contactInfo,
  };
}
