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
} from "lucide-react";
import type { Project, Technology, Review } from "@/lib/data-context";
import { SimpleLanguageSwitcher } from "@/components/simple-language-switcher";
import { useLanguage } from "@/hooks/use-language";

export default function AdminPage() {
  const { user, loading: authLoading, signIn, signOut, isAdmin } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const { t, language } = useLanguage();

  const [websiteLanguage, setWebsiteLanguage] = useState<string>("en");

  // Listen for changes in website language
  useEffect(() => {
    const handleLanguageChange = () => {
      const lang = localStorage.getItem("capsule-codes-language") || "en";
      setWebsiteLanguage(lang);
    };

    // Set initial language
    handleLanguageChange();

    // Listen for storage changes (from other tabs) - this is the key for cross-tab communication
    window.addEventListener("storage", (e) => {
      if (e.key === "capsule-codes-language") {
        setWebsiteLanguage(e.newValue || "en");
      }
    });

    // Listen for custom events (from same tab)
    window.addEventListener("languageChanged", handleLanguageChange);

    // Poll localStorage every 500ms as a fallback
    const interval = setInterval(() => {
      const currentLang =
        localStorage.getItem("capsule-codes-language") || "en";
      if (currentLang !== websiteLanguage) {
        setWebsiteLanguage(currentLang);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleLanguageChange);
      window.removeEventListener("languageChanged", handleLanguageChange);
      clearInterval(interval);
    };
  }, [websiteLanguage]);

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
    return { title: project.title, description: project.description };
  };

  // Admin credentials (in production, use proper authentication)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "capsule2024",
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
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    translations: {
      en: { title: "", description: "" },
      es: { title: "", description: "" },
      it: { title: "", description: "" },
    },
    image: "",
    technologies: "",
    category: "web" as "web" | "mobile" | "fullstack",
    liveUrl: "",
    githubUrl: "",
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
    description: "",
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
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      translations: project.translations || {
        en: { title: project.title, description: project.description },
        es: { title: project.title, description: project.description },
        it: { title: project.title, description: project.description },
      },
      image: project.image,
      technologies: project.technologies.join(", "),
      category: project.category,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    });
    setIsProjectDialogOpen(true);
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        title: projectForm.translations.en.title || projectForm.title,
        description:
          projectForm.translations.en.description || projectForm.description,
        translations: projectForm.translations,
        image: projectForm.image,
        technologies: projectForm.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        category: projectForm.category,
        liveUrl: projectForm.liveUrl,
        githubUrl: projectForm.githubUrl,
      };

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await addProject(projectData);
      }

      resetProjectForm();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      translations: {
        en: { title: "", description: "" },
        es: { title: "", description: "" },
        it: { title: "", description: "" },
      },
      image: "",
      technologies: "",
      category: "web",
      liveUrl: "",
      githubUrl: "",
    });
    setEditingProject(null);
    setIsProjectDialogOpen(false);
  };

  // Technology handlers
  const handleEditTechnology = (tech: Technology) => {
    setEditingTechnology(tech);
    setTechForm({
      name: tech.name,
      icon: tech.icon,
      category: tech.category,
      description: tech.description,
    });
    setIsTechDialogOpen(true);
  };

  const handleSaveTechnology = async () => {
    try {
      const techData = {
        name: techForm.name,
        icon: techForm.icon,
        category: techForm.category,
        description: techForm.description,
        translations: {
          en: { name: techForm.name, description: techForm.description },
          es: { name: techForm.name, description: techForm.description },
          it: { name: techForm.name, description: techForm.description },
        },
      };

      if (editingTechnology) {
        await updateTechnology(editingTechnology.id, techData);
      } else {
        await addTechnology(techData);
      }

      resetTechForm();
    } catch (error) {
      console.error("Error saving technology:", error);
    }
  };

  const handleDeleteTechnology = async (id: string) => {
    try {
      await deleteTechnology(id);
    } catch (error) {
      console.error("Error deleting technology:", error);
    }
  };

  const resetTechForm = () => {
    setTechForm({
      name: "",
      icon: "",
      category: "frontend",
      description: "",
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
      translations: review.translations,
      rating: review.rating,
      avatar: review.avatar || "",
      date: review.date,
    });
    setIsReviewDialogOpen(true);
  };

  const handleSaveReview = async () => {
    try {
      console.log("Saving review...", { editingReview, reviewForm });

      const reviewData = {
        text: reviewForm.text,
        author: reviewForm.author,
        company: reviewForm.company,
        position: reviewForm.position,
        translations: reviewForm.translations,
        rating: reviewForm.rating,
        avatar: reviewForm.avatar,
        date: reviewForm.date,
      };

      console.log("Review data to save:", reviewData);

      if (editingReview) {
        console.log("Updating review with ID:", editingReview.id);
        await updateReview(editingReview.id, reviewData);
        console.log("Review updated successfully");
      } else {
        console.log("Adding new review");
        await addReview(reviewData);
        console.log("Review added successfully");
      }

      resetReviewForm();
      setIsReviewDialogOpen(false);
    } catch (error) {
      console.error("Error saving review:", error);
      alert(
        `Error al guardar la reseña: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
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
    setIsReviewDialogOpen(false);
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
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Panel:{" "}
                      {language === "es"
                        ? "Español"
                        : language === "it"
                        ? "Italiano"
                        : "English"}
                    </span>
                    <span className="text-xs text-muted-foreground">|</span>
                    <span className="text-xs text-muted-foreground">
                      Proyectos: {websiteLanguage}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const nextLang =
                          websiteLanguage === "en"
                            ? "es"
                            : websiteLanguage === "es"
                            ? "it"
                            : "en";
                        localStorage.setItem(
                          "capsule-codes-language",
                          nextLang
                        );
                        setWebsiteLanguage(nextLang);
                      }}
                      className="text-blue-500 text-xs px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                    >
                      {websiteLanguage} →{" "}
                      {websiteLanguage === "en"
                        ? "es"
                        : websiteLanguage === "es"
                        ? "it"
                        : "en"}
                    </button>
                    <button
                      onClick={() => {
                        setWebsiteLanguage((prev) =>
                          prev === "en" ? "es" : "en"
                        );
                        setTimeout(() => {
                          setWebsiteLanguage((prev) =>
                            prev === "en" ? "es" : "en"
                          );
                        }, 100);
                      }}
                      className="text-green-500 text-xs px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors"
                    >
                      Re-render
                    </button>
                  </div>
                </div>
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
                      console.error("Error signing out:", error);
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
          <TabsList className="grid w-full grid-cols-3">
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
                    onClick={() => setEditingProject(null)}
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
                    <div>
                      <Label htmlFor="image">
                        {language === "es"
                          ? "URL de Imagen"
                          : language === "it"
                          ? "URL Immagine"
                          : "Image URL"}
                      </Label>
                      <Input
                        id="image"
                        value={projectForm.image}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            image: e.target.value,
                          })
                        }
                        placeholder="/path/to/image.png"
                      />
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
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {language === "es"
                          ? "Guardar"
                          : language === "it"
                          ? "Salva"
                          : "Save"}
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
                    <Badge className="absolute top-2 left-2 bg-background/90 capitalize">
                      {project.category}
                    </Badge>
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
                    {language === "es"
                      ? "Nueva Tecnología"
                      : language === "it"
                      ? "Nuova Tecnologia"
                      : "New Technology"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTechnology
                        ? language === "es"
                          ? "Editar Tecnología"
                          : language === "it"
                          ? "Modifica Tecnologia"
                          : "Edit Technology"
                        : language === "es"
                        ? "Nueva Tecnología"
                        : language === "it"
                        ? "Nuova Tecnologia"
                        : "New Technology"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="techName">
                        {language === "es"
                          ? "Nombre"
                          : language === "it"
                          ? "Nome"
                          : "Name"}
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
                        {language === "es"
                          ? "Icono (emoji)"
                          : language === "it"
                          ? "Icona (emoji)"
                          : "Icon (emoji)"}
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
                      <Label htmlFor="techDescription">
                        {language === "es"
                          ? "Descripción"
                          : language === "it"
                          ? "Descrizione"
                          : "Description"}
                      </Label>
                      <Input
                        id="techDescription"
                        value={techForm.description}
                        onChange={(e) =>
                          setTechForm({
                            ...techForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Modern UI library"
                      />
                    </div>
                    <div>
                      <Label htmlFor="techCategory">
                        {language === "es"
                          ? "Categoría"
                          : language === "it"
                          ? "Categoria"
                          : "Category"}
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
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="deployment">Deployment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetTechForm}>
                        <X className="w-4 h-4 mr-2" />
                        {language === "es"
                          ? "Cancelar"
                          : language === "it"
                          ? "Annulla"
                          : "Cancel"}
                      </Button>
                      <Button
                        onClick={handleSaveTechnology}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {language === "es"
                          ? "Guardar"
                          : language === "it"
                          ? "Salva"
                          : "Save"}
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
                    {language === "es"
                      ? "Agregar Reseña"
                      : language === "it"
                      ? "Aggiungi Recensione"
                      : "Add Review"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingReview
                        ? language === "es"
                          ? "Editar Reseña"
                          : language === "it"
                          ? "Modifica Recensione"
                          : "Edit Review"
                        : language === "es"
                        ? "Nueva Reseña"
                        : language === "it"
                        ? "Nuova Recensione"
                        : "New Review"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="author">
                          {language === "es"
                            ? "Autor"
                            : language === "it"
                            ? "Autore"
                            : "Author"}
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
                          {language === "es"
                            ? "Empresa"
                            : language === "it"
                            ? "Azienda"
                            : "Company"}
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
                          {language === "es"
                            ? "Cargo"
                            : language === "it"
                            ? "Posizione"
                            : "Position"}
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
                          {language === "es"
                            ? "Calificación (1-5)"
                            : language === "it"
                            ? "Valutazione (1-5)"
                            : "Rating (1-5)"}
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          value={reviewForm.rating}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              rating: parseInt(e.target.value),
                            })
                          }
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="avatar">
                          {language === "es"
                            ? "Avatar (URL)"
                            : language === "it"
                            ? "Avatar (URL)"
                            : "Avatar (URL)"}
                        </Label>
                        <Input
                          id="avatar"
                          value={reviewForm.avatar}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              avatar: e.target.value,
                            })
                          }
                          placeholder="https://example.com/avatar.jpg"
                        />
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
                      <Button variant="outline" onClick={resetReviewForm}>
                        {language === "es"
                          ? "Cancelar"
                          : language === "it"
                          ? "Annulla"
                          : "Cancel"}
                      </Button>
                      <Button onClick={handleSaveReview}>
                        {language === "es"
                          ? "Guardar"
                          : language === "it"
                          ? "Salva"
                          : "Save"}
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
                          onClick={() => deleteReview(review.id)}
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
        </Tabs>
      </div>
    </div>
  );
}
