"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Capsule } from "@/components/ui/capsule";
import { Topbar } from "@/components/admin/topbar";
import {
  MultilingualTabs,
  type LangCode,
} from "@/components/admin/multilingual-tabs";
import { useSupabase } from "@/lib/supabase-context";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import type { TeamMember } from "@/lib/data-context";

type TeamCategory = "cofounder" | "developer";

interface TeamForm {
  category: TeamCategory;
  avatar: string;
  order: number;
  published: boolean;
  translations: {
    en: { name: string; role: string; description: string };
    es: { name: string; role: string; description: string };
    it: { name: string; role: string; description: string };
  };
}

const EMPTY_FORM: TeamForm = {
  category: "cofounder",
  avatar: "",
  order: 0,
  published: true,
  translations: {
    en: { name: "", role: "", description: "" },
    es: { name: "", role: "", description: "" },
    it: { name: "", role: "", description: "" },
  },
};

const inputClass =
  "w-full bg-[color:var(--input-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50";

const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block";

const primaryBtn =
  "brand-grad text-on-grad rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
const ghostBtn =
  "bg-white/[0.05] text-foreground border border-white/[0.1] rounded-full px-4 py-2 text-sm inline-flex items-center gap-2 hover:bg-white/[0.08] transition";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error) || "Unknown error";
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminTeamPage() {
  const {
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refreshData,
  } = useSupabase();

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<TeamForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // ------------- sorting -------------
  const sortedMembers = useMemo(() => {
    const categoryRank: Record<TeamCategory, number> = {
      cofounder: 0,
      developer: 1,
    };
    return [...teamMembers].sort((a, b) => {
      const catDiff =
        (categoryRank[a.category] ?? 99) - (categoryRank[b.category] ?? 99);
      if (catDiff !== 0) return catDiff;

      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;

      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, [teamMembers]);

  // ------------- handlers -------------
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      category: member.category,
      avatar: member.avatar ?? "",
      order: member.order ?? 0,
      published: member.published ?? true,
      translations: {
        en: {
          name: member.translations?.en?.name ?? "",
          role: member.translations?.en?.role ?? "",
          description: member.translations?.en?.description ?? "",
        },
        es: {
          name: member.translations?.es?.name ?? "",
          role: member.translations?.es?.role ?? "",
          description: member.translations?.es?.description ?? "",
        },
        it: {
          name: member.translations?.it?.name ?? "",
          role: member.translations?.it?.role ?? "",
          description: member.translations?.it?.description ?? "",
        },
      },
    });
    setIsDialogOpen(true);
  };

  const handleNewMember = () => {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        category: form.category,
        avatar: form.avatar.trim() || null,
        avatar_blob_key: editingMember?.avatar_blob_key ?? null,
        order: form.order,
        published: form.published,
        translations: form.translations,
      };
      if (editingMember) {
        await updateTeamMember(editingMember.id, payload);
      } else {
        // Server sets id/created_at/updated_at.
        await addTeamMember(
          payload as Omit<TeamMember, "id" | "created_at" | "updated_at">,
        );
      }
      await refreshData();
      resetForm();
    } catch (err) {
      const msg = getErrorMessage(err);
      console.error("Error saving team member:", err);
      alert(`Error saving: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteTeamMember(id);
      await refreshData();
    } catch (err) {
      const msg = getErrorMessage(err);
      console.error("Error deleting team member:", err);
      alert(`Error deleting: ${msg}`);
    }
  };

  const updateLang = (
    lang: LangCode,
    field: "name" | "role" | "description",
    value: string,
  ) => {
    setForm({
      ...form,
      translations: {
        ...form.translations,
        [lang]: {
          ...form.translations[lang],
          [field]: value,
        },
      },
    });
  };

  // ------------- completion (for tabs) -------------
  const formCompletion: Record<LangCode, boolean> = {
    en: Boolean(
      form.translations.en.name &&
        form.translations.en.role &&
        form.translations.en.description,
    ),
    es: Boolean(
      form.translations.es.name &&
        form.translations.es.role &&
        form.translations.es.description,
    ),
    it: Boolean(
      form.translations.it.name &&
        form.translations.it.role &&
        form.translations.it.description,
    ),
  };

  const isValid =
    Boolean(form.translations.en.name.trim()) &&
    Boolean(form.translations.en.role.trim()) &&
    Boolean(form.translations.en.description.trim());

  // ------------- render -------------
  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <Topbar
        title="Team"
        subtitle={`${teamMembers.length} members · multilingual`}
        actions={
          <button
            type="button"
            onClick={handleNewMember}
            className={primaryBtn}
          >
            <Plus className="w-4 h-4" />
            New Member
          </button>
        }
      />

      {/* List */}
      <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl overflow-hidden">
        {sortedMembers.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[color:var(--ink-muted)]">
            No team members yet. Click{" "}
            <span className="text-foreground">+ New Member</span> to add one.
          </div>
        )}

        {sortedMembers.map((m) => {
          const name = m.translations?.en?.name ?? "";
          const role = m.translations?.en?.role ?? "";
          return (
            <div
              key={m.id}
              className="flex items-center gap-4 px-5 py-3.5 border-b border-[color:var(--ink-line)] last:border-b-0 hover:bg-white/[0.02] transition"
            >
              {/* Avatar */}
              <div
                className="size-9 rounded-full overflow-hidden bg-gradient-to-br from-[oklch(0.4_0.15_180)] to-[oklch(0.5_0.18_155)] shadow-[0_0_12px_oklch(0.5_0.15_180_/_0.3)] shrink-0"
              >
                {m.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                <p className="font-mono text-[11px] text-[color:var(--ink-muted)] truncate">
                  {role}
                </p>
              </div>

              {/* Category */}
              <div className="hidden sm:block">
                <Capsule size="sm" dot={false}>
                  {capitalize(m.category)}
                </Capsule>
              </div>

              {/* Order */}
              <div className="hidden md:block text-[11px] text-[color:var(--ink-muted)] font-mono w-10 text-right">
                #{m.order ?? "—"}
              </div>

              {/* Published */}
              <div className="hidden md:block">
                <Capsule
                  size="sm"
                  dot={false}
                  variant={m.published ? "success" : "warning"}
                >
                  {m.published ? "published" : "draft"}
                </Capsule>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditMember(m)}
                  className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-white/[0.05] hover:text-foreground transition"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
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

      {/* Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => (open ? setIsDialogOpen(true) : resetForm())}
      >
        <DialogContent
          className="!max-w-3xl !max-h-[90vh] overflow-y-auto !border-[color:oklch(0.5_0.18_180_/_0.4)] !p-0"
          style={{
            background:
              "radial-gradient(ellipse at top right, oklch(0.4 0.18 180 / 0.25), transparent 60%), var(--ink-bg-2)",
          }}
        >
          <div className="p-7">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-[-0.01em]">
                {editingMember ? "Edit Member" : "New Member"}
              </DialogTitle>
              <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">
                {editingMember
                  ? `editing · ${editingMember.id.slice(0, 8)}`
                  : "create a new team member"}
              </p>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Top row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass} htmlFor="team-category">
                    Category
                  </label>
                  <select
                    id="team-category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as TeamCategory,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="cofounder">Cofounder</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="team-order">
                    Order
                  </label>
                  <input
                    id="team-order"
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        order: Number.parseInt(e.target.value, 10) || 0,
                      })
                    }
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <span className={labelClass}>Status</span>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-white/[0.03] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 hover:bg-white/[0.05] transition">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) =>
                        setForm({ ...form, published: e.target.checked })
                      }
                      className="size-4 accent-[color:var(--brand-green)]"
                    />
                    <span className="text-sm">Published</span>
                  </label>
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className={labelClass} htmlFor="team-avatar">
                  Avatar URL
                </label>
                <input
                  id="team-avatar"
                  type="url"
                  value={form.avatar}
                  onChange={(e) =>
                    setForm({ ...form, avatar: e.target.value })
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
                <p className="font-mono text-[10px] text-[color:var(--ink-muted)] mt-1.5">
                  Optional. Public URL for the profile picture.
                </p>
              </div>

              {/* Multilingual */}
              <div>
                <span className={labelClass}>Multilingual Content</span>
                <MultilingualTabs completion={formCompletion}>
                  {(lang) => (
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className={labelClass}>
                          Name ({lang})
                          {lang === "en" && (
                            <span className="text-[color:oklch(0.65_0.2_25)]">
                              {" "}
                              *
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={form.translations[lang].name}
                          onChange={(e) =>
                            updateLang(lang, "name", e.target.value)
                          }
                          placeholder="Full name"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Role ({lang})
                          {lang === "en" && (
                            <span className="text-[color:oklch(0.65_0.2_25)]">
                              {" "}
                              *
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={form.translations[lang].role}
                          onChange={(e) =>
                            updateLang(lang, "role", e.target.value)
                          }
                          placeholder="Role / title"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Description ({lang})
                          {lang === "en" && (
                            <span className="text-[color:oklch(0.65_0.2_25)]">
                              {" "}
                              *
                            </span>
                          )}
                        </label>
                        <textarea
                          value={form.translations[lang].description}
                          onChange={(e) =>
                            updateLang(lang, "description", e.target.value)
                          }
                          placeholder="Short bio"
                          rows={3}
                          className={`${inputClass} min-h-20 resize-y`}
                        />
                      </div>
                    </div>
                  )}
                </MultilingualTabs>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[color:var(--ink-line)]">
                <button
                  type="button"
                  onClick={resetForm}
                  className={ghostBtn}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !isValid}
                  className={primaryBtn}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
