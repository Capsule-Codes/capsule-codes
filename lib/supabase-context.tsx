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

  // Load data from API routes (using service role key)
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data from API routes in parallel
      // Use cache: 'no-store' to ensure we always get fresh data
      const [projectsResponse, technologiesResponse, reviewsResponse, contactMessagesResponse, contactInfoResponse] = await Promise.all([
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/technologies", { cache: "no-store" }),
        fetch("/api/admin/reviews", { cache: "no-store" }),
        fetch("/api/admin/contact-messages", { cache: "no-store" }),
        fetch("/api/admin/contact-info", { cache: "no-store" }),
      ]);

      const projectsData = projectsResponse.ok ? await projectsResponse.json() : [];
      const technologiesData = technologiesResponse.ok ? await technologiesResponse.json() : [];
      const reviewsData = reviewsResponse.ok ? await reviewsResponse.json() : [];
      const contactMessagesData = contactMessagesResponse.ok ? await contactMessagesResponse.json() : [];
      const contactInfoData = contactInfoResponse.ok ? await contactInfoResponse.json() : null;

      setProjects(projectsData);
      setTechnologies(technologiesData);
      setReviews(reviewsData);
      setContactMessages(contactMessagesData);
      
      // Debug: Log contact info to verify data is loaded correctly
      console.log("API Response Status:", contactInfoResponse.status);
      console.log("Loaded contact info from API:", contactInfoData);
      setContactInfo(contactInfoData);
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
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: project.title,
            description: project.description,
            translations: project.translations,
            image: project.image,
            images: project.images || [],
            technologies: project.technologies,
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
            category: project.category,
            featured: project.featured,
            published: project.published,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project");
      }

      const data = await response.json();
      setProjects((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add project");
      throw err;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const data = await response.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      throw err;
    }
  };

  // Technology functions
  const addTechnology = async (technology: Omit<Technology, "id">) => {
    try {
      const response = await fetch("/api/admin/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(technology),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add technology");
      }

      const data = await response.json();
      setTechnologies((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add technology");
      throw err;
    }
  };

  const updateTechnology = async (
    id: string,
    technology: Partial<Technology>
  ) => {
    try {
      const response = await fetch(`/api/admin/technologies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(technology),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update technology");
      }

      const data = await response.json();
      setTechnologies((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update technology"
      );
      throw err;
    }
  };

  const deleteTechnology = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/technologies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete technology");
      }

      setTechnologies((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete technology"
      );
      throw err;
    }
  };

  // Review functions
  const addReview = async (review: Omit<Review, "id">) => {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add review");
      }

      const data = await response.json();
      setReviews((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add review");
      throw err;
    }
  };

  const updateReview = async (id: string, review: Partial<Review>) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update review");
      }

      const data = await response.json();
      setReviews((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
      throw err;
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
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update message status");
      }

      const data = await response.json();
      setContactMessages((prev) => prev.map((m) => (m.id === id ? data : m)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message status");
      throw err;
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete message");
      }

      setContactMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
      throw err;
    }
  };

  // Contact info functions
  const updateContactInfo = async (info: Partial<ContactInfo>) => {
    try {
      console.log("🔄 updateContactInfo - Request payload:", info);
      // Use API route to bypass RLS policies
      const response = await fetch("/api/admin/contact-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });

      console.log("📡 updateContactInfo - Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ updateContactInfo - Error response:", errorData);
        throw new Error(errorData.message || "Failed to update contact info");
      }

      const data = await response.json();
      console.log("✅ updateContactInfo - Success, received data:", data);
      // Update state immediately with the returned data
      setContactInfo(data);
      return data;
    } catch (err) {
      console.error("❌ updateContactInfo - Exception:", err);
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
