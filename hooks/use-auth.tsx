"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const checkSession = () => {
      const storedUser = localStorage.getItem("admin_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Query admin_credentials table
      const { data, error } = await supabase
        .from("admin_credentials")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !data) {
        return { error: "Invalid email or password" };
      }

      // Store user in localStorage
      const userData = { email: data.email };
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(true);

      return { error: null };
    } catch (error) {
      return { error: "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("admin_user");
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
