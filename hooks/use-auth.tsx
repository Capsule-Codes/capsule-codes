"use client";

import { createContext, useContext, useState, useEffect } from "react";

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
    let cancelled = false;

    const checkSession = async () => {
      // Optimistically hydrate from localStorage for snappier UI
      try {
        const storedUser = localStorage.getItem("admin_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (!cancelled) {
            setUser(userData);
            setIsAdmin(true);
          }
        }
      } catch {
        // ignore parse errors
      }

      // Source of truth: server session cookie
      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          credentials: "include",
        });
        if (cancelled) return;
        if (res.ok) {
          const body = await res.json();
          if (body?.user?.email) {
            const userData = { email: body.user.email };
            localStorage.setItem("admin_user", JSON.stringify(userData));
            setUser(userData);
            setIsAdmin(true);
          } else {
            localStorage.removeItem("admin_user");
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          localStorage.removeItem("admin_user");
          setUser(null);
          setIsAdmin(false);
        }
      } catch {
        // Network error — keep optimistic state, but don't trust it
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: body?.error ?? "Sign in failed" };
      }

      const body = await res.json();
      const userData = { email: body.user.email };
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(true);

      return { error: null };
    } catch {
      return { error: "Network error" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore — still clear local state
    }
    localStorage.removeItem("admin_user");
    setUser(null);
    setIsAdmin(false);
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
