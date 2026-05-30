"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/lib/supabase-context";
import { Capsule } from "@/components/ui/capsule";
import { LayoutDashboard, FolderOpen, Code, Users, Star, Settings, Inbox, LogOut, Sun, Moon } from "lucide-react";

const NAV = [
  { href: "/admin",              label: "Overview",      Icon: LayoutDashboard, countKey: null },
  { href: "/admin/projects",     label: "Projects",      Icon: FolderOpen,      countKey: "projects" },
  { href: "/admin/technologies", label: "Technologies",  Icon: Code,            countKey: "technologies" },
  { href: "/admin/team",         label: "Team",          Icon: Users,           countKey: "teamMembers" },
  { href: "/admin/reviews",      label: "Reviews",       Icon: Star,            countKey: "reviews" },
  { href: "/admin/contact-info", label: "Contact Info",  Icon: Settings,        countKey: null },
  { href: "/admin/messages",     label: "Messages",      Icon: Inbox,           countKey: "unreadMessages" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { projects, technologies, teamMembers, reviews, contactMessages } = useSupabase();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const counts: Record<string, number> = {
    projects: projects.length,
    technologies: technologies.length,
    teamMembers: teamMembers.length,
    reviews: reviews.length,
    unreadMessages: contactMessages.filter((m) => m.status === "unread").length,
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";
  const name = user?.email?.split("@")[0] ?? "admin";

  return (
    <aside className="flex flex-col h-screen sticky top-0 bg-[color:var(--sidebar-bg)] border-r border-[color:var(--ink-line)] p-4">
      <div className="font-mono text-sm font-semibold tracking-tight pb-5 mb-3 border-b border-[color:var(--ink-line)] text-foreground">
        capsule<span className="text-[color:var(--brand-cyan)]">.</span>admin
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, Icon, countKey }) => {
          const active = pathname === href;
          const count = countKey ? counts[countKey] : null;
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm bg-[oklch(0.4_0.15_180_/_0.15)] text-foreground border border-[color:oklch(0.4_0.15_180_/_0.3)]"
                  : "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[color:var(--ink-muted)] hover:bg-[color:var(--ink-bg-2)] hover:text-foreground transition"
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {count !== null && count > 0 && (
                <Capsule size="sm" dot={false} className="!px-2 !py-0.5 !text-[10px]">{count}</Capsule>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-[color:var(--ink-line)] flex items-center gap-2.5">
        <div className="size-7 rounded-full bg-gradient-to-br from-[oklch(0.5_0.18_180)] to-[oklch(0.55_0.18_155)] inline-flex items-center justify-center text-[11px] font-semibold text-background shrink-0">{initial}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate text-foreground">{name}</div>
          <div className="font-mono text-[10px] text-[color:var(--ink-muted)]">admin</div>
        </div>
        {mounted && (
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme" className="size-7 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] hover:bg-[color:var(--ink-bg-2)] text-[color:var(--ink-muted)] hover:text-foreground transition">
            {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        )}
        <button onClick={signOut} aria-label="Sign out" className="size-7 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] hover:bg-[color:var(--ink-bg-2)] text-[color:var(--ink-muted)] hover:text-foreground transition">
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
