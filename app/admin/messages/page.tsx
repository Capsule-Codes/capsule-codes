"use client";
import { useSupabase } from "@/lib/supabase-context";
import { Topbar } from "@/components/admin/topbar";
import { ContactMessages } from "@/components/admin/contact-messages";

export default function AdminMessagesPage() {
  const { contactMessages } = useSupabase();
  const total = contactMessages.length;
  const unread = contactMessages.filter((m) => m.status === "unread").length;
  const replied = contactMessages.filter((m) => m.status === "replied").length;
  const archived = contactMessages.filter((m) => m.status === "archived").length;

  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <Topbar title="Messages" subtitle={`${total} total · ${unread} unread`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total" value={total} tone="neutral" />
        <StatCard label="Unread" value={unread} tone="info" />
        <StatCard label="Replied" value={replied} tone="success" />
        <StatCard label="Archived" value={archived} tone="warning" />
      </div>

      <ContactMessages />
    </div>
  );
}

type Tone = "neutral" | "info" | "success" | "warning";

function StatCard({ label, value, tone }: { label: string; value: number; tone: Tone }) {
  const toneClass =
    tone === "info"    ? "text-[color:var(--status-info-fg)]" :
    tone === "success" ? "text-[color:var(--status-success-fg)]" :
    tone === "warning" ? "text-[color:var(--status-warning-fg)]" :
    "text-foreground";
  return (
    <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-2">{label}</div>
      <div className={`text-2xl font-semibold tracking-[-0.02em] ${toneClass}`}>{value}</div>
    </div>
  );
}
