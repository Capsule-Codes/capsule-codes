"use client";

import type React from "react";
import { useState } from "react";
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
import { useLanguage } from "@/hooks/use-language";
import type { Project, ProjectImage } from "@/lib/data-context";
import { compressImages, validateImageFiles } from "@/lib/image-compression";
import { GRADIENT_PRESETS, CUSTOM_GRADIENT_KEY } from "@/lib/gradient-presets";
import { resolvePrimaryImage } from "@/lib/project-media";
import { validateCaseStudyJson } from "@/lib/case-study";
import {
  buildCoverPatch,
  validateCoverFile,
  COVER_WIDTH,
  COVER_HEIGHT,
} from "@/lib/project-cover";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  Star,
  Upload,
  ImageIcon,
} from "lucide-react";

type ProjectCategory = "web" | "mobile" | "fullstack";

interface ProjectForm {
  title: string;
  description: string;
  translations: {
    en: { title: string; subtitle: string; description: string };
    es: { title: string; subtitle: string; description: string };
    it: { title: string; subtitle: string; description: string };
  };
  image: string;
  technologies: string;
  category: ProjectCategory;
  imageOrientation: "horizontal" | "vertical" | "";
  liveUrl: string;
  appStoreUrl: string;
  playStoreUrl: string;
  gradientPreset: string;
  gradientFrom: string;
  gradientTo: string;
  coverMediaId: string;
  featured: boolean;
  published: boolean;
  showOnHome: boolean;
}

const EMPTY_FORM: ProjectForm = {
  title: "",
  description: "",
  translations: {
    en: { title: "", subtitle: "", description: "" },
    es: { title: "", subtitle: "", description: "" },
    it: { title: "", subtitle: "", description: "" },
  },
  image: "",
  technologies: "",
  category: "web",
  imageOrientation: "",
  liveUrl: "",
  appStoreUrl: "",
  playStoreUrl: "",
  gradientPreset: "",
  gradientFrom: "",
  gradientTo: "",
  coverMediaId: "",
  featured: false,
  published: false,
  showOnHome: true,
};

const CASE_STUDY_LOCALE_TEMPLATE = {
  subtitle: "",
  industry: "",
  role: "",
  summary: "",
  challenge: "",
  solution: "",
  highlights: [{ title: "", body: "" }],
  results: "",
};

/**
 * Skeleton for a new case study. Markdown is allowed in challenge/solution/results;
 * countries are ISO 3166-1 alpha-2 codes; industry/role are per locale
 * (meta.industry/meta.role remain as optional fallbacks).
 */
const CASE_STUDY_TEMPLATE = JSON.stringify(
  {
    meta: {
      year: new Date().getFullYear(),
      ongoing: false,
      countries: ["US"],
      platforms: ["iOS", "Android"],
      links: { web: "", appStore: "", googlePlay: "" },
    },
    en: CASE_STUDY_LOCALE_TEMPLATE,
    es: CASE_STUDY_LOCALE_TEMPLATE,
    it: CASE_STUDY_LOCALE_TEMPLATE,
  },
  null,
  2,
);

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

