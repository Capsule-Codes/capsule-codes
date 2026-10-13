"use client";

import { useAuth, AuthProvider } from "@/hooks/use-auth";
import { SupabaseProvider } from "@/lib/supabase-context";
import { Sidebar } from "@/components/admin/sidebar";
import { LoginForm } from "@/components/admin/login-form";
import { Loader2 } from "lucide-react";

function AdminFrame({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-[color:var(--brand-cyan)]" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-background">
      <Sidebar />
      <main className="overflow-x-auto">{children}</main>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <AdminFrame>{children}</AdminFrame>
      </AuthProvider>
    </SupabaseProvider>
  );
}
