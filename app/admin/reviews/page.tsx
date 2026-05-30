"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Topbar } from "@/components/admin/topbar";
import {
  MultilingualTabs,
  type LangCode,
} from "@/components/admin/multilingual-tabs";
import { useSupabase } from "@/lib/supabase-context";
import { Plus, Pencil, Trash2, Save, X, Loader2, Upload } from "lucide-react";
import type { Review } from "@/lib/data-context";

interface ReviewLangFields {
  text: string;
  author: string;
  company: string;
  position: string;
}

interface ReviewForm {
  text: string;
  author: string;
  company: string;
  position: string;
  translations: {
    en: ReviewLangFields;
    es: ReviewLangFields;
    it: ReviewLangFields;
  };
  rating: number;
  avatar: string;
  date: string;
}

const TODAY = () => new Date().toISOString().split("T")[0];

const emptyLang: ReviewLangFields = {
  text: "",
  author: "",
  company: "",
  position: "",
};

const buildEmptyForm = (): ReviewForm => ({
  text: "",
  author: "",
  company: "",
  position: "",
  translations: {
    en: { ...emptyLang },
    es: { ...emptyLang },
    it: { ...emptyLang },
  },
  rating: 5,
  avatar: "",
  date: TODAY(),
});

const inputClass =
  "w-full bg-[color:var(--input-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50";

const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block";

const primaryBtn =
  "brand-grad text-on-grad rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
const ghostBtn =
  "bg-[color:var(--hover-bg)] text-foreground border border-[color:var(--ink-line)] rounded-full px-4 py-2 text-sm inline-flex items-center gap-2 hover:bg-[color:var(--hover-bg-strong)] transition";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error) || "Unknown error";
}

function clampRating(value: number): number {
  if (Number.isNaN(value)) return 1;
  if (value < 1) return 1;
  if (value > 5) return 5;
  return Math.round(value);
}