export default function AdminProjectsPage() {
  const { language } = useLanguage();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    refreshData,
  } = useSupabase();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>(EMPTY_FORM);

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);

  // Cover (projects.image) state
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState("");

  // Case study (projects.case_study) editor. Only sent when changed, so other
  // saves keep working before the `case_study` column exists.
  const [caseStudyText, setCaseStudyText] = useState("");
  const [caseStudyDirty, setCaseStudyDirty] = useState(false);
  const caseStudyCheck = validateCaseStudyJson(caseStudyText);

  // ------------- helpers -------------
  const getProjectContent = (project: Project) => {
    if (
      project.translations &&
      project.translations[language as keyof typeof project.translations]
    ) {
      return project.translations[
        language as keyof typeof project.translations
      ];
    }
    return {
      title: project.title,
      subtitle: "",
      description: project.description,
    };
  };

  const translationCompletion = (project: Project) => {
    const done = (["en", "es", "it"] as LangCode[]).filter((l) => {
      const t = project.translations?.[l];
      return t && t.title && t.subtitle && t.description;
    }).length;
    return done;
  };

  // ------------- handlers -------------
  const handleEditProject = (project: Project) => {
    const normalizedTranslations = {
      en: {
        title: project.translations?.en?.title ?? project.title,
        subtitle: project.translations?.en?.subtitle ?? "",
        description:
          project.translations?.en?.description ?? project.description,
      },
      es: {
        title: project.translations?.es?.title ?? project.title,
        subtitle: project.translations?.es?.subtitle ?? "",
        description:
          project.translations?.es?.description ?? project.description,
      },
      it: {
        title: project.translations?.it?.title ?? project.title,
        subtitle: project.translations?.it?.subtitle ?? "",
        description:
          project.translations?.it?.description ?? project.description,
      },
    };

    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      translations: normalizedTranslations,
      image: project.image,
      technologies: project.technologies.join(", "),
      category: project.category,
      imageOrientation: project.imageOrientation || "",
      liveUrl: project.liveUrl || "",
      appStoreUrl: project.appStoreUrl || "",
      playStoreUrl: project.playStoreUrl || "",
      gradientPreset: project.gradientPreset || "",
      gradientFrom: project.gradientFrom || "",
      gradientTo: project.gradientTo || "",
      coverMediaId: project.coverMediaId || "",
      featured: project.featured || false,
      published: project.published || false,
      showOnHome: project.showOnHome !== false,
    });
    setProjectImages(project.images || []);
    setSelectedImages([]);
    setImageUploadError("");
    setCaseStudyText(project.caseStudy ? JSON.stringify(project.caseStudy, null, 2) : "");
    setCaseStudyDirty(false);
    setIsDialogOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setProjectForm(EMPTY_FORM);
    setSelectedImages([]);
    setProjectImages([]);
    setImageUploadError("");
    setCaseStudyText("");
    setCaseStudyDirty(false);
    setIsDialogOpen(true);
  };

  const resetProjectForm = () => {
    setCoverError("");
    setEditingProject(null);
    setProjectForm(EMPTY_FORM);
    setSelectedImages([]);
    setProjectImages([]);
    setImageUploadError("");
    setCaseStudyText("");
    setCaseStudyDirty(false);
    setIsDialogOpen(false);
  };

  const handleSaveProject = async () => {
    try {
      setUploadingImages(true);
      setImageUploadError("");

      if (
        !projectForm.translations.en.subtitle ||
        !projectForm.translations.es.subtitle ||
        !projectForm.translations.it.subtitle
      ) {
        setImageUploadError(
          language === "es"
            ? "El subtítulo es obligatorio en todos los idiomas"
            : language === "it"
            ? "Il sottotitolo è obbligatorio in tutte le lingue"
            : "Subtitle is required in all languages",
        );
        setUploadingImages(false);
        return;
      }

      // Never save an invalid case study (checked before any write).
      if (caseStudyDirty && !caseStudyCheck.ok) {
        setImageUploadError(`Case study: ${caseStudyCheck.error}`);
        setUploadingImages(false);
        return;
      }

      // `image` is the marketing cover: keep it unless empty.
      const primaryImage = resolvePrimaryImage(
        projectForm.image,
        projectImages,
      );

      const projectData = {
        title: projectForm.translations.en.title || projectForm.title,
        description:
          projectForm.translations.en.description || projectForm.description,
        translations: projectForm.translations,
        image: primaryImage,
        technologies: projectForm.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        category: projectForm.category,
        imageOrientation: (projectForm.imageOrientation || undefined) as Project["imageOrientation"],
        liveUrl: projectForm.liveUrl,
        appStoreUrl: projectForm.appStoreUrl,
        playStoreUrl: projectForm.playStoreUrl,
        gradientPreset: projectForm.gradientPreset,
        gradientFrom: projectForm.gradientFrom,
        gradientTo: projectForm.gradientTo,
        coverMediaId: projectForm.coverMediaId,
        featured: projectForm.featured,
        published: projectForm.published,
        showOnHome: projectForm.showOnHome,
      };

      let projectId: string;

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        projectId = editingProject.id;
      } else {
        const newProject = await addProject(projectData);
        projectId = newProject?.id || "";
      }

      const caseStudyChanged =
        caseStudyDirty &&
        caseStudyCheck.ok &&
        JSON.stringify(caseStudyCheck.value) !==
          JSON.stringify(editingProject?.caseStudy ?? null);
      if (caseStudyChanged && caseStudyCheck.ok && projectId) {
        await updateProject(projectId, { caseStudy: caseStudyCheck.value });
      }

      // Upload images if any selected
      if (selectedImages.length > 0 && projectId) {
        const validation = validateImageFiles(selectedImages);
        if (!validation.valid) {
          setImageUploadError(
            `Invalid image formats: ${validation.invalidFiles.join(", ")}`,
          );
          setUploadingImages(false);
          return;
        }

        const compressedImages = await compressImages(selectedImages);

        const formData = new FormData();
        for (const file of compressedImages) {
          formData.append("images", file);
        }
        formData.append("altText", projectForm.translations.en.title);

        const response = await fetch(
          `/api/admin/projects/${projectId}/images`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setImageUploadError(errorData.message || "Error uploading images");
          setUploadingImages(false);
          return;
        }

        const result = await response.json();
        const updatedImages = [...projectImages, ...result.images];
        const newPrimaryImage = resolvePrimaryImage(
          projectForm.image,
          updatedImages,
        );

        await updateProject(projectId, {
          images: updatedImages,
          image: newPrimaryImage,
        } as Partial<Project>);
      }

      await refreshData();
      resetProjectForm();
      setUploadingImages(false);
    } catch (error) {
      console.error("Error saving project:", error);
      const errorMessage = getErrorMessage(error);
      setImageUploadError(`Error saving project: ${errorMessage}`);
      alert(`Error saving project: ${errorMessage}`);
      setUploadingImages(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const confirmMsg =
      language === "es"
        ? "¿Estás seguro de que quieres eliminar este proyecto?"
        : language === "it"
        ? "Sei sicuro di voler eliminare questo progetto?"
        : "Are you sure you want to delete this project?";
    if (!window.confirm(confirmMsg)) return;
    try {
      await deleteProject(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error deleting project:", error);
      alert(`Error deleting project: ${errorMessage}`);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImages(Array.from(files));
      setImageUploadError("");
    }
  };

  // The cover is saved immediately and independently of the form: it only ever
  // writes `projects.image`, never `images[]`. The previous cover file stays in
  // storage on purpose.
  const saveCover = async (url: string | null) => {
    if (!editingProject) return;
    await updateProject(editingProject.id, buildCoverPatch(url) as Partial<Project>);
    setProjectForm((f) => ({ ...f, image: url ?? "" }));
    await refreshData();
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editingProject) return;
    const check = validateCoverFile(file);
    if (!check.ok) {
      setCoverError(check.message);
      return;
    }
    setCoverBusy(true);
    setCoverError("");
    try {
      const formData = new FormData();
      formData.append("cover", file);
      const response = await fetch(
        `/api/admin/projects/${editingProject.id}/cover`,
        { method: "POST", body: formData },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error uploading cover");
      }
      const { url } = await response.json();
      await saveCover(url);
    } catch (error) {
      console.error("Error uploading cover:", error);
      setCoverError(getErrorMessage(error));
    } finally {
      setCoverBusy(false);
    }
  };

  const handleClearCover = async () => {
    setCoverBusy(true);
    setCoverError("");
    try {
      await saveCover(null);
    } catch (error) {
      setCoverError(getErrorMessage(error));
    } finally {
      setCoverBusy(false);
    }
  };

  const handleDeleteImage = async (image: ProjectImage) => {
    if (!editingProject) return;
    try {
      const response = await fetch(
        `/api/admin/projects/${editingProject.id}/images?blobKey=${encodeURIComponent(
          image.blobKey,
        )}&mediaId=${image.mediaId}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete image");

      const updatedImages = projectImages.filter(
        (img) => img.mediaId !== image.mediaId,
      );
      setProjectImages(updatedImages);

      // Keep the marketing cover; only re-point `image` if it was this screenshot.
      const newPrimaryImage = resolvePrimaryImage(
        projectForm.image,
        updatedImages,
        image.blobKey,
      );

      // If the deleted image was the selected cover, reset it (avoids a stale
      // cover_media_id pointing at a now-missing image).
      const coverCleared = projectForm.coverMediaId === image.mediaId;
      const nextCoverMediaId = coverCleared
        ? updatedImages[0]?.mediaId ?? ""
        : projectForm.coverMediaId;
      if (coverCleared) {
        setProjectForm((f) => ({ ...f, coverMediaId: nextCoverMediaId }));
      }

      await updateProject(editingProject.id, {
        images: updatedImages,
        image: newPrimaryImage,
        ...(coverCleared ? { coverMediaId: nextCoverMediaId } : {}),
      } as Partial<Project>);
      await refreshData();
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageUploadError("Error deleting image");
    }
  };

  // ------------- form completion (for tabs) -------------
  const formCompletion: Record<LangCode, boolean> = {
    en: Boolean(
      projectForm.translations.en.title &&
        projectForm.translations.en.subtitle &&
        projectForm.translations.en.description,
    ),
    es: Boolean(
      projectForm.translations.es.title &&
        projectForm.translations.es.subtitle &&
        projectForm.translations.es.description,
    ),
    it: Boolean(
      projectForm.translations.it.title &&
        projectForm.translations.it.subtitle &&
        projectForm.translations.it.description,
    ),
  };

  const updateLang = (
    lang: LangCode,
    field: "title" | "subtitle" | "description",
    value: string,
  ) => {
    setProjectForm({
      ...projectForm,
      translations: {
        ...projectForm.translations,
        [lang]: {
          ...projectForm.translations[lang],
          [field]: value,
        },
      },
    });
  };

  // ------------- render -------------
  return (
    <div className="p-8 lg:p-12 max-w-7xl">
      <Topbar
        title="Projects"
        subtitle={`${projects.length} items · multilingual · supabase images`}
        actions={
          <button
            type="button"
            onClick={handleNewProject}
            className={primaryBtn}
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        }
      />

      {/* List */}
      <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[64px_minmax(0,2fr)_140px_120px_120px_120px] gap-4 px-5 py-3 border-b border-[color:var(--ink-line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--ink-muted)]">
          <span></span>
          <span>Project</span>
          <span>Category</span>
          <span>Translations</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {projects.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[color:var(--ink-muted)]">
            No projects yet. Click <span className="text-foreground">+ New Project</span> to add one.
          </div>
        )}

        {projects.map((project) => {
          const content = getProjectContent(project);
          const transCount = translationCompletion(project);
          return (
            <div
              key={project.id}
              className="grid grid-cols-1 md:grid-cols-[64px_minmax(0,2fr)_140px_120px_120px_120px] items-center gap-4 px-5 py-4 border-b border-[color:var(--ink-line)] last:border-b-0 hover:bg-[color:var(--hover-bg)] transition"
            >
              {/* Thumb */}
              <div className="size-12 rounded-lg overflow-hidden border border-[color:var(--ink-line)] bg-gradient-to-br from-[color:oklch(0.4_0.18_180_/_0.4)] to-[color:oklch(0.45_0.18_155_/_0.4)] flex items-center justify-center shrink-0">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-4 h-4 text-white/40" />
                )}
              </div>

              {/* Title + subtitle */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {content.title || project.title}
                  </p>
                  {project.featured && (
                    <Star className="w-3 h-3 text-[color:var(--brand-cyan)] fill-current shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[color:var(--ink-muted)] truncate">
                  {content.subtitle || content.description}
                </p>
              </div>

              {/* Category */}
              <div>
                <Capsule size="sm" dot={false} className="!text-[10px] capitalize">
                  {project.category}
                </Capsule>
              </div>

              {/* Translations */}
              <div className="font-mono text-[11px] text-[color:var(--ink-muted)]">
                {transCount}/3 langs
              </div>

              {/* Status */}
              <div>
                {project.published ? (
                  <Capsule
                    size="sm"
                    variant="success"
                    dot={true}
                    className="!text-[10px]"
                  >
                    Published
                  </Capsule>
                ) : (
                  <Capsule
                    size="sm"
                    variant="warning"
                    dot={true}
                    className="!text-[10px]"
                  >
                    Draft
                  </Capsule>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => handleEditProject(project)}
                  className="size-8 inline-flex items-center justify-center rounded-md border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-foreground transition"
                  aria-label="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(project.id)}
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
        onOpenChange={(open) => (open ? setIsDialogOpen(true) : resetProjectForm())}
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
                {editingProject ? "Edit Project" : "New Project"}
              </DialogTitle>
              <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">
                {editingProject
                  ? `editing · ${editingProject.id.slice(0, 8)}`
                  : "create a new project"}
              </p>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Multilingual */}
              <div>
                <span className={labelClass}>Multilingual Content</span>
                <MultilingualTabs completion={formCompletion}>
                  {(lang) => (
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className={labelClass}>Title ({lang})</label>
                        <input
                          type="text"
                          value={projectForm.translations[lang].title}
                          onChange={(e) =>
                            updateLang(lang, "title", e.target.value)
                          }
                          placeholder="Project title"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Subtitle ({lang}) <span className="text-[color:oklch(0.65_0.2_25)]">*</span>
                        </label>
                        <input
                          type="text"
                          value={projectForm.translations[lang].subtitle}
                          onChange={(e) =>
                            updateLang(lang, "subtitle", e.target.value)
                          }
                          placeholder="Short description for carousel"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Description ({lang})
                        </label>
                        <textarea
                          value={projectForm.translations[lang].description}
                          onChange={(e) =>
                            updateLang(lang, "description", e.target.value)
                          }
                          placeholder="Project description"
                          rows={3}
                          className={`${inputClass} min-h-[88px] resize-y`}
                        />
                      </div>
                    </div>
                  )}
                </MultilingualTabs>
              </div>

              {/* Category */}
              <div>
                <label className={labelClass} htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={projectForm.category}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      category: e.target.value as ProjectCategory,
                    })
                  }
                  className={inputClass}
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="fullstack">Full Stack</option>
                </select>
              </div>

              {/* Image orientation */}
              <div>
                <label className={labelClass} htmlFor="imageOrientation">
                  Image orientation
                </label>
                <select
                  id="imageOrientation"
                  value={projectForm.imageOrientation}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      imageOrientation: e.target.value as ProjectForm["imageOrientation"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="">Auto (from category)</option>
                  <option value="horizontal">Horizontal (browser frame)</option>
                  <option value="vertical">Vertical (phone frame)</option>
                </select>
              </div>

              {/* Cover (projects.image, 16:10) */}
              <div className="space-y-2">
                <span className={labelClass}>Cover</span>
                {editingProject ? (
                  <>
                    <div
                      className="relative w-full max-w-sm overflow-hidden rounded-lg border border-[color:var(--ink-line)] bg-[color:var(--ink-line)]/20"
                      style={{ aspectRatio: "16 / 10" }}
                    >
                      {projectForm.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={projectForm.image}
                          alt="Project cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-[color:var(--ink-muted)]">
                          No cover
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <label
                        className={`${ghostBtn} cursor-pointer ${
                          coverBusy ? "opacity-60 pointer-events-none" : ""
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {coverBusy
                          ? "Uploading..."
                          : projectForm.image
                          ? "Replace cover"
                          : "Upload cover"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverSelect}
                          disabled={coverBusy}
                          className="hidden"
                        />
                      </label>
                      {projectForm.image && (
                        <button
                          type="button"
                          onClick={handleClearCover}
                          disabled={coverBusy}
                          className={ghostBtn}
                        >
                          Remove cover
                        </button>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-[color:var(--ink-muted)]">
                      {COVER_WIDTH}x{COVER_HEIGHT} (16:10) WebP, cropped to fit ·
                      saved immediately · the previous file is kept in storage
                    </p>
                    {coverError && (
                      <p className="text-[12px] text-[color:oklch(0.65_0.2_25)]">
                        {coverError}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-mono text-[10px] text-[color:var(--ink-muted)]">
                    Save the project first, then edit it to upload a cover.
                  </p>
                )}
              </div>

              {/* Images */}
              <div className="space-y-3">
                <div>
                  <label className={labelClass} htmlFor="images">
                    Screenshots (gallery)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className={`${ghostBtn} cursor-pointer`}>
                      <Upload className="w-4 h-4" />
                      Choose files
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                    </label>
                    {selectedImages.length > 0 && (
                      <Capsule size="sm" dot={false} className="!text-[10px]">
                        {selectedImages.length} selected
                      </Capsule>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-[color:var(--ink-muted)] mt-1.5">
                    Max 10 images · auto-converted to WebP
                  </p>
                </div>

                {projectImages.length > 0 && (
                  <div>
                    <span className={labelClass}>
                      Current Screenshots
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
                      {projectImages.map((img) => {
                        return (
                          <div
                            key={img.mediaId}
                            className="relative group rounded-lg overflow-hidden border border-[color:var(--ink-line)] aspect-square"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.blobKey}
                              alt={img.alt}
                              className="w-full h-full object-cover"
                            />
                            {/* Delete: sibling button on top, keyboard focusable */}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(img)}
                              className="absolute top-1 right-1 z-10 size-6 inline-flex items-center justify-center rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              aria-label="Delete image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {imageUploadError && (
                  <p className="text-[12px] text-[color:oklch(0.65_0.2_25)]">
                    {imageUploadError}
                  </p>
                )}
              </div>

              {/* Technologies */}
              <div>
                <label className={labelClass} htmlFor="technologies">
                  Technologies (comma separated)
                </label>
                <input
                  id="technologies"
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      technologies: e.target.value,
                    })
                  }
                  placeholder="React, Next.js, TypeScript"
                  className={inputClass}
                />
              </div>

              {/* URLs */}
              <div>
                <label className={labelClass} htmlFor="liveUrl">
                  Web URL
                </label>
                <input
                  id="liveUrl"
                  type="url"
                  value={projectForm.liveUrl}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      liveUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>

              {/* Store URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="appStoreUrl">
                    App Store URL
                  </label>
                  <input
                    id="appStoreUrl"
                    type="url"
                    value={projectForm.appStoreUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        appStoreUrl: e.target.value,
                      })
                    }
                    placeholder="https://apps.apple.com/app/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="playStoreUrl">
                    Google Play URL
                  </label>
                  <input
                    id="playStoreUrl"
                    type="url"
                    value={projectForm.playStoreUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        playStoreUrl: e.target.value,
                      })
                    }
                    placeholder="https://play.google.com/store/apps/..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Gradient preset */}
              <div>
                <span className={labelClass}>Gradient Preset</span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setProjectForm({ ...projectForm, gradientPreset: "" })
                    }
                    title="Default (Cyan)"
                    aria-pressed={!projectForm.gradientPreset}
                    className={`size-9 rounded-lg border border-[color:var(--ink-line)] text-[color:var(--ink-muted)] inline-flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.04em] hover:text-foreground transition ${
                      !projectForm.gradientPreset
                        ? "ring-2 ring-[color:var(--brand-cyan)]"
                        : ""
                    }`}
                  >
                    Def
                  </button>
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() =>
                        setProjectForm({
                          ...projectForm,
                          gradientPreset: preset.key,
                        })
                      }
                      title={preset.label}
                      aria-pressed={projectForm.gradientPreset === preset.key}
                      style={{ background: preset.swatch }}
                      className={`size-9 rounded-lg border border-[color:var(--ink-line)] transition ${
                        projectForm.gradientPreset === preset.key
                          ? "ring-2 ring-[color:var(--brand-cyan)]"
                          : ""
                      }`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setProjectForm({
                        ...projectForm,
                        gradientPreset: CUSTOM_GRADIENT_KEY,
                        gradientFrom: projectForm.gradientFrom || "#22d3ee",
                        gradientTo: projectForm.gradientTo || "#0e7490",
                      })
                    }
                    title="Custom"
                    aria-pressed={
                      projectForm.gradientPreset === CUSTOM_GRADIENT_KEY
                    }
                    style={{
                      background: `linear-gradient(135deg, ${
                        projectForm.gradientFrom || "#22d3ee"
                      }, ${projectForm.gradientTo || "#0e7490"})`,
                    }}
                    className={`size-9 rounded-lg border border-[color:var(--ink-line)] inline-flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.04em] text-white/80 transition ${
                      projectForm.gradientPreset === CUSTOM_GRADIENT_KEY
                        ? "ring-2 ring-[color:var(--brand-cyan)]"
                        : ""
                    }`}
                  >
                    +
                  </button>
                </div>
                {projectForm.gradientPreset === CUSTOM_GRADIENT_KEY && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className={labelClass} htmlFor="gradientFrom">
                        From color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="gradientFrom"
                          type="color"
                          value={projectForm.gradientFrom || "#22d3ee"}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              gradientFrom: e.target.value,
                            })
                          }
                          className="size-9 rounded-lg border border-[color:var(--ink-line)] bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-[11px] text-[color:var(--ink-muted)] uppercase">
                          {projectForm.gradientFrom || "#22d3ee"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="gradientTo">
                        To color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="gradientTo"
                          type="color"
                          value={projectForm.gradientTo || "#0e7490"}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              gradientTo: e.target.value,
                            })
                          }
                          className="size-9 rounded-lg border border-[color:var(--ink-line)] bg-transparent cursor-pointer"
                        />
                        <span className="font-mono text-[11px] text-[color:var(--ink-muted)] uppercase">
                          {projectForm.gradientTo || "#0e7490"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="font-mono text-[10px] text-[color:var(--ink-muted)] mt-1.5">
                  Card background when no cover image · default is Cyan
                </p>
              </div>

              {/* Case study */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className={`${labelClass} mb-0`} htmlFor="caseStudy">
                    Case study (JSON · en/es/it)
                  </label>
                  <div className="flex gap-2">
                    {!caseStudyText.trim() && (
                      <button
                        type="button"
                        className={`${ghostBtn} px-3 py-1 text-xs`}
                        onClick={() => {
                          setCaseStudyText(CASE_STUDY_TEMPLATE);
                          setCaseStudyDirty(true);
                        }}
                      >
                        Insert template
                      </button>
                    )}
                    {caseStudyCheck.ok && caseStudyCheck.value && (
                      <button
                        type="button"
                        className={`${ghostBtn} px-3 py-1 text-xs`}
                        onClick={() => {
                          setCaseStudyText(JSON.stringify(JSON.parse(caseStudyText), null, 2));
                          setCaseStudyDirty(true);
                        }}
                      >
                        Format
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  id="caseStudy"
                  value={caseStudyText}
                  onChange={(e) => {
                    setCaseStudyText(e.target.value);
                    setCaseStudyDirty(true);
                  }}
                  spellCheck={false}
                  rows={12}
                  placeholder="Empty = no case study (the page uses the description)."
                  aria-invalid={!caseStudyCheck.ok}
                  aria-describedby="caseStudyStatus"
                  className={`${inputClass} font-mono text-xs leading-relaxed resize-y min-h-[180px] ${
                    caseStudyCheck.ok ? "" : "border-red-500/60 focus:border-red-500/80"
                  }`}
                />
                <p
                  id="caseStudyStatus"
                  className={`font-mono text-[10px] mt-1.5 ${
                    caseStudyCheck.ok ? "text-[color:var(--ink-muted)]" : "text-red-400"
                  }`}
                >
                  {!caseStudyCheck.ok
                    ? caseStudyCheck.error
                    : caseStudyCheck.value
                      ? `Valid · ${caseStudyCheck.value.en.highlights.length} highlights · missing es/it fall back to en${caseStudyDirty ? " · unsaved changes" : ""}`
                      : caseStudyDirty
                        ? "Empty · saving removes the case study"
                        : "No case study · markdown allowed in challenge, solution and results"}
                </p>
              </div>

              {/* Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer bg-[color:var(--hover-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 hover:bg-[color:var(--hover-bg-strong)] transition">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        featured: e.target.checked,
                      })
                    }
                    className="size-4 accent-[color:var(--brand-cyan)]"
                  />
                  <span className="text-sm">Feature on homepage</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer bg-[color:var(--hover-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 hover:bg-[color:var(--hover-bg-strong)] transition">
                  <input
                    type="checkbox"
                    checked={projectForm.showOnHome}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        showOnHome: e.target.checked,
                      })
                    }
                    className="size-4 accent-[color:var(--brand-cyan)]"
                  />
                  <span className="text-sm">Show on home</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer bg-[color:var(--hover-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 hover:bg-[color:var(--hover-bg-strong)] transition">
                  <input
                    type="checkbox"
                    checked={projectForm.published}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        published: e.target.checked,
                      })
                    }
                    className="size-4 accent-[color:var(--brand-green)]"
                  />
                  <span className="text-sm">Published (public)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[color:var(--ink-line)]">
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className={ghostBtn}
                  disabled={uploadingImages}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  disabled={uploadingImages}
                  className={primaryBtn}
                >
                  {uploadingImages ? (
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
