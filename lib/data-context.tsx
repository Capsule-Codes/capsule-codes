"use client";

import React, { createContext, useContext } from "react";
import { useSupabase } from "./supabase-context";

// Project interfaces
export interface ProjectTranslations {
  title: string;
  subtitle: string;
  description: string;
}

export interface ProjectImage {
  mediaId: string;
  blobKey: string;
  mimeType: string;
  width: number;
  height: number;
  sizeBytes: number;
  alt: string;
  sortOrder: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string; // Fallback para compatibilidad
  description: string; // Fallback para compatibilidad
  translations: {
    en: ProjectTranslations;
    es: ProjectTranslations;
    it: ProjectTranslations;
  };
  image: string; // Deprecated - kept for backward compatibility
  images?: ProjectImage[]; // New field for Azure Blob Storage images
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: "web" | "mobile" | "fullstack";
  featured?: boolean;
  published?: boolean;
}

// Technology interfaces
export interface TechnologyTranslations {
  name: string;
}

export interface Technology {
  id: string;
  name: string; // Fallback para compatibilidad
  category: "frontend" | "backend" | "mobile" | "database" | "deployment";
  icon: string;
  translations: {
    en: TechnologyTranslations;
    es: TechnologyTranslations;
    it: TechnologyTranslations;
  };
}

// Review interfaces
export interface ReviewTranslations {
  text: string;
  author: string;
  company: string;
  position: string;
}

export interface Review {
  id: string;
  text: string; // Fallback para compatibilidad
  author: string; // Fallback para compatibilidad
  company: string; // Fallback para compatibilidad
  position: string; // Fallback para compatibilidad
  translations: {
    en: ReviewTranslations;
    es: ReviewTranslations;
    it: ReviewTranslations;
  };
  rating: number; // 1-5 estrellas
  avatar?: string;
  date: string;
}

// Team Member interfaces
export interface TeamMemberTranslations {
  name: string;
  role: string;
  description: string;
}

export interface TeamMember {
  id: string;
  translations: {
    en: TeamMemberTranslations;
    es: TeamMemberTranslations;
    it: TeamMemberTranslations;
  };
  avatar: string;
  avatar_blob_key?: string;
  category: "cofounder" | "developer";
  order: number;
  published: boolean;
}

// Case Study interfaces
export interface ProjectHighlightTranslations {
  title: string;
  subtitle: string;
  challenge: string;
  solution: string;
  results: string;
  features: string[];
}

export interface TechStackItem {
  name: string;
  icon: string;
  category: string;
}

export interface MetricItem {
  label: string;
  value: string;
  icon?: string;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  avatar?: string;
}

export interface ProjectHighlight {
  id: string;
  title: string;
  subtitle: string;
  translations: {
    en: ProjectHighlightTranslations;
    es: ProjectHighlightTranslations;
    it: ProjectHighlightTranslations;
  };
  image: string;
  images?: ProjectImage[];
  technologies: string[];
  tech_stack?: TechStackItem[];
  metrics?: MetricItem[];
  client_name?: string;
  client_logo?: string;
  industry?: string;
  testimonial?: Testimonial;
  project_id?: string;
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
  architecture_diagram?: string;
  category: "web" | "mobile" | "fullstack";
  featured?: boolean;
  published?: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

// Context type - now just a wrapper around Supabase
export interface DataContextType {
  projects: Project[];
  technologies: Technology[];
  reviews: Review[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTechnology: (technology: Omit<Technology, "id">) => void;
  updateTechnology: (id: string, technology: Partial<Technology>) => void;
  deleteTechnology: (id: string) => void;
  addReview: (review: Omit<Review, "id">) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component - now just a wrapper around SupabaseProvider
export function DataProvider({ children }: { children: React.ReactNode }) {
  const supabaseData = useSupabase();

  return (
    <DataContext.Provider
      value={{
        projects: supabaseData.projects,
        technologies: supabaseData.technologies,
        reviews: supabaseData.reviews,
        addProject: supabaseData.addProject,
        updateProject: supabaseData.updateProject,
        deleteProject: supabaseData.deleteProject,
        addTechnology: supabaseData.addTechnology,
        updateTechnology: supabaseData.updateTechnology,
        deleteTechnology: supabaseData.deleteTechnology,
        addReview: supabaseData.addReview,
        updateReview: supabaseData.updateReview,
        deleteReview: supabaseData.deleteReview,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Hook to use the context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
