"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { Project, Technology, Review } from "./data-context";

interface SupabaseContextType {
  projects: Project[];
  technologies: Technology[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTechnology: (technology: Omit<Technology, "id">) => Promise<void>;
  updateTechnology: (
    id: string,
    technology: Partial<Technology>
  ) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, "id">) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      // Load technologies
      const { data: technologiesData, error: technologiesError } =
        await supabase
          .from("technologies")
          .select("*")
          .order("created_at", { ascending: false });

      if (technologiesError) throw technologiesError;

      // Load reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      setProjects(projectsData || []);
      setTechnologies(technologiesData || []);
      setReviews(reviewsData || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Project functions
  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title: project.title,
            description: project.description,
            translations: project.translations,
            image: project.image,
            technologies: project.technologies,
            live_url: project.liveUrl,
            github_url: project.githubUrl,
            category: project.category,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error adding project:", err);
      setError(err instanceof Error ? err.message : "Failed to add project");
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: project.title,
          description: project.description,
          translations: project.translations,
          image: project.image,
          technologies: project.technologies,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          category: project.category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (err) {
      console.error("Error updating project:", err);
      setError(err instanceof Error ? err.message : "Failed to update project");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  // Technology functions
  const addTechnology = async (technology: Omit<Technology, "id">) => {
    try {
      const { data, error } = await supabase
        .from("technologies")
        .insert([
          {
            name: technology.name,
            category: technology.category,
            icon: technology.icon,
            description: technology.description,
            translations: technology.translations,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTechnologies((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error adding technology:", err);
      setError(err instanceof Error ? err.message : "Failed to add technology");
    }
  };

  const updateTechnology = async (
    id: string,
    technology: Partial<Technology>
  ) => {
    try {
      const { data, error } = await supabase
        .from("technologies")
        .update({
          name: technology.name,
          category: technology.category,
          icon: technology.icon,
          description: technology.description,
          translations: technology.translations,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setTechnologies((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch (err) {
      console.error("Error updating technology:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update technology"
      );
    }
  };

  const deleteTechnology = async (id: string) => {
    try {
      const { error } = await supabase
        .from("technologies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTechnologies((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting technology:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete technology"
      );
    }
  };

  // Review functions
  const addReview = async (review: Omit<Review, "id">) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            text: review.text,
            author: review.author,
            company: review.company,
            position: review.position,
            translations: review.translations,
            rating: review.rating,
            avatar: review.avatar,
            date: review.date,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setReviews((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Error adding review:", err);
      setError(err instanceof Error ? err.message : "Failed to add review");
    }
  };

  const updateReview = async (id: string, review: Partial<Review>) => {
    try {
      console.log("Supabase updateReview called with:", { id, review });

      // Verificar que todos los campos requeridos estén presentes
      const updateData = {
        text: review.text,
        author: review.author,
        company: review.company,
        position: review.position,
        translations: review.translations,
        rating: review.rating,
        avatar: review.avatar,
        date: review.date,
        updated_at: new Date().toISOString(),
      };

      console.log("Update data prepared:", updateData);

      const { data, error } = await supabase
        .from("reviews")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from update operation");
      }

      console.log("Updating local state with:", data);
      setReviews((prev) => prev.map((r) => (r.id === id ? data : r)));
      console.log("Review updated successfully in local state");
    } catch (err) {
      console.error("Error updating review:", err);
      setError(err instanceof Error ? err.message : "Failed to update review");
      throw err; // Re-throw para que el componente pueda manejar el error
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
      setError(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <SupabaseContext.Provider
      value={{
        projects,
        technologies,
        reviews,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        addTechnology,
        updateTechnology,
        deleteTechnology,
        addReview,
        updateReview,
        deleteReview,
        refreshData,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
