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
    setIsDialogOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setProjectForm(EMPTY_FORM);
    setSelectedImages([]);
    setProjectImages([]);
    setImageUploadError("");
    setIsDialogOpen(true);
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectForm(EMPTY_FORM);
    setSelectedImages([]);
    setProjectImages([]);
    setImageUploadError("");
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

      const primaryImage =
        projectImages.length > 0
          ? projectImages[0].blobKey
          : projectForm.image;

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
        const newPrimaryImage =
          updatedImages.length > 0
            ? updatedImages[0].blobKey
            : projectForm.image;

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

      const newPrimaryImage =
        updatedImages.length > 0 ? updatedImages[0].blobKey : "";

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

              {/* Images */}
              <div className="space-y-3">
                <div>
                  <label className={labelClass} htmlFor="images">
                    Project Images
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
                      Current Images · click to set cover
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
                      {projectImages.map((img, idx) => {
                        const isCover = projectForm.coverMediaId
                          ? projectForm.coverMediaId === img.mediaId
                          : idx === 0;
                        return (
                          <div
                            key={img.mediaId}
                            className={`relative group rounded-lg overflow-hidden border border-[color:var(--ink-line)] aspect-square ${
                              isCover
                                ? "ring-2 ring-[color:var(--brand-cyan)]"
                                : ""
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.blobKey}
                              alt={img.alt}
                              className="w-full h-full object-cover"
                            />
                            {/* Set-as-cover: covers the image, keyboard focusable */}
                            <button
                              type="button"
                              onClick={() =>
                                setProjectForm({
                                  ...projectForm,
                                  coverMediaId: img.mediaId,
                                })
                              }
                              title="Set as cover"
                              aria-pressed={isCover}
                              className="absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-cyan)]"
                            >
                              <span className="sr-only">Set as cover</span>
                            </button>
                            {isCover && (
                              <span className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-md bg-[color:var(--brand-cyan)] text-on-grad font-mono text-[9px] uppercase tracking-[0.06em] leading-none pointer-events-none">
                                Cover
                              </span>
                            )}
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
