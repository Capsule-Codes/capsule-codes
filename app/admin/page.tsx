"use client";

import type React from "react";

import { useData } from "@/lib/data-context";
import { useSupabase } from "@/lib/supabase-context";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  FolderOpen,
  Code,
  Star,
  LogOut,
  Mail,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import type { Project, Technology, Review, ProjectImage } from "@/lib/data-context";
import { SimpleLanguageSwitcher } from "@/components/simple-language-switcher";
import { ContactMessages } from "@/components/admin/contact-messages";
import { ContactInfoSettings } from "@/components/admin/contact-info-settings";
import { useLanguage } from "@/hooks/use-language";
import { compressImages, validateImageFiles } from "@/lib/image-compression";

export default function AdminPage() {
  const { user, loading: authLoading, signIn, signOut, isAdmin } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const { t, language } = useLanguage();

  // Helper function to extract error message
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    return String(error) || "Unknown error";
  };

  // Use language context directly for project content display
  const websiteLanguage = language;

  // Helper function to get project content in website language (not admin language)
  const getProjectContent = (project: Project) => {
    if (
      project.translations &&
      project.translations[websiteLanguage as keyof typeof project.translations]
    ) {
      return project.translations[
        websiteLanguage as keyof typeof project.translations
      ];
    }
    return { title: project.title, subtitle: "", description: project.description };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);

      if (error) {
        setLoginError(error);
      } else {
        setLoginForm({ email: "", password: "" });
      }
    } catch (err) {
      setLoginError("Error interno del servidor");
    }
  };

  const {
    projects,
    technologies,
    reviews,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    addReview,
    updateReview,
    deleteReview,
    refreshData,
  } = useSupabase();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(
    null
  );
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTechDialogOpen, setIsTechDialogOpen] = useState(false);
  const [isSavingTech, setIsSavingTech] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Image upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string>("");
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);

  // Avatar upload states
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    translations: {
      en: { title: "", subtitle: "", description: "" },
      es: { title: "", subtitle: "", description: "" },
      it: { title: "", subtitle: "", description: "" },
    },
    image: "",
    technologies: "",
    category: "web" as "web" | "mobile" | "fullstack",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    published: false,
  });

  // Technology form state
  const [techForm, setTechForm] = useState({
    name: "",
    icon: "",
    category: "frontend" as
      | "frontend"
      | "backend"
      | "mobile"
      | "database"
      | "deployment",
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    text: "",
    author: "",
    company: "",
    position: "",
    translations: {
      en: { text: "", author: "", company: "", position: "" },
      es: { text: "", author: "", company: "", position: "" },
      it: { text: "", author: "", company: "", position: "" },
    },
    rating: 5,
    avatar: "",
    date: new Date().toISOString().split("T")[0],
  });

  const categories = ["web", "mobile", "fullstack"];
  const techCategories = [
    "frontend",
    "backend",
    "mobile",
    "database",
    "deployment",
  ];

  // Project handlers
  const handleEditProject = (project: Project) => {
    const normalizedTranslations = {
      en: {
        title: project.translations?.en?.title ?? project.title,
        subtitle: project.translations?.en?.subtitle ?? "",
        description: project.translations?.en?.description ?? project.description,
      },
      es: {
        title: project.translations?.es?.title ?? project.title,
        subtitle: project.translations?.es?.subtitle ?? "",
        description: project.translations?.es?.description ?? project.description,
      },
      it: {
        title: project.translations?.it?.title ?? project.title,
        subtitle: project.translations?.it?.subtitle ?? "",
        description: project.translations?.it?.description ?? project.description,
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
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured || false,
      published: project.published || false,
    });
    setProjectImages(project.images || []);
    setSelectedImages([]);
    setImageUploadError("");
    setIsProjectDialogOpen(true);
  };

  const handleSaveProject = async () => {
    try {
      setUploadingImages(true);
      setImageUploadError("");

      if (!projectForm.translations.en.subtitle || !projectForm.translations.es.subtitle || !projectForm.translations.it.subtitle) {
        setImageUploadError(
          language === "es"
            ? "El subtítulo es obligatorio en todos los idiomas"
            : language === "it"
            ? "Il sottotitolo è obbligatorio in tutte le lingue"
            : "Subtitle is required in all languages"
        );
        setUploadingImages(false);
        return;
      }

      // Use first Azure image as primary image for backward compatibility
      const primaryImage = projectImages.length > 0
        ? `/api/images/${projectImages[0].blobKey}`
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
        liveUrl: projectForm.liveUrl,
        githubUrl: projectForm.githubUrl,
        featured: projectForm.featured,
        published: projectForm.published,
      };

      let projectId: string;

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        projectId = editingProject.id;
      } else {
        const newProject = await addProject(projectData);
        projectId = newProject?.id || "";
      }

      // Upload images if any are selected
      if (selectedImages.length > 0 && projectId) {
        // Validate images
        const validation = validateImageFiles(selectedImages);
        if (!validation.valid) {
          setImageUploadError(
            `Invalid image formats: ${validation.invalidFiles.join(", ")}`
          );
          setUploadingImages(false);
          return;
        }

        // Compress images
        const compressedImages = await compressImages(selectedImages);

        // Upload to Azure via API
        const formData = new FormData();
        for (const file of compressedImages) {
          formData.append("images", file);
        }
        formData.append("altText", projectForm.translations.en.title);

        const response = await fetch(`/api/admin/projects/${projectId}/images`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setImageUploadError(errorData.message || "Error uploading images");
          setUploadingImages(false);
          return;
        }

        const result = await response.json();

        // Update project with images and set primary image
        const updatedImages = [...projectImages, ...result.images];
        const newPrimaryImage = updatedImages.length > 0
          ? `/api/images/${updatedImages[0].blobKey}`
          : projectForm.image;

        await updateProject(projectId, {
          images: updatedImages,
          image: newPrimaryImage,
        } as any);
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
    try {
      await deleteProject(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error deleting project:", error);
      alert(`Error deleting project: ${errorMessage}`);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
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
      liveUrl: "",
      githubUrl: "",
      featured: false,
      published: false,
    });
    setEditingProject(null);
    setSelectedImages([]);
    setProjectImages([]);
    setImageUploadError("");
    setIsProjectDialogOpen(false);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setProjectForm({
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
      liveUrl: "",
      githubUrl: "",
      featured: false,
      published: false,
    });
    setSelectedImages([]);
    setProjectImages([]);
    setImageUploadError("");
    setIsProjectDialogOpen(true);
  };

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedImages(fileArray);
      setImageUploadError("");
    }
  };

  const handleDeleteImage = async (image: ProjectImage) => {
    if (!editingProject) return;

    try {
      const response = await fetch(
        `/api/admin/projects/${editingProject.id}/images?blobKey=${encodeURIComponent(image.blobKey)}&mediaId=${image.mediaId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Update local state
      const updatedImages = projectImages.filter(
        (img) => img.mediaId !== image.mediaId
      );
      setProjectImages(updatedImages);

      // Update primary image for backward compatibility
      const newPrimaryImage = updatedImages.length > 0
        ? `/api/images/${updatedImages[0].blobKey}`
        : "";

      // Update project in database
      await updateProject(editingProject.id, {
        images: updatedImages,
        image: newPrimaryImage,
      } as any);
      await refreshData();
    } catch (error) {
      console.error("Error deleting image:", error);
      setImageUploadError("Error deleting image");
    }
  };

  // Technology handlers
  const handleEditTechnology = (tech: Technology) => {
    setEditingTechnology(tech);
    setTechForm({
      name: tech.name,
      icon: tech.icon,
      category: tech.category,
    });
    setIsTechDialogOpen(true);
  };

  const handleSaveTechnology = async () => {
    console.log("🚀 handleSaveTechnology called");
    console.log("📝 Form data:", techForm);

    try {
      // Validate required fields
      if (!techForm.name || !techForm.icon) {
        console.log("❌ Validation failed - missing fields");
        alert(t.admin.technologies.requiredFields);
        return;
      }

      console.log("✅ Validation passed");
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

      console.log("💾 Saving technology:", techData);

      if (editingTechnology) {
        console.log("📝 Updating existing technology");
        await updateTechnology(editingTechnology.id, techData);
      } else {
        console.log("➕ Adding new technology");
        await addTechnology(techData);
      }

      console.log("✅ Save successful, refreshing data");
      await refreshData();
      console.log("✅ Data refreshed, resetting form");
      resetTechForm();
    } catch (error) {
      console.error("❌ Error in handleSaveTechnology:", error);
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.technologies.saveError}: ${errorMessage}`);
    } finally {
      setIsSavingTech(false);
    }
  };

  const handleDeleteTechnology = async (id: string) => {
    if (!confirm(t.admin.technologies.deleteConfirm)) {
      return;
    }

    try {
      await deleteTechnology(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.technologies.deleteError}: ${errorMessage}`);
    }
  };

  const resetTechForm = () => {
    setTechForm({
      name: "",
      icon: "",
      category: "frontend",
    });
    setEditingTechnology(null);
    setIsTechDialogOpen(false);
  };

  // Review handlers
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      text: review.text,
      author: review.author,
      company: review.company,
      position: review.position,
      translations: review.translations || {
        en: { text: review.text, author: review.author, company: review.company, position: review.position },
        es: { text: review.text, author: review.author, company: review.company, position: review.position },
        it: { text: review.text, author: review.author, company: review.company, position: review.position },
      },
      rating: review.rating,
      avatar: review.avatar || "",
      date: review.date,
    });
    setAvatarPreview(review.avatar || "");
    setSelectedAvatar(null);
    setIsReviewDialogOpen(true);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveReview = async () => {
    try {
      // Validate rating
      if (reviewForm.rating < 1 || reviewForm.rating > 5 || isNaN(reviewForm.rating)) {
        alert(t.admin.reviews.invalidRating);
        return;
      }

      setIsSavingReview(true);
      setUploadingAvatar(true);

      let avatarUrl = reviewForm.avatar;

      // First, save or update the review to get an ID
      let reviewId: string;
      const reviewData = {
        text: reviewForm.text,
        author: reviewForm.author,
        company: reviewForm.company,
        position: reviewForm.position,
        translations: reviewForm.translations,
        rating: reviewForm.rating,
        avatar: avatarUrl,
        date: reviewForm.date,
      };

      if (editingReview) {
        await updateReview(editingReview.id, reviewData);
        reviewId = editingReview.id;
      } else {
        const newReview = await addReview(reviewData);
        reviewId = newReview?.id || "";
      }

      // Upload avatar if selected
      if (selectedAvatar && reviewId) {
        const formData = new FormData();
        formData.append("avatar", selectedAvatar);

        const response = await fetch(`/api/admin/reviews/${reviewId}/avatar`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error uploading avatar");
        }

        const result = await response.json();
        avatarUrl = result.avatarUrl;

        // Update review with avatar URL
        await updateReview(reviewId, { avatar: avatarUrl } as any);
      }

      await refreshData();
      resetReviewForm();
      setIsReviewDialogOpen(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.reviews.saveError}: ${errorMessage}`);
    } finally {
      setIsSavingReview(false);
      setUploadingAvatar(false);
    }
  };

  const resetReviewForm = () => {
    setReviewForm({
      text: "",
      author: "",
      company: "",
      position: "",
      translations: {
        en: { text: "", author: "", company: "", position: "" },
        es: { text: "", author: "", company: "", position: "" },
        it: { text: "", author: "", company: "", position: "" },
      },
      rating: 5,
      avatar: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingReview(null);
    setSelectedAvatar(null);
    setAvatarPreview("");
    setIsReviewDialogOpen(false);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm(t.admin.reviews.deleteConfirm)) {
      return;
    }

    try {
      await deleteReview(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.reviews.deleteError}: ${errorMessage}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <div className="absolute top-4 right-4 z-50">
          <SimpleLanguageSwitcher />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Settings className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {language === "es"
                ? "Panel de Administración"
                : language === "it"
                ? "Pannello di Amministrazione"
                : "Administration Panel"}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === "es"
                ? "Ingresa tus credenciales para acceder"
                : language === "it"
                ? "Inserisci le tue credenziali per accedere"
                : "Enter your credentials to access"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">
                  {language === "es"
                    ? "Email"
                    : language === "it"
                    ? "Email"
                    : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="admin@capsulecodes.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">
                  {language === "es"
                    ? "Contraseña"
                    : language === "it"
                    ? "Password"
                    : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && (
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {language === "es"
                  ? "Iniciar Sesión"
                  : language === "it"
                  ? "Accedi"
                  : "Login"}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>
                  {language === "es"
                    ? "Credenciales de prueba:"
                    : language === "it"
                    ? "Credenziali di test:"
                    : "Test credentials:"}
                </strong>
                <br />
                {language === "es"
                  ? "Email: admin@capsulecodes.com"
                  : language === "it"
                  ? "Email: admin@capsulecodes.com"
                  : "Email: admin@capsulecodes.com"}
                <br />
                {language === "es"
                  ? "Contraseña: capsule2025"
                  : language === "it"
                  ? "Password: capsule2025"
                  : "Password: capsule2025"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <Settings className="w-6 h-6 md:w-8 md:h-8 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold">
                  {language === "es"
                    ? "Panel de Administración"
                    : language === "it"
                    ? "Pannello di Amministrazione"
                    : "Administration Panel"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "es"
                    ? "Gestiona proyectos y tecnologías"
                    : language === "it"
                    ? "Gestisci progetti e tecnologie"
                    : "Manage projects and technologies"}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <SimpleLanguageSwitcher />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/")}
                  className="text-xs"
                >
                  {language === "es"
                    ? "Ver Sitio"
                    : language === "it"
                    ? "Vedi Sito"
                    : "View Site"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      // Error handled silently
                    }
                  }}
                  className="text-xs flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>
                    {language === "es"
                      ? "Cerrar Sesión"
                      : language === "it"
                      ? "Esci"
                      : "Logout"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {language === "es"
                  ? "Cargando datos..."
                  : language === "it"
                  ? "Caricamento dati..."
                  : "Loading data..."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">
                  {language === "es"
                    ? "Error al cargar datos"
                    : language === "it"
                    ? "Errore nel caricamento dei dati"
                    : "Error loading data"}
                </h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  className="mt-2"
                >
                  {language === "es"
                    ? "Reintentar"
                    : language === "it"
                    ? "Riprova"
                    : "Retry"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              {language === "es"
                ? "Proyectos"
                : language === "it"
                ? "Progetti"
                : "Projects"}
            </TabsTrigger>
            <TabsTrigger
              value="technologies"
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              {language === "es"
                ? "Tecnologías"
                : language === "it"
                ? "Tecnologie"
                : "Technologies"}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {language === "es"
                ? "Reseñas"
                : language === "it"
                ? "Recensioni"
                : "Reviews"}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {language === "es"
                ? "Mensajes"
                : language === "it"
                ? "Messaggi"
                : "Messages"}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {language === "es"
                ? "Contacto"
                : language === "it"
                ? "Contatto"
                : "Contact"}
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">
                {language === "es"
                  ? "Gestión de Proyectos"
                  : language === "it"
                  ? "Gestione Progetti"
                  : "Project Management"}
              </h2>
              <Dialog
                open={isProjectDialogOpen}
                onOpenChange={setIsProjectDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={handleNewProject}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {language === "es"
                      ? "Nuevo Proyecto"
                      : language === "it"
                      ? "Nuovo Progetto"
                      : "New Project"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject
                        ? language === "es"
                          ? "Editar Proyecto"
                          : language === "it"
                          ? "Modifica Progetto"
                          : "Edit Project"
                        : language === "es"
                        ? "Nuevo Proyecto"
                        : language === "it"
                        ? "Nuovo Progetto"
                        : "New Project"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Multilingual Content */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        {language === "es"
                          ? "Contenido Multilingüe"
                          : language === "it"
                          ? "Contenuto Multilingue"
                          : "Multilingual Content"}
                      </Label>
                      <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                          <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                          <TabsTrigger value="it">🇮🇹 Italiano</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="title-en">Title (English)</Label>
                            <Input
                              id="title-en"
                              value={projectForm.translations.en.title}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    en: {
                                      ...projectForm.translations.en,
                                      title: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Project title in English"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle-en">
                              Subtitle (English) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="subtitle-en"
                              value={projectForm.translations.en.subtitle || ""}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    en: {
                                      ...projectForm.translations.en,
                                      subtitle: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Short description for carousel"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description-en">
                              Description (English)
                            </Label>
                            <Textarea
                              id="description-en"
                              value={projectForm.translations.en.description}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    en: {
                                      ...projectForm.translations.en,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Project description in English"
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="es" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="title-es">Título (Español)</Label>
                            <Input
                              id="title-es"
                              value={projectForm.translations.es.title}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    es: {
                                      ...projectForm.translations.es,
                                      title: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Título del proyecto en español"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle-es">
                              Subtítulo (Español) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="subtitle-es"
                              value={projectForm.translations.es.subtitle || ""}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    es: {
                                      ...projectForm.translations.es,
                                      subtitle: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descripción breve para el carousel"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description-es">
                              Descripción (Español)
                            </Label>
                            <Textarea
                              id="description-es"
                              value={projectForm.translations.es.description}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    es: {
                                      ...projectForm.translations.es,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descripción del proyecto en español"
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="it" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="title-it">Titolo (Italiano)</Label>
                            <Input
                              id="title-it"
                              value={projectForm.translations.it.title}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    it: {
                                      ...projectForm.translations.it,
                                      title: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Titolo del progetto in italiano"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle-it">
                              Sottotitolo (Italiano) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="subtitle-it"
                              value={projectForm.translations.it.subtitle || ""}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    it: {
                                      ...projectForm.translations.it,
                                      subtitle: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Breve descrizione per il carosello"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description-it">
                              Descrizione (Italiano)
                            </Label>
                            <Textarea
                              id="description-it"
                              value={projectForm.translations.it.description}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  translations: {
                                    ...projectForm.translations,
                                    it: {
                                      ...projectForm.translations.it,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descrizione del progetto in italiano"
                              rows={3}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    <div>
                      <Label htmlFor="category">
                        {language === "es"
                          ? "Categoría"
                          : language === "it"
                          ? "Categoria"
                          : "Category"}
                      </Label>
                      <Select
                        value={projectForm.category}
                        onValueChange={(
                          value: "web" | "mobile" | "fullstack"
                        ) =>
                          setProjectForm({ ...projectForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              language === "es"
                                ? "Seleccionar categoría"
                                : language === "it"
                                ? "Seleziona categoria"
                                : "Select category"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="fullstack">Full Stack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Azure Image Upload */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="images">
                          {t.admin.projects.images}
                        </Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            disabled={uploadingImages}
                          />
                          {selectedImages.length > 0 && (
                            <Badge variant="secondary">
                              {selectedImages.length} {t.admin.projects.selectedImages}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t.admin.projects.imageDescription}
                        </p>
                      </div>

                      {/* Show existing images */}
                      {projectImages.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            {t.admin.projects.currentImages}
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            {projectImages.map((img) => (
                              <div
                                key={img.mediaId}
                                className="relative group rounded-lg overflow-hidden border"
                              >
                                <img
                                  src={`/api/images/${img.blobKey}`}
                                  alt={img.alt}
                                  className="w-full h-24 object-cover"
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteImage(img)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload error */}
                      {imageUploadError && (
                        <p className="text-sm text-destructive">
                          {imageUploadError}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="technologies">
                        {language === "es"
                          ? "Tecnologías (separadas por comas)"
                          : language === "it"
                          ? "Tecnologie (separate da virgole)"
                          : "Technologies (comma separated)"}
                      </Label>
                      <Input
                        id="technologies"
                        value={projectForm.technologies}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            technologies: e.target.value,
                          })
                        }
                        placeholder="React, Next.js, TypeScript"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="liveUrl">
                          {language === "es"
                            ? "URL Demo (opcional)"
                            : language === "it"
                            ? "URL Demo (opzionale)"
                            : "Demo URL (optional)"}
                        </Label>
                        <Input
                          id="liveUrl"
                          value={projectForm.liveUrl}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              liveUrl: e.target.value,
                            })
                          }
                          placeholder="https://demo.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="githubUrl">
                          {language === "es"
                            ? "URL GitHub (opcional)"
                            : language === "it"
                            ? "URL GitHub (opzionale)"
                            : "GitHub URL (optional)"}
                        </Label>
                        <Input
                          id="githubUrl"
                          value={projectForm.githubUrl}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              githubUrl: e.target.value,
                            })
                          }
                          placeholder="https://github.com/user/repo"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={projectForm.featured}
                          onCheckedChange={(checked) =>
                            setProjectForm({
                              ...projectForm,
                              featured: checked === true,
                            })
                          }
                        />
                        <Label
                          htmlFor="featured"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {language === "es"
                            ? "Destacar en página principal"
                            : language === "it"
                            ? "In evidenza sulla pagina principale"
                            : "Feature on homepage"}
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="published"
                          checked={projectForm.published}
                          onCheckedChange={(checked) =>
                            setProjectForm({
                              ...projectForm,
                              published: checked === true,
                            })
                          }
                        />
                        <Label
                          htmlFor="published"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {language === "es"
                            ? "Publicado (visible al público)"
                            : language === "it"
                            ? "Pubblicato (visibile al pubblico)"
                            : "Published (visible to public)"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetProjectForm}>
                        <X className="w-4 h-4 mr-2" />
                        {language === "es"
                          ? "Cancelar"
                          : language === "it"
                          ? "Annulla"
                          : "Cancel"}
                      </Button>
                      <Button
                        onClick={handleSaveProject}
                        disabled={uploadingImages}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {language === "es"
                              ? "Guardando..."
                              : language === "it"
                              ? "Salvataggio..."
                              : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {language === "es"
                              ? "Guardar"
                              : language === "it"
                              ? "Salva"
                              : "Save"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-32 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 capitalize">
                      {project.category}
                    </Badge>
                    {project.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-950 hover:bg-yellow-600 hover:text-yellow-950">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {language === "es"
                          ? "Destacado"
                          : language === "it"
                          ? "In evidenza"
                          : "Featured"}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {getProjectContent(project).title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {getProjectContent(project).description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProject(project)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        {language === "es"
                          ? "Editar"
                          : language === "it"
                          ? "Modifica"
                          : "Edit"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Technologies Tab */}
          <TabsContent value="technologies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">
                {language === "es"
                  ? "Gestión de Tecnologías"
                  : language === "it"
                  ? "Gestione Tecnologie"
                  : "Technology Management"}
              </h2>
              <Dialog
                open={isTechDialogOpen}
                onOpenChange={setIsTechDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingTechnology(null)}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.admin.technologies.newTechnology}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTechnology
                        ? t.admin.technologies.editTechnology
                        : t.admin.technologies.newTechnology}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="techName">
                        {t.admin.technologies.name}
                      </Label>
                      <Input
                        id="techName"
                        value={techForm.name}
                        onChange={(e) =>
                          setTechForm({ ...techForm, name: e.target.value })
                        }
                        placeholder="React"
                      />
                    </div>
                    <div>
                      <Label htmlFor="techIcon">
                        {t.admin.technologies.icon}
                      </Label>
                      <Input
                        id="techIcon"
                        value={techForm.icon}
                        onChange={(e) =>
                          setTechForm({ ...techForm, icon: e.target.value })
                        }
                        placeholder="⚛️"
                      />
                    </div>
                    <div>
                      <Label htmlFor="techCategory">
                        {t.admin.technologies.category}
                      </Label>
                      <Select
                        value={techForm.category}
                        onValueChange={(
                          value:
                            | "frontend"
                            | "backend"
                            | "mobile"
                            | "database"
                            | "deployment"
                        ) => setTechForm({ ...techForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t.admin.technologies.selectCategory}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="deployment">Deployment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={resetTechForm}>
                        <X className="w-4 h-4 mr-2" />
                        {t.admin.common.cancel}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveTechnology}
                        disabled={isSavingTech}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer transition-all"
                      >
                        {isSavingTech ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {isSavingTech ? t.admin.common.saving : t.admin.common.save}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {techCategories.map((category) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {technologies
                      .filter((tech) => tech.category === category)
                      .map((tech) => (
                        <div
                          key={tech.id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{tech.icon}</span>
                            <span className="text-sm font-medium">
                              {tech.name}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTechnology(tech)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTechnology(tech.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">
                {language === "es"
                  ? "Gestión de Reseñas"
                  : language === "it"
                  ? "Gestione Recensioni"
                  : "Review Management"}
              </h2>
              <Dialog
                open={isReviewDialogOpen}
                onOpenChange={setIsReviewDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingReview(null)}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    {t.admin.reviews.newReview}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingReview
                        ? t.admin.reviews.editReview
                        : t.admin.reviews.newReview}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="author">
                          {t.admin.reviews.author}
                        </Label>
                        <Input
                          id="author"
                          value={reviewForm.author}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              author: e.target.value,
                            })
                          }
                          placeholder={
                            language === "es"
                              ? "Nombre del autor"
                              : language === "it"
                              ? "Nome dell'autore"
                              : "Author name"
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">
                          {t.admin.reviews.company}
                        </Label>
                        <Input
                          id="company"
                          value={reviewForm.company}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              company: e.target.value,
                            })
                          }
                          placeholder={
                            language === "es"
                              ? "Nombre de la empresa"
                              : language === "it"
                              ? "Nome dell'azienda"
                              : "Company name"
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">
                          {t.admin.reviews.position}
                        </Label>
                        <Input
                          id="position"
                          value={reviewForm.position}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              position: e.target.value,
                            })
                          }
                          placeholder={
                            language === "es"
                              ? "Cargo del autor"
                              : language === "it"
                              ? "Posizione dell'autore"
                              : "Author position"
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">
                          {t.admin.reviews.rating}
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          value={reviewForm.rating}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setReviewForm({
                              ...reviewForm,
                              rating: isNaN(value) ? 5 : Math.min(5, Math.max(1, value)),
                            });
                          }}
                          required
                        />
                      </div>
                    </div>

                    {/* Multilingual Content */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        {language === "es"
                          ? "Contenido Multilingüe"
                          : language === "it"
                          ? "Contenuto Multilingue"
                          : "Multilingual Content"}
                      </Label>
                      <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                          <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                          <TabsTrigger value="it">🇮🇹 Italiano</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="text-en">
                              Review Text (English)
                            </Label>
                            <Textarea
                              id="text-en"
                              value={reviewForm.translations.en.text}
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  translations: {
                                    ...reviewForm.translations,
                                    en: {
                                      ...reviewForm.translations.en,
                                      text: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Review text in English"
                              rows={4}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="es" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="text-es">
                              Texto de Reseña (Español)
                            </Label>
                            <Textarea
                              id="text-es"
                              value={reviewForm.translations.es.text}
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  translations: {
                                    ...reviewForm.translations,
                                    es: {
                                      ...reviewForm.translations.es,
                                      text: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Texto de reseña en español"
                              rows={4}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="it" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="text-it">
                              Testo Recensione (Italiano)
                            </Label>
                            <Textarea
                              id="text-it"
                              value={reviewForm.translations.it.text}
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  translations: {
                                    ...reviewForm.translations,
                                    it: {
                                      ...reviewForm.translations.it,
                                      text: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Testo della recensione in italiano"
                              rows={4}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      {/* Avatar Upload */}
                      <div>
                        <Label htmlFor="avatar">
                          {language === "es"
                            ? "Avatar (Azure)"
                            : language === "it"
                            ? "Avatar (Azure)"
                            : "Avatar (Azure)"}
                        </Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarSelect}
                            disabled={uploadingAvatar}
                          />
                          {avatarPreview && (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                              <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === "es"
                            ? "Se convertirá a WebP 400x400px automáticamente."
                            : language === "it"
                            ? "Sarà convertito in WebP 400x400px automaticamente."
                            : "Will be automatically converted to WebP 400x400px."}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="date">
                          {language === "es"
                            ? "Fecha"
                            : language === "it"
                            ? "Data"
                            : "Date"}
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={reviewForm.date}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetReviewForm} disabled={isSavingReview}>
                        <X className="w-4 h-4 mr-2" />
                        {t.admin.common.cancel}
                      </Button>
                      <Button
                        onClick={handleSaveReview}
                        disabled={isSavingReview}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer transition-all"
                      >
                        {isSavingReview ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {isSavingReview ? t.admin.common.saving : t.admin.common.save}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">
                            {review.author}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {review.company} • {review.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReview(review)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {review.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>

          {/* Contact Info Settings Tab */}
          <TabsContent value="settings">
            <ContactInfoSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
