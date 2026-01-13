import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          translations: {
            en: { title: string; subtitle?: string; description: string };
            es: { title: string; subtitle?: string; description: string };
            it: { title: string; subtitle?: string; description: string };
          };
          image: string;
          technologies: string[];
          live_url?: string;
          github_url?: string;
          category: "web" | "mobile" | "fullstack";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          translations: {
            en: { title: string; subtitle?: string; description: string };
            es: { title: string; subtitle?: string; description: string };
            it: { title: string; subtitle?: string; description: string };
          };
          image: string;
          technologies: string[];
          live_url?: string;
          github_url?: string;
          category: "web" | "mobile" | "fullstack";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          translations?: {
            en: { title: string; subtitle?: string; description: string };
            es: { title: string; subtitle?: string; description: string };
            it: { title: string; subtitle?: string; description: string };
          };
          image?: string;
          technologies?: string[];
          live_url?: string;
          github_url?: string;
          category?: "web" | "mobile" | "fullstack";
          created_at?: string;
          updated_at?: string;
        };
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category:
            | "frontend"
            | "backend"
            | "mobile"
            | "database"
            | "deployment";
          icon: string;
          description: string;
          translations: {
            en: { name: string; description: string };
            es: { name: string; description: string };
            it: { name: string; description: string };
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category:
            | "frontend"
            | "backend"
            | "mobile"
            | "database"
            | "deployment";
          icon: string;
          description: string;
          translations: {
            en: { name: string; description: string };
            es: { name: string; description: string };
            it: { name: string; description: string };
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?:
            | "frontend"
            | "backend"
            | "mobile"
            | "database"
            | "deployment";
          icon?: string;
          description?: string;
          translations?: {
            en: { name: string; description: string };
            es: { name: string; description: string };
            it: { name: string; description: string };
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          text: string;
          author: string;
          company: string;
          position: string;
          translations: {
            en: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
            es: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
            it: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
          };
          rating: number;
          avatar?: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          author: string;
          company: string;
          position: string;
          translations: {
            en: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
            es: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
            it: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
          };
          rating: number;
          avatar?: string;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          author?: string;
          company?: string;
          position?: string;
          translations?: {
            en: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
            es: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
            it: {
              text: string;
              author: string;
              company: string;
              position: string;
            };
          };
          rating?: number;
          avatar?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
