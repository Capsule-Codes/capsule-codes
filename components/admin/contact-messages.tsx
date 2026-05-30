"use client";

import { useSupabase } from "@/lib/supabase-context";
import { useLanguage } from "@/hooks/use-language";
import { Capsule } from "@/components/ui/capsule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Trash2, Eye, Calendar, Building, Inbox } from "lucide-react";
import type { ContactMessage } from "@/lib/types/contact";

const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block";

const selectClass =
  "w-full bg-[color:var(--input-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50";

type CapsuleVariant = "default" | "info" | "success" | "warning";

const statusVariant: Record<ContactMessage["status"], CapsuleVariant> = {
  unread: "info",
  read: "default",
  replied: "success",
  archived: "warning",
};

export function ContactMessages() {
  const { t } = useLanguage();
  const { contactMessages, updateContactMessageStatus, deleteContactMessage, refreshData } = useSupabase();

  const getStatusBadge = (status: ContactMessage["status"]) => {
    const variant = statusVariant[status];
    return (
      <Capsule size="sm" dot={false} variant={variant}>
        {t.admin.contactMessages.statuses[status]}
      </Capsule>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (id: string, status: ContactMessage["status"]) => {
    try {
      await updateContactMessageStatus(id, status);
      await refreshData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.contactMessages.deleteConfirm)) {
      return;
    }

    try {
      await deleteContactMessage(id);
      await refreshData();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (contactMessages.length === 0) {
    return (
      <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-12 text-center">
        <Inbox className="w-10 h-10 mx-auto mb-4 text-[color:var(--ink-muted)]" />
        <p className="text-sm text-[color:var(--ink-muted)]">
          {t.admin.contactMessages.noMessages}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl overflow-hidden">
      {contactMessages.map((message) => {
        const initial = (message.name || "?").charAt(0).toUpperCase();
        return (
          <div
            key={message.id}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-[color:var(--ink-line)] last:border-b-0 hover:bg-white/[0.02] transition"
          >
            {/* Avatar */}
            <div className="size-9 rounded-full bg-gradient-to-br from-[oklch(0.4_0.15_180)] to-[oklch(0.5_0.18_155)] shadow-[0_0_12px_oklch(0.5_0.15_180_/_0.3)] shrink-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-black/80">{initial}</span>
            </div>

            {/* Main column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium truncate">{message.name}</p>
                {getStatusBadge(message.status)}
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-[color:var(--ink-muted)]">
                <span className="inline-flex items-center gap-1 truncate min-w-0">
                  <Mail className="w-3 h-3 shrink-0" />
                  <a
                    href={`mailto:${message.email}`}
                    className="truncate hover:text-foreground transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {message.email}
                  </a>
                </span>
                {message.company && (
                  <span className="hidden sm:inline-flex items-center gap-1 truncate min-w-0">
                    <Building className="w-3 h-3 shrink-0" />
                    <span className="truncate">{message.company}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="hidden md:flex items-center gap-1 font-mono text-[11px] text-[color:var(--ink-muted)] shrink-0">
              <Calendar className="w-3 h-3" />
              {formatDate(message.created_at)}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      if (message.status === "unread") {
                        handleStatusChange(message.id, "read");
                      }
                    }}
                    className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-white/[0.05] hover:text-foreground transition"
                    aria-label="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="!max-w-2xl !max-h-[90vh] overflow-y-auto !border-[color:oklch(0.5_0.18_180_/_0.4)] !p-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at top right, oklch(0.4 0.18 180 / 0.25), transparent 60%), var(--ink-bg-2)",
                  }}
                >
                  <div className="p-7">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold tracking-[-0.01em]">
                        {t.admin.contactMessages.messageFrom} {message.name}
                      </DialogTitle>
                      <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">
                        {formatDate(message.created_at)}
                      </p>
                    </DialogHeader>

                    <div className="space-y-5 mt-6">
                      <div>
                        <span className={labelClass}>
                          {t.admin.contactMessages.email}
                        </span>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-sm text-[color:var(--brand-cyan)] hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>

                      {message.company && (
                        <div>
                          <span className={labelClass}>
                            {t.admin.contactMessages.company}
                          </span>
                          <p className="text-sm">{message.company}</p>
                        </div>
                      )}

                      <div>
                        <span className={labelClass}>
                          {t.admin.contactMessages.message}
                        </span>
                        <div className="bg-[color:var(--input-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm whitespace-pre-wrap">
                          {message.message}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`status-${message.id}`}
                          className={labelClass}
                        >
                          {t.admin.contactMessages.status}
                        </label>
                        <select
                          id={`status-${message.id}`}
                          value={message.status}
                          onChange={(e) =>
                            handleStatusChange(
                              message.id,
                              e.target.value as ContactMessage["status"]
                            )
                          }
                          className={selectClass}
                        >
                          <option value="unread">
                            {t.admin.contactMessages.statuses.unread}
                          </option>
                          <option value="read">
                            {t.admin.contactMessages.statuses.read}
                          </option>
                          <option value="replied">
                            {t.admin.contactMessages.statuses.replied}
                          </option>
                          <option value="archived">
                            {t.admin.contactMessages.statuses.archived}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <button
                type="button"
                onClick={() => handleDelete(message.id)}
                className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-[color:oklch(0.5_0.2_25_/_0.15)] hover:text-[color:oklch(0.75_0.2_25)] hover:border-[color:oklch(0.5_0.2_25_/_0.3)] transition"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
