"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Capsule } from "@/components/ui/capsule";
import { Topbar } from "@/components/admin/topbar";
import { useSupabase } from "@/lib/supabase-context";
import type { Technology } from "@/lib/data-context";
import { Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";

type TechCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "database"
  | "deployment";

const CATEGORIES: TechCategory[] = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "deployment",
];

interface TechForm {
  name: string;
  icon: string;
  category: TechCategory;
}

const EMPTY_FORM: TechForm = {
  name: "",
  icon: "",
  category: "frontend",
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

export default function AdminTechnologiesPage() {
  const {
    technologies,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    refreshData,
  } = useSupabase();

  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [techForm, setTechForm] = useState<TechForm>(EMPTY_FORM);
  const [isSavingTech, setIsSavingTech] = useState(false);

  const isValid = Boolean(techForm.name.trim() && techForm.icon.trim());

  // ------------- handlers -------------
  const handleEditTechnology = (tech: Technology) => {
    setEditingTechnology(tech);
    setTechForm({
      name: tech.name,
      icon: tech.icon,
      category: tech.category,
    });
    setIsDialogOpen(true);
  };

  const handleNewTechnology = () => {
    setEditingTechnology(null);
    setTechForm(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  const resetTechForm = () => {
    setTechForm(EMPTY_FORM);
    setEditingTechnology(null);
    setIsDialogOpen(false);
  };

  const handleSaveTechnology = async () => {
    try {
      if (!techForm.name.trim() || !techForm.icon.trim()) {
        alert("Name and icon are required");
        return;
      }

      setIsSavingTech(true);

      const techData = {
        name: techForm.name,
        icon: techForm.icon,
        category: techForm.category,
        translations: {
          en: { name: techForm.name },
          es: { name: techForm.name },
          it: { name: techForm.name },
        },
      };

      if (editingTechnology) {
        await updateTechnology(editingTechnology.id, techData);
      } else {
        await addTechnology(techData);
      }

      await refreshData();
      resetTechForm();
    } catch (error) {
      console.error("Error saving technology:", error);
      const errorMessage = getErrorMessage(error);
      alert(`Error saving technology: ${errorMessage}`);
    } finally {
      setIsSavingTech(false);
    }
  };

  const handleDeleteTechnology = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this technology?")) {
      return;
    }
    try {
      await deleteTechnology(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error deleting technology:", error);
      alert(`Error deleting technology: ${errorMessage}`);
    }
  };

  // ------------- render -------------
  return (
    <div className="p-8 lg:p-12 max-w-5xl">
      <Topbar
        title="Technologies"
        subtitle={`${technologies.length} items · stack on homepage`}
        actions={
          <button
            type="button"
            onClick={handleNewTechnology}
            className={primaryBtn}
          >
            <Plus className="w-4 h-4" />
            New Technology
          </button>
        }
      />

      {/* List */}
      <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl overflow-hidden">
        {technologies.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[color:var(--ink-muted)]">
            No technologies yet. Click{" "}
            <span className="text-foreground">+ New Technology</span> to add
            one.
          </div>
        )}

        {technologies.map((tech) => (
          <div
            key={tech.id}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-[color:var(--ink-line)] last:border-b-0 hover:bg-white/[0.02] transition"
          >
            {/* Icon */}
            <div className="size-9 rounded-lg bg-gradient-to-b from-[oklch(0.3_0.08_180)] to-[oklch(0.2_0.05_170)] border border-[color:oklch(0.5_0.12_180_/_0.5)] flex items-center justify-center text-lg shrink-0">
              {tech.icon}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tech.name}</p>
            </div>

            {/* Category */}
            <div>
              <Capsule
                size="sm"
                dot={false}
                className="!text-[10px] capitalize"
              >
                {tech.category}
              </Capsule>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleEditTechnology(tech)}
                className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-white/[0.05] hover:text-foreground transition"
                aria-label="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTechnology(tech.id)}
                className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-[color:oklch(0.5_0.2_25_/_0.15)] hover:text-[color:oklch(0.75_0.2_25)] hover:border-[color:oklch(0.5_0.2_25_/_0.3)] transition"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) =>
          open ? setIsDialogOpen(true) : resetTechForm()
        }
      >
        <DialogContent
          className="!max-w-md !border-[color:oklch(0.5_0.18_180_/_0.4)] !p-0"
          style={{
            background:
              "radial-gradient(ellipse at top right, oklch(0.4 0.18 180 / 0.25), transparent 60%), var(--ink-bg-2)",
          }}
        >
          <div className="p-7">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-[-0.01em]">
                {editingTechnology ? "Edit Technology" : "New Technology"}
              </DialogTitle>
              <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">
                {editingTechnology
                  ? `editing · ${editingTechnology.id.slice(0, 8)}`
                  : "create a new technology"}
              </p>
            </DialogHeader>

            <div className="space-y-4 mt-6">
              {/* Name */}
              <div>
                <label className={labelClass} htmlFor="tech-name">
                  Name
                </label>
                <input
                  id="tech-name"
                  type="text"
                  value={techForm.name}
                  onChange={(e) =>
                    setTechForm({ ...techForm, name: e.target.value })
                  }
                  placeholder="React"
                  className={inputClass}
                />
              </div>

              {/* Icon */}
              <div>
                <label className={labelClass} htmlFor="tech-icon">
                  Icon (emoji)
                </label>
                <input
                  id="tech-icon"
                  type="text"
                  value={techForm.icon}
                  onChange={(e) =>
                    setTechForm({ ...techForm, icon: e.target.value })
                  }
                  placeholder="⚛️"
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelClass} htmlFor="tech-category">
                  Category
                </label>
                <select
                  id="tech-category"
                  value={techForm.category}
                  onChange={(e) =>
                    setTechForm({
                      ...techForm,
                      category: e.target.value as TechCategory,
                    })
                  }
                  className={inputClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[color:var(--ink-line)]">
                <button
                  type="button"
                  onClick={resetTechForm}
                  className={ghostBtn}
                  disabled={isSavingTech}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTechnology}
                  disabled={isSavingTech || !isValid}
                  className={primaryBtn}
                >
                  {isSavingTech ? (
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
