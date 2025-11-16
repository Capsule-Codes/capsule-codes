"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { Project, Technology, Review } from "./data-context";
import type { ContactMessage, ContactInfo } from "./types/contact";

interface SupabaseContextType {
  projects: Project[];
  technologies: Technology[];
  reviews: Review[];
  contactMessages: ContactMessage[];
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, "id">) => Promise<Project | void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTechnology: (technology: Omit<Technology, "id">) => Promise<void>;
  updateTechnology: (
    id: string,
    technology: Partial<Technology>
  ) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;
  addReview: (review: Omit<Review, "id">) => Promise<Review | void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addContactMessage: (message: Omit<ContactMessage, "id" | "status" | "created_at" | "updated_at">) => Promise<void>;
  updateContactMessageStatus: (id: string, status: ContactMessage["status"]) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  updateContactInfo: (info: Partial<ContactInfo>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
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

      // Load contact messages (only for authenticated users)
      const { data: contactMessagesData, error: contactMessagesError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      // Don't throw error if contact_messages table doesn't exist or user isn't authenticated

      // Load contact info
      const { data: contactInfoData, error: contactInfoError } = await supabase
        .from("contact_info")
        .select("*")
        .single();

      // Don't throw error if contact_info table doesn't exist

      setProjects(projectsData || []);
      setTechnologies(technologiesData || []);
      setReviews(reviewsData || []);
      setContactMessages(contactMessagesData || []);
      setContactInfo(contactInfoData || null);
    } catch (err) {
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
            images: project.images || [],
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
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add project");
      throw err;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Only include fields that are provided
      if (project.title !== undefined) updateData.title = project.title;
      if (project.description !== undefined) updateData.description = project.description;
      if (project.translations !== undefined) updateData.translations = project.translations;
      if (project.image !== undefined) updateData.image = project.image;
      if (project.images !== undefined) updateData.images = project.images;
      if (project.technologies !== undefined) updateData.technologies = project.technologies;
      if (project.liveUrl !== undefined) updateData.live_url = project.liveUrl;
      if (project.githubUrl !== undefined) updateData.github_url = project.githubUrl;
      if (project.category !== undefined) updateData.category = project.category;

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  // Technology functions
  const addTechnology = async (technology: Omit<Technology, "id">) => {
    console.log("🔵 [Supabase] addTechnology called with:", technology);
    try {
      const insertData = {
        name: technology.name,
        category: technology.category,
        icon: technology.icon,
        translations: technology.translations,
      };

      console.log("📤 [Supabase] Inserting data:", insertData);

      const { data, error } = await supabase
        .from("technologies")
        .insert([insertData])
        .select()
        .single();

      console.log("📥 [Supabase] Response:", { data, error });

      if (error) {
        console.error("❌ [Supabase] Insert error:", error);
        throw error;
      }

      console.log("✅ [Supabase] Technology added successfully:", data);
      setTechnologies((prev) => [data, ...prev]);
    } catch (err) {
      console.error("❌ [Supabase] addTechnology error:", err);
      setError(err instanceof Error ? err.message : "Failed to add technology");
      throw err;
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
          translations: technology.translations,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setTechnologies((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch (err) {
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
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add review");
      throw err;
    }
  };

  const updateReview = async (id: string, review: Partial<Review>) => {
    try {
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

      const { data, error } = await supabase
        .from("reviews")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from update operation");
      }

      setReviews((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  // Contact message functions
  const addContactMessage = async (message: Omit<ContactMessage, "id" | "status" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: message.name,
            email: message.email,
            company: message.company,
            message: message.message,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setContactMessages((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setContactMessages((prev) => prev.map((m) => (m.id === id ? data : m)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message status");
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);

      if (error) throw error;

      setContactMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  // Contact info functions
  const updateContactInfo = async (info: Partial<ContactInfo>) => {
    try {
      const { data, error } = await supabase
        .from("contact_info")
        .update({
          email: info.email,
          phone: info.phone,
          location: info.location,
          translations: info.translations,
        })
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .select()
        .single();

      if (error) throw error;

      setContactInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contact info");
      throw err;
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        projects,
        technologies,
        reviews,
        contactMessages,
        contactInfo,
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
        addContactMessage,
        updateContactMessageStatus,
        deleteContactMessage,
        updateContactInfo,
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
