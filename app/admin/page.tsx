"use client";
import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/lib/supabase-context";
import { OverviewCard } from "@/components/admin/overview-card";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { projects, technologies, reviews, contactMessages, teamMembers } = useSupabase();

  const unreadCount = contactMessages.filter((m) => m.status === "unread").length;
  const name = user?.email?.split("@")[0] ?? "admin";

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Hi, {name} 👋</h1>
        <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">signed in as admin</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard href="/admin/projects"     title="Projects"     description="Manage published work, images and translations." count={projects.length} />
        <OverviewCard href="/admin/technologies" title="Technologies" description="Tools and stack featured on the homepage."       count={technologies.length} />
        <OverviewCard href="/admin/team"         title="Team"         description="Cofounders and developers shown on the home page." count={teamMembers.length} />
        <OverviewCard href="/admin/reviews"      title="Reviews"      description="Client testimonials, multilingual, with ratings." count={reviews.length} />
        <OverviewCard href="/admin/contact-info" title="Contact Info" description="Email, phone, location displayed on contact section." />
        <OverviewCard href="/admin/messages"     title="Messages"     description="Contact form submissions inbox."                  count={unreadCount} />
      </div>
    </div>
  );
}