export default function AdminReviewsPage() {
  const {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    refreshData,
  } = useSupabase();

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<ReviewForm>(buildEmptyForm);
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Avatar upload state
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // ------------- sorting -------------
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return bTime - aTime;
    });
  }, [reviews]);

  // ------------- handlers -------------
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setForm({
      text: review.text,
      author: review.author,
      company: review.company,
      position: review.position,
      translations: review.translations ?? {
        en: {
          text: review.text,
          author: review.author,
          company: review.company,
          position: review.position,
        },
        es: {
          text: review.text,
          author: review.author,
          company: review.company,
          position: review.position,
        },
        it: {
          text: review.text,
          author: review.author,
          company: review.company,
          position: review.position,
        },
      },
      rating: review.rating,
      avatar: review.avatar ?? "",
      date: review.date,
    });
    setAvatarPreview(review.avatar ?? "");
    setSelectedAvatar(null);
    setIsDialogOpen(true);
  };

  const handleNewReview = () => {
    setEditingReview(null);
    setForm(buildEmptyForm());
    setAvatarPreview("");
    setSelectedAvatar(null);
    setIsDialogOpen(true);
  };

  const resetReviewForm = () => {
    setEditingReview(null);
    setForm(buildEmptyForm());
    setAvatarPreview("");
    setSelectedAvatar(null);
    setIsDialogOpen(false);
  };

  const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveReview = async () => {
    if (
      form.rating < 1 ||
      form.rating > 5 ||
      Number.isNaN(form.rating)
    ) {
      alert("Rating must be between 1 and 5");
      return;
    }

    setIsSavingReview(true);
    setUploadingAvatar(true);
    try {
      let avatarUrl = form.avatar;

      // Use EN as fallback for legacy plain fields
      const reviewData = {
        text: form.translations.en.text || form.text,
        author: form.translations.en.author || form.author,
        company: form.translations.en.company || form.company,
        position: form.translations.en.position || form.position,
        translations: form.translations,
        rating: form.rating,
        avatar: avatarUrl,
        date: form.date,
      };

      let reviewId: string;
      if (editingReview) {
        await updateReview(editingReview.id, reviewData);
        reviewId = editingReview.id;
      } else {
        const newReview = await addReview(reviewData);
        reviewId = newReview?.id ?? "";
      }

      // Upload avatar if a file was selected
      if (selectedAvatar && reviewId) {
        const formData = new FormData();
        formData.append("avatar", selectedAvatar);

        const response = await fetch(
          `/api/admin/reviews/${reviewId}/avatar`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error uploading avatar");
        }

        const result = await response.json();
        avatarUrl = result.avatarUrl;

        await updateReview(reviewId, { avatar: avatarUrl });
      }

      await refreshData();
      resetReviewForm();
    } catch (err) {
      const msg = getErrorMessage(err);
      console.error("Error saving review:", err);
      alert(`Error saving review: ${msg}`);
    } finally {
      setIsSavingReview(false);
      setUploadingAvatar(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      await refreshData();
    } catch (err) {
      const msg = getErrorMessage(err);
      console.error("Error deleting review:", err);
      alert(`Error deleting review: ${msg}`);
    }
  };

  const updateLang = (
    lang: LangCode,
    field: keyof ReviewLangFields,
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
      form.translations.en.text &&
        form.translations.en.author &&
        form.translations.en.company &&
        form.translations.en.position,
    ),
    es: Boolean(
      form.translations.es.text &&
        form.translations.es.author &&
        form.translations.es.company &&
        form.translations.es.position,
    ),
    it: Boolean(
      form.translations.it.text &&
        form.translations.it.author &&
        form.translations.it.company &&
        form.translations.it.position,
    ),
  };

  const isValid =
    Boolean(form.translations.en.text.trim()) &&
    Boolean(form.translations.en.author.trim()) &&
    Boolean(form.translations.en.company.trim()) &&
    Boolean(form.translations.en.position.trim());

  // ------------- render -------------
  return (
    <div className="p-8 lg:p-12 max-w-6xl">
      <Topbar
        title="Reviews"
        subtitle={`${reviews.length} reviews · multilingual · with avatars`}
        actions={
          <button
            type="button"
            onClick={handleNewReview}
            className={primaryBtn}
          >
            <Plus className="w-4 h-4" />
            New Review
          </button>
        }
      />

      {/* List */}
      <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl overflow-hidden">
        {sortedReviews.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[color:var(--ink-muted)]">
            No reviews yet. Click{" "}
            <span className="text-foreground">+ New Review</span> to add one.
          </div>
        )}

        {sortedReviews.map((r) => {
          const author = r.translations?.en?.author ?? r.author;
          const company = r.translations?.en?.company ?? r.company;
          const position = r.translations?.en?.position ?? r.position;
          const initial = (author || "?").charAt(0).toUpperCase();
          const formattedDate = (() => {
            try {
              return new Date(r.date).toLocaleDateString();
            } catch {
              return r.date;
            }
          })();
          return (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-3.5 border-b border-[color:var(--ink-line)] last:border-b-0 hover:bg-[color:var(--hover-bg)] transition"
            >
              {/* Avatar */}
              <div className="size-9 rounded-full overflow-hidden bg-gradient-to-br from-[oklch(0.4_0.15_180)] to-[oklch(0.5_0.18_155)] shadow-[0_0_12px_oklch(0.5_0.15_180_/_0.3)] shrink-0 flex items-center justify-center">
                {r.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.avatar}
                    alt={author}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-black/80">
                    {initial}
                  </span>
                )}
              </div>

              {/* Main column */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{author}</p>
                <p className="font-mono text-[11px] text-[color:var(--ink-muted)] truncate">
                  {position} · {company}
                </p>
              </div>

              {/* Stars */}
              <div
                className="hidden sm:flex items-center gap-0.5 text-[13px] shrink-0"
                aria-label={`${r.rating} of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={
                      i <= r.rating
                        ? "text-[color:oklch(0.85_0.16_90)]"
                        : "text-[color:var(--ink-muted)]/40"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Date */}
              <div className="hidden md:block font-mono text-[11px] text-[color:var(--ink-muted)] shrink-0">
                {formattedDate}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditReview(r)}
                  className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-foreground transition"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(r.id)}
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
        onOpenChange={(open) =>
          open ? setIsDialogOpen(true) : resetReviewForm()
        }
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
                {editingReview ? "Edit Review" : "New Review"}
              </DialogTitle>
              <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">
                {editingReview
                  ? `editing · ${editingReview.id.slice(0, 8)}`
                  : "create a new review"}
              </p>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Top row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass} htmlFor="review-rating">
                    Rating (1-5)
                  </label>
                  <input
                    id="review-rating"
                    type="number"
                    min={1}
                    max={5}
                    step={1}
                    value={form.rating}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rating: clampRating(
                          Number.parseInt(e.target.value, 10),
                        ),
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="review-date">
                    Date
                  </label>
                  <input
                    id="review-date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="review-avatar-url">
                    Avatar URL
                  </label>
                  <input
                    id="review-avatar-url"
                    type="url"
                    value={form.avatar}
                    onChange={(e) => {
                      setForm({ ...form, avatar: e.target.value });
                      if (!selectedAvatar) setAvatarPreview(e.target.value);
                    }}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Avatar upload */}
              <div>
                <span className={labelClass}>Avatar Upload</span>
                <div className="flex items-center gap-3">
                  <label className={`${ghostBtn} cursor-pointer`}>
                    <Upload className="w-4 h-4" />
                    Choose file
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <div className="size-12 rounded-full overflow-hidden border border-[color:var(--ink-line)] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {selectedAvatar && (
                    <span className="font-mono text-[11px] text-[color:var(--ink-muted)] truncate">
                      {selectedAvatar.name}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-[color:var(--ink-muted)] mt-1.5">
                  Optional. Uploads to{" "}
                  <span className="text-foreground">
                    /api/admin/reviews/[id]/avatar
                  </span>{" "}
                  after the review is saved.
                </p>
              </div>

              {/* Multilingual */}
              <div>
                <span className={labelClass}>Multilingual Content</span>
                <MultilingualTabs completion={formCompletion}>
                  {(lang) => (
                    <div className="space-y-3 mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>
                            Author ({lang})
                            {lang === "en" && (
                              <span className="text-[color:oklch(0.65_0.2_25)]">
                                {" "}
                                *
                              </span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={form.translations[lang].author}
                            onChange={(e) =>
                              updateLang(lang, "author", e.target.value)
                            }
                            placeholder="Full name"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Position ({lang})
                            {lang === "en" && (
                              <span className="text-[color:oklch(0.65_0.2_25)]">
                                {" "}
                                *
                              </span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={form.translations[lang].position}
                            onChange={(e) =>
                              updateLang(lang, "position", e.target.value)
                            }
                            placeholder="Role / title"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>
                          Company ({lang})
                          {lang === "en" && (
                            <span className="text-[color:oklch(0.65_0.2_25)]">
                              {" "}
                              *
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={form.translations[lang].company}
                          onChange={(e) =>
                            updateLang(lang, "company", e.target.value)
                          }
                          placeholder="Company"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Text ({lang})
                          {lang === "en" && (
                            <span className="text-[color:oklch(0.65_0.2_25)]">
                              {" "}
                              *
                            </span>
                          )}
                        </label>
                        <textarea
                          value={form.translations[lang].text}
                          onChange={(e) =>
                            updateLang(lang, "text", e.target.value)
                          }
                          placeholder="Review content"
                          rows={4}
                          className={`${inputClass} min-h-24 resize-y`}
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
                  onClick={resetReviewForm}
                  className={ghostBtn}
                  disabled={isSavingReview}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  disabled={isSavingReview || !isValid}
                  className={primaryBtn}
                >
                  {isSavingReview ? (
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
