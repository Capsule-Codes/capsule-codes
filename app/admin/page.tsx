"use client";

import type React from "react";

import Image from "next/image";
import type {
  ProjectHighlight,
  ProjectHighlightTranslations,
  ProjectImage,
} from "@/lib/data-context";
import { useSupabase } from "@/lib/supabase-context";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  FolderOpen,
  Code,
  Star,
  Users,
  LogOut,
  Mail,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import type {
  Project,
  Technology,
  Review,
  ProjectImage,
  TeamMember,
} from "@/lib/data-context";
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
    return {
      title: project.title,
      subtitle: "",
      description: project.description,
    };
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
    teamMembers,
    projectHighlights,
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
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addProjectHighlight,
    updateProjectHighlight,
    deleteProjectHighlight,
    refreshData,
  } = useSupabase();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(
    null,
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

  // Team member states
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(
    null,
  );
  const [isTeamMemberDialogOpen, setIsTeamMemberDialogOpen] = useState(false);
  const [isSavingTeamMember, setIsSavingTeamMember] = useState(false);
  const [selectedTeamAvatar, setSelectedTeamAvatar] = useState<File | null>(
    null,
  );
  const [uploadingTeamAvatar, setUploadingTeamAvatar] = useState(false);
  const [teamAvatarPreview, setTeamAvatarPreview] = useState<string>("");

  // Team member form state
  const [teamMemberForm, setTeamMemberForm] = useState({
    translations: {
      en: { name: "", role: "", description: "" },
      es: { name: "", role: "", description: "" },
      it: { name: "", role: "", description: "" },
    },
    avatar: "",
    avatar_blob_key: "",
    category: "developer" as "cofounder" | "developer",
    order: 0,
    published: true,
  });

  const techCategories = [
    "frontend",
    "backend",
    "mobile",
    "database",
    "deployment",
  ];
  const teamMemberCategories = ["cofounder", "developer"];

  // Case Study states
  const [editingProjectHighlight, setEditingProjectHighlight] =
    useState<ProjectHighlight | null>(null);
  const [isProjectHighlightDialogOpen, setIsProjectHighlightDialogOpen] =
    useState(false);
  const [isSavingProjectHighlight, setIsSavingProjectHighlight] =
    useState(false);
  const [projectHighlightImages, setProjectHighlightImages] = useState<
    ProjectImage[]
  >([]);
  const [selectedProjectHighlightImages, setSelectedProjectHighlightImages] =
    useState<File[]>([]);
  const [projectHighlightImageError, setProjectHighlightImageError] =
    useState<string>("");

  // Case Study form state
  const [projectHighlightForm, setProjectHighlightForm] = useState({
    title: "",
    subtitle: "",
    translations: {
      en: {
        title: "",
        subtitle: "",
        challenge: "",
        solution: "",
        results: "",
        features: [] as string[],
      },
      es: {
        title: "",
        subtitle: "",
        challenge: "",
        solution: "",
        results: "",
        features: [] as string[],
      },
      it: {
        title: "",
        subtitle: "",
        challenge: "",
        solution: "",
        results: "",
        features: [] as string[],
      },
    },
    image: "",
    technologies: "",
    client_name: "",
    industry: "",
    category: "web" as "web" | "mobile" | "fullstack",
    featured: false,
    published: false,
  });

  // Tab state for mobile dropdown
  const [activeTab, setActiveTab] = useState("projects");

  // Project handlers
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

      // Use first Azure image as primary image for backward compatibility
      const primaryImage =
        projectImages.length > 0
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
            `Invalid image formats: ${validation.invalidFiles.join(", ")}`,
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

        // Update project with images and set primary image
        const updatedImages = [...projectImages, ...result.images];
        const newPrimaryImage =
          updatedImages.length > 0
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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Update local state
      const updatedImages = projectImages.filter(
        (img) => img.mediaId !== image.mediaId,
      );
      setProjectImages(updatedImages);

      // Update primary image for backward compatibility
      const newPrimaryImage =
        updatedImages.length > 0
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
      if (
        reviewForm.rating < 1 ||
        reviewForm.rating > 5 ||
        isNaN(reviewForm.rating)
      ) {
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

  // Team Member handlers
  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamMemberForm({
      translations: member.translations,
      avatar: member.avatar,
      avatar_blob_key: member.avatar_blob_key || "",
      category: member.category,
      order: member.order,
      published: member.published,
    });
    setIsTeamMemberDialogOpen(true);
  };

  const handleSaveTeamMember = async () => {
    try {
      setIsSavingTeamMember(true);
      setUploadingTeamAvatar(true);

      if (
        !teamMemberForm.translations.en.name ||
        !teamMemberForm.translations.en.role
      ) {
        alert(t.admin.teamMembers.requiredFields);
        return;
      }

      let avatarUrl = teamMemberForm.avatar;
      let avatarBlobKey = teamMemberForm.avatar_blob_key;
      let memberId = editingTeamMember?.id || "";

      const memberData = {
        translations: teamMemberForm.translations,
        avatar: avatarUrl,
        avatar_blob_key: avatarBlobKey,
        category: teamMemberForm.category,
        order: teamMemberForm.order,
        published: teamMemberForm.published,
      };

      if (editingTeamMember) {
        await updateTeamMember(editingTeamMember.id!, memberData);
        memberId = editingTeamMember.id!;
      } else {
        const newMember = await addTeamMember(memberData);
        memberId = newMember?.id || "";
      }

      if (selectedTeamAvatar && memberId) {
        const formData = new FormData();
        formData.append("avatar", selectedTeamAvatar);

        const response = await fetch(
          `/api/admin/team-members/${memberId}/avatar`,
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
        avatarBlobKey = result.blobKey;

        await updateTeamMember(memberId, {
          avatar: avatarUrl,
          avatar_blob_key: avatarBlobKey,
        } as any);
      } else if (avatarUrl === "" && memberId) {
        await updateTeamMember(memberId, {
          avatar: "",
          avatar_blob_key: "",
        } as any);
      }

      await refreshData();
      resetTeamMemberForm();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.teamMembers.saveError}: ${errorMessage}`);
    } finally {
      setIsSavingTeamMember(false);
      setUploadingTeamAvatar(false);
    }
  };

  const resetTeamMemberForm = () => {
    setTeamMemberForm({
      translations: {
        en: { name: "", role: "", description: "" },
        es: { name: "", role: "", description: "" },
        it: { name: "", role: "", description: "" },
      },
      avatar: "",
      avatar_blob_key: "",
      category: "developer",
      order: 0,
      published: true,
    });
    setEditingTeamMember(null);
    setSelectedTeamAvatar(null);
    setTeamAvatarPreview("");
    setIsTeamMemberDialogOpen(false);
  };

  const handleNewTeamMember = () => {
    setTeamMemberForm({
      translations: {
        en: { name: "", role: "", description: "" },
        es: { name: "", role: "", description: "" },
        it: { name: "", role: "", description: "" },
      },
      avatar: "",
      avatar_blob_key: "",
      category: "developer",
      order: teamMembers.length,
      published: true,
    });
    setEditingTeamMember(null);
    setIsTeamMemberDialogOpen(true);
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm(t.admin.teamMembers.deleteConfirm)) {
      return;
    }

    try {
      await deleteTeamMember(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.teamMembers.deleteError}: ${errorMessage}`);
    }
  };

  const handleTeamAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedTeamAvatar(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProjectHighlight = (projectHighlight: ProjectHighlight) => {
    const normalizedTranslations = {
      en: {
        title:
          projectHighlight.translations?.en?.title ?? projectHighlight.title,
        subtitle:
          projectHighlight.translations?.en?.subtitle ??
          projectHighlight.subtitle,
        challenge: projectHighlight.translations?.en?.challenge ?? "",
        solution: projectHighlight.translations?.en?.solution ?? "",
        results: projectHighlight.translations?.en?.results ?? "",
        features: projectHighlight.translations?.en?.features ?? [],
      },
      es: {
        title:
          projectHighlight.translations?.es?.title ?? projectHighlight.title,
        subtitle:
          projectHighlight.translations?.es?.subtitle ??
          projectHighlight.subtitle,
        challenge: projectHighlight.translations?.es?.challenge ?? "",
        solution: projectHighlight.translations?.es?.solution ?? "",
        results: projectHighlight.translations?.es?.results ?? "",
        features: projectHighlight.translations?.es?.features ?? [],
      },
      it: {
        title:
          projectHighlight.translations?.it?.title ?? projectHighlight.title,
        subtitle:
          projectHighlight.translations?.it?.subtitle ??
          projectHighlight.subtitle,
        challenge: projectHighlight.translations?.it?.challenge ?? "",
        solution: projectHighlight.translations?.it?.solution ?? "",
        results: projectHighlight.translations?.it?.results ?? "",
        features: projectHighlight.translations?.it?.features ?? [],
      },
    };

    setEditingProjectHighlight(projectHighlight);
    setProjectHighlightForm({
      title: projectHighlight.title,
      subtitle: projectHighlight.subtitle,
      translations: normalizedTranslations,
      image: projectHighlight.image,
      technologies: projectHighlight.technologies.join(", "),
      client_name: projectHighlight.client_name || "",
      industry: projectHighlight.industry || "",
      category: projectHighlight.category,
      featured: projectHighlight.featured || false,
      published: projectHighlight.published || false,
    });
    setProjectHighlightImages(projectHighlight.images || []);
    setSelectedProjectHighlightImages([]);
    setProjectHighlightImageError("");
    setIsProjectHighlightDialogOpen(true);
  };

  const handleSaveProjectHighlight = async () => {
    try {
      setIsSavingProjectHighlight(true);
      setProjectHighlightImageError("");

      if (
        !projectHighlightForm.translations.en.title ||
        !projectHighlightForm.translations.es.title ||
        !projectHighlightForm.translations.it.title ||
        !projectHighlightForm.translations.en.subtitle ||
        !projectHighlightForm.translations.es.subtitle ||
        !projectHighlightForm.translations.it.subtitle
      ) {
        setProjectHighlightImageError(t.admin.projectHighlights.requiredFields);
        setIsSavingProjectHighlight(false);
        return;
      }

      const primaryImage =
        projectHighlightImages.length > 0
          ? `/api/images/${projectHighlightImages[0].blobKey}`
          : projectHighlightForm.image;

      const projectHighlightData = {
        title: projectHighlightForm.translations.en.title,
        subtitle: projectHighlightForm.translations.en.subtitle,
        translations: projectHighlightForm.translations,
        image: primaryImage,
        technologies: projectHighlightForm.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        client_name: projectHighlightForm.client_name,
        industry: projectHighlightForm.industry,
        category: projectHighlightForm.category,
        featured: projectHighlightForm.featured,
        published: projectHighlightForm.published,
      };

      let projectHighlightId: string;

      if (editingProjectHighlight) {
        await updateProjectHighlight(
          editingProjectHighlight.id,
          projectHighlightData,
        );
        projectHighlightId = editingProjectHighlight.id;
      } else {
        const newProjectHighlight =
          await addProjectHighlight(projectHighlightData);
        projectHighlightId = newProjectHighlight?.id || "";
      }

      if (selectedProjectHighlightImages.length > 0 && projectHighlightId) {
        const formData = new FormData();
        for (const file of selectedProjectHighlightImages) {
          formData.append("images", file);
        }
        formData.append("altText", projectHighlightForm.translations.en.title);

        const response = await fetch(
          `/api/admin/project-highlights/${projectHighlightId}/images`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setProjectHighlightImageError(
            errorData.message || "Error uploading images",
          );
          setIsSavingProjectHighlight(false);
          return;
        }

        const result = await response.json();

        const updatedImages = [...projectHighlightImages, ...result.images];
        const newPrimaryImage =
          updatedImages.length > 0
            ? `/api/images/${updatedImages[0].blobKey}`
            : projectHighlightForm.image;

        await updateProjectHighlight(projectHighlightId, {
          images: updatedImages,
          image: newPrimaryImage,
        } as any);
      }

      await refreshData();
      resetProjectHighlightForm();
      setIsSavingProjectHighlight(false);
    } catch (error) {
      console.error("Error saving case study:", error);
      const errorMessage = getErrorMessage(error);
      setProjectHighlightImageError(
        `${t.admin.projectHighlights.saveError}: ${errorMessage}`,
      );
      setIsSavingProjectHighlight(false);
    }
  };

  const handleDeleteProjectHighlight = async (id: string) => {
    if (!confirm(t.admin.projectHighlights.deleteConfirm)) {
      return;
    }

    try {
      await deleteProjectHighlight(id);
      await refreshData();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`${t.admin.projectHighlights.deleteError}: ${errorMessage}`);
    }
  };

  const resetProjectHighlightForm = () => {
    setProjectHighlightForm({
      title: "",
      subtitle: "",
      translations: {
        en: {
          title: "",
          subtitle: "",
          challenge: "",
          solution: "",
          results: "",
          features: [],
        },
        es: {
          title: "",
          subtitle: "",
          challenge: "",
          solution: "",
          results: "",
          features: [],
        },
        it: {
          title: "",
          subtitle: "",
          challenge: "",
          solution: "",
          results: "",
          features: [],
        },
      },
      image: "",
      technologies: "",
      client_name: "",
      industry: "",
      category: "web",
      featured: false,
      published: false,
    });
    setEditingProjectHighlight(null);
    setSelectedProjectHighlightImages([]);
    setProjectHighlightImages([]);
    setProjectHighlightImageError("");
    setIsProjectHighlightDialogOpen(false);
  };

  const handleNewProjectHighlight = () => {
    resetProjectHighlightForm();
    setIsProjectHighlightDialogOpen(true);
  };

  const handleProjectHighlightImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedProjectHighlightImages(fileArray);
      setProjectHighlightImageError("");
    }
  };

  const handleDeleteProjectHighlightImage = async (image: ProjectImage) => {
    if (!editingProjectHighlight) return;

    try {
      const response = await fetch(
        `/api/admin/project-highlights/${editingProjectHighlight.id}/images?blobKey=${encodeURIComponent(image.blobKey)}&mediaId=${image.mediaId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      const updatedImages = projectHighlightImages.filter(
        (img) => img.mediaId !== image.mediaId,
      );
      setProjectHighlightImages(updatedImages);

      const newPrimaryImage =
        updatedImages.length > 0
          ? `/api/images/${updatedImages[0].blobKey}`
          : "";

      await updateProjectHighlight(editingProjectHighlight.id, {
        images: updatedImages,
        image: newPrimaryImage,
      } as any);
      await refreshData();
    } catch (error) {
      console.error("Error deleting image:", error);
      setProjectHighlightImageError("Error deleting image");
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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Proyectos"
                        : language === "it"
                          ? "Progetti"
                          : "Projects"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="technologies">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Tecnologías"
                        : language === "it"
                          ? "Tecnologie"
                          : "Technologies"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="reviews">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Reseñas"
                        : language === "it"
                          ? "Recensioni"
                          : "Reviews"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Equipo"
                        : language === "it"
                          ? "Team"
                          : "Team"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="messages">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Mensajes"
                        : language === "it"
                          ? "Messaggi"
                          : "Messages"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="settings">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Contacto"
                        : language === "it"
                          ? "Contatto"
                          : "Contact"}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="project-highlights">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>
                      {language === "es"
                        ? "Proyectos Destacados"
                        : language === "it"
                          ? "Progetti in Evidenza"
                          : "Project Highlights"}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-7">
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
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {language === "es"
                ? "Equipo"
                : language === "it"
                  ? "Team"
                  : "Team"}
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
            <TabsTrigger
              value="project-highlights"
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              {language === "es"
                ? "Proyectos Destacados"
                : language === "it"
                  ? "Progetti in Evidenza"
                  : "Project Highlights"}
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
                              Subtitle (English){" "}
                              <span className="text-destructive">*</span>
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
                              Subtítulo (Español){" "}
                              <span className="text-destructive">*</span>
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
                              Sottotitolo (Italiano){" "}
                              <span className="text-destructive">*</span>
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
                          value: "web" | "mobile" | "fullstack",
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
                              {selectedImages.length}{" "}
                              {t.admin.projects.selectedImages}
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
                            | "deployment",
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetTechForm}
                      >
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
                        {isSavingTech
                          ? t.admin.common.saving
                          : t.admin.common.save}
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
                        <Label htmlFor="author">{t.admin.reviews.author}</Label>
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
                        <Label htmlFor="rating">{t.admin.reviews.rating}</Label>
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
                              rating: isNaN(value)
                                ? 5
                                : Math.min(5, Math.max(1, value)),
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
                      <Button
                        variant="outline"
                        onClick={resetReviewForm}
                        disabled={isSavingReview}
                      >
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
                        {isSavingReview
                          ? t.admin.common.saving
                          : t.admin.common.save}
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

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {t.admin.teamMembers.title}
              </h2>
              <Dialog
                open={isTeamMemberDialogOpen}
                onOpenChange={setIsTeamMemberDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={handleNewTeamMember}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    {t.admin.teamMembers.newMember}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTeamMember
                        ? t.admin.teamMembers.editMember
                        : t.admin.teamMembers.newMember}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Translations */}
                    <div>
                      <Label>Translations</Label>
                      <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                          <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                          <TabsTrigger value="it">🇮🇹 Italiano</TabsTrigger>
                        </TabsList>

                        {/* English */}
                        <TabsContent value="en" className="space-y-4">
                          <div>
                            <Label>{t.admin.teamMembers.name} (EN)</Label>
                            <Input
                              value={teamMemberForm.translations.en.name}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    en: {
                                      ...teamMemberForm.translations.en,
                                      name: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>{t.admin.teamMembers.role} (EN)</Label>
                            <Input
                              value={teamMemberForm.translations.en.role}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    en: {
                                      ...teamMemberForm.translations.en,
                                      role: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>
                              {t.admin.teamMembers.description} (EN)
                            </Label>
                            <Textarea
                              value={teamMemberForm.translations.en.description}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    en: {
                                      ...teamMemberForm.translations.en,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        {/* Spanish */}
                        <TabsContent value="es" className="space-y-4">
                          <div>
                            <Label>{t.admin.teamMembers.name} (ES)</Label>
                            <Input
                              value={teamMemberForm.translations.es.name}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    es: {
                                      ...teamMemberForm.translations.es,
                                      name: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>{t.admin.teamMembers.role} (ES)</Label>
                            <Input
                              value={teamMemberForm.translations.es.role}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    es: {
                                      ...teamMemberForm.translations.es,
                                      role: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>
                              {t.admin.teamMembers.description} (ES)
                            </Label>
                            <Textarea
                              value={teamMemberForm.translations.es.description}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    es: {
                                      ...teamMemberForm.translations.es,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              rows={3}
                            />
                          </div>
                        </TabsContent>

                        {/* Italian */}
                        <TabsContent value="it" className="space-y-4">
                          <div>
                            <Label>{t.admin.teamMembers.name} (IT)</Label>
                            <Input
                              value={teamMemberForm.translations.it.name}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    it: {
                                      ...teamMemberForm.translations.it,
                                      name: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>{t.admin.teamMembers.role} (IT)</Label>
                            <Input
                              value={teamMemberForm.translations.it.role}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    it: {
                                      ...teamMemberForm.translations.it,
                                      role: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>
                              {t.admin.teamMembers.description} (IT)
                            </Label>
                            <Textarea
                              value={teamMemberForm.translations.it.description}
                              onChange={(e) =>
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  translations: {
                                    ...teamMemberForm.translations,
                                    it: {
                                      ...teamMemberForm.translations.it,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              rows={3}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Avatar */}
                    <div>
                      <Label htmlFor="member-avatar">
                        {t.admin.teamMembers.avatar}
                      </Label>
                      <div className="space-y-4">
                        <Input
                          id="member-avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleTeamAvatarSelect}
                          disabled={uploadingTeamAvatar}
                        />
                        {(teamAvatarPreview || teamMemberForm.avatar) && (
                          <div className="flex items-center gap-4">
                            <img
                              src={teamAvatarPreview || teamMemberForm.avatar}
                              alt="Avatar preview"
                              className="w-20 h-20 rounded-full object-cover border-2 border-border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                if (
                                  teamMemberForm.avatar_blob_key &&
                                  editingTeamMember?.id
                                ) {
                                  try {
                                    const response = await fetch(
                                      `/api/admin/team-members/${editingTeamMember.id}/avatar?blobKey=${encodeURIComponent(teamMemberForm.avatar_blob_key)}`,
                                      { method: "DELETE" },
                                    );
                                    if (!response.ok) {
                                      console.error(
                                        "Failed to delete avatar from Azure",
                                      );
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error deleting avatar:",
                                      error,
                                    );
                                  }
                                }

                                setSelectedTeamAvatar(null);
                                setTeamAvatarPreview("");
                                setTeamMemberForm({
                                  ...teamMemberForm,
                                  avatar: "",
                                  avatar_blob_key: "",
                                });
                              }}
                              disabled={uploadingTeamAvatar}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {language === "es"
                                ? "Eliminar"
                                : language === "it"
                                  ? "Elimina"
                                  : "Remove"}
                            </Button>
                            {uploadingTeamAvatar && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading avatar...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <Label htmlFor="member-category">
                        {t.admin.teamMembers.category}
                      </Label>
                      <Select
                        value={teamMemberForm.category}
                        onValueChange={(value: "cofounder" | "developer") =>
                          setTeamMemberForm({
                            ...teamMemberForm,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t.admin.teamMembers.selectCategory}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMemberCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {
                                t.admin.teamMembers.categories[
                                  cat as "cofounder" | "developer"
                                ]
                              }
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Order */}
                    <div>
                      <Label htmlFor="member-order">
                        {t.admin.teamMembers.order}
                      </Label>
                      <Input
                        id="member-order"
                        type="number"
                        value={teamMemberForm.order}
                        onChange={(e) =>
                          setTeamMemberForm({
                            ...teamMemberForm,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    {/* Published */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="member-published"
                        checked={teamMemberForm.published}
                        onCheckedChange={(checked) =>
                          setTeamMemberForm({
                            ...teamMemberForm,
                            published: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="member-published">
                        {t.admin.teamMembers.published}
                      </Label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetTeamMemberForm();
                          setIsTeamMemberDialogOpen(false);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t.admin.common.cancel}
                      </Button>
                      <Button
                        onClick={handleSaveTeamMember}
                        disabled={isSavingTeamMember}
                      >
                        {isSavingTeamMember ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t.admin.common.saving}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {t.admin.common.save}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Team Members List */}
            <div className="grid gap-4">
              {teamMembers.map((member) => {
                const memberName =
                  member.translations[
                    language as keyof typeof member.translations
                  ]?.name || member.translations.en.name;
                const memberRole =
                  member.translations[
                    language as keyof typeof member.translations
                  ]?.role || member.translations.en.role;

                return (
                  <Card key={member.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        {member.avatar && (
                          <img
                            src={member.avatar}
                            alt={memberName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{memberName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {memberRole}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {t.admin.teamMembers.categories[member.category]}
                            </Badge>
                            <Badge
                              variant={
                                member.published ? "default" : "secondary"
                              }
                            >
                              {member.published ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline">
                              Order: {member.order}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTeamMember(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTeamMember(member.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

          {/* Case Studies Tab */}
          <TabsContent value="project-highlights" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">
                {t.admin.projectHighlights.title}
              </h2>
              <Dialog
                open={isProjectHighlightDialogOpen}
                onOpenChange={setIsProjectHighlightDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={handleNewProjectHighlight}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    {t.admin.projectHighlights.newProjectHighlight}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProjectHighlight
                        ? t.admin.projectHighlights.editProjectHighlight
                        : t.admin.projectHighlights.newProjectHighlight}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
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

                        {/* English Tab */}
                        <TabsContent value="en" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="cs-title-en">
                              Title (English){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cs-title-en"
                              value={projectHighlightForm.translations.en.title}
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    en: {
                                      ...projectHighlightForm.translations.en,
                                      title: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Case study title in English"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-subtitle-en">
                              Subtitle (English){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cs-subtitle-en"
                              value={
                                projectHighlightForm.translations.en.subtitle
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    en: {
                                      ...projectHighlightForm.translations.en,
                                      subtitle: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Short description"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-challenge-en">
                              Challenge (English)
                            </Label>
                            <Textarea
                              id="cs-challenge-en"
                              value={
                                projectHighlightForm.translations.en.challenge
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    en: {
                                      ...projectHighlightForm.translations.en,
                                      challenge: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Describe the challenge or problem"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-solution-en">
                              Solution (English)
                            </Label>
                            <Textarea
                              id="cs-solution-en"
                              value={
                                projectHighlightForm.translations.en.solution
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    en: {
                                      ...projectHighlightForm.translations.en,
                                      solution: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Describe the technical solution"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-results-en">
                              Results (English)
                            </Label>
                            <Textarea
                              id="cs-results-en"
                              value={
                                projectHighlightForm.translations.en.results
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    en: {
                                      ...projectHighlightForm.translations.en,
                                      results: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Describe the results and impact"
                              rows={4}
                            />
                          </div>
                        </TabsContent>

                        {/* Spanish Tab */}
                        <TabsContent value="es" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="cs-title-es">
                              Título (Español){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cs-title-es"
                              value={projectHighlightForm.translations.es.title}
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    es: {
                                      ...projectHighlightForm.translations.es,
                                      title: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Título del caso de estudio en español"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-subtitle-es">
                              Subtítulo (Español){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cs-subtitle-es"
                              value={
                                projectHighlightForm.translations.es.subtitle
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    es: {
                                      ...projectHighlightForm.translations.es,
                                      subtitle: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descripción breve"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-challenge-es">
                              Desafío (Español)
                            </Label>
                            <Textarea
                              id="cs-challenge-es"
                              value={
                                projectHighlightForm.translations.es.challenge
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    es: {
                                      ...projectHighlightForm.translations.es,
                                      challenge: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Describe el desafío o problema"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-solution-es">
                              Solución (Español)
                            </Label>
                            <Textarea
                              id="cs-solution-es"
                              value={
                                projectHighlightForm.translations.es.solution
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    es: {
                                      ...projectHighlightForm.translations.es,
                                      solution: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Describe la solución técnica"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-results-es">
                              Resultados (Español)
                            </Label>
                            <Textarea
                              id="cs-results-es"
                              value={
                                projectHighlightForm.translations.es.results
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    es: {
                                      ...projectHighlightForm.translations.es,
                                      results: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Describe los resultados e impacto"
                              rows={4}
                            />
                          </div>
                        </TabsContent>

                        {/* Italian Tab */}
                        <TabsContent value="it" className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="cs-title-it">
                              Titolo (Italiano){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cs-title-it"
                              value={projectHighlightForm.translations.it.title}
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    it: {
                                      ...projectHighlightForm.translations.it,
                                      title: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Titolo del caso di studio in italiano"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-subtitle-it">
                              Sottotitolo (Italiano){" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="cs-subtitle-it"
                              value={
                                projectHighlightForm.translations.it.subtitle
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    it: {
                                      ...projectHighlightForm.translations.it,
                                      subtitle: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Breve descrizione"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-challenge-it">
                              Sfida (Italiano)
                            </Label>
                            <Textarea
                              id="cs-challenge-it"
                              value={
                                projectHighlightForm.translations.it.challenge
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    it: {
                                      ...projectHighlightForm.translations.it,
                                      challenge: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descrivi la sfida o problema"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-solution-it">
                              Soluzione (Italiano)
                            </Label>
                            <Textarea
                              id="cs-solution-it"
                              value={
                                projectHighlightForm.translations.it.solution
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    it: {
                                      ...projectHighlightForm.translations.it,
                                      solution: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descrivi la soluzione tecnica"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cs-results-it">
                              Risultati (Italiano)
                            </Label>
                            <Textarea
                              id="cs-results-it"
                              value={
                                projectHighlightForm.translations.it.results
                              }
                              onChange={(e) =>
                                setProjectHighlightForm({
                                  ...projectHighlightForm,
                                  translations: {
                                    ...projectHighlightForm.translations,
                                    it: {
                                      ...projectHighlightForm.translations.it,
                                      results: e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="Descrivi i risultati e l'impatto"
                              rows={4}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Other Fields */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cs-technologies">
                          Technologies (comma-separated)
                        </Label>
                        <Input
                          id="cs-technologies"
                          value={projectHighlightForm.technologies}
                          onChange={(e) =>
                            setProjectHighlightForm({
                              ...projectHighlightForm,
                              technologies: e.target.value,
                            })
                          }
                          placeholder="React, Node.js, PostgreSQL"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cs-client">Client Name</Label>
                          <Input
                            id="cs-client"
                            value={projectHighlightForm.client_name}
                            onChange={(e) =>
                              setProjectHighlightForm({
                                ...projectHighlightForm,
                                client_name: e.target.value,
                              })
                            }
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cs-industry">Industry</Label>
                          <Input
                            id="cs-industry"
                            value={projectHighlightForm.industry}
                            onChange={(e) =>
                              setProjectHighlightForm({
                                ...projectHighlightForm,
                                industry: e.target.value,
                              })
                            }
                            placeholder="e.g., FinTech, Education"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cs-category">Category</Label>
                        <Select
                          value={projectHighlightForm.category}
                          onValueChange={(
                            value: "web" | "mobile" | "fullstack",
                          ) =>
                            setProjectHighlightForm({
                              ...projectHighlightForm,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="fullstack">
                              Full Stack
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="cs-featured"
                            checked={projectHighlightForm.featured}
                            onCheckedChange={(checked) =>
                              setProjectHighlightForm({
                                ...projectHighlightForm,
                                featured: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="cs-featured">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="cs-published"
                            checked={projectHighlightForm.published}
                            onCheckedChange={(checked) =>
                              setProjectHighlightForm({
                                ...projectHighlightForm,
                                published: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="cs-published">Published</Label>
                        </div>
                      </div>

                      {/* Images */}
                      <div>
                        <Label>{t.admin.projectHighlights.images}</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleProjectHighlightImageSelect}
                          className="mt-2"
                        />
                        {selectedProjectHighlightImages.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {selectedProjectHighlightImages.length} image(s)
                            selected
                          </p>
                        )}
                        {projectHighlightImageError && (
                          <p className="text-sm text-destructive mt-2">
                            {projectHighlightImageError}
                          </p>
                        )}

                        {/* Current Images */}
                        {projectHighlightImages.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-sm">Current Images:</Label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              {projectHighlightImages.map((img) => (
                                <div
                                  key={img.mediaId}
                                  className="relative group"
                                >
                                  <Image
                                    src={`/api/images/${img.blobKey}`}
                                    alt={img.alt}
                                    width={200}
                                    height={150}
                                    className="rounded object-cover"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                                    onClick={() =>
                                      handleDeleteProjectHighlightImage(img)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={resetProjectHighlightForm}
                        disabled={isSavingProjectHighlight}
                      >
                        {t.admin.common.cancel}
                      </Button>
                      <Button
                        onClick={handleSaveProjectHighlight}
                        disabled={isSavingProjectHighlight}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        {isSavingProjectHighlight ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t.admin.common.saving}
                          </>
                        ) : (
                          t.admin.common.save
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Case Studies List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectHighlights.map((projectHighlight) => (
                <Card key={projectHighlight.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">
                          {projectHighlight.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {projectHighlight.subtitle}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleEditProjectHighlight(projectHighlight)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteProjectHighlight(projectHighlight.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {projectHighlight.client_name && (
                        <p className="text-sm">
                          <span className="font-semibold">Client:</span>{" "}
                          {projectHighlight.client_name}
                        </p>
                      )}
                      {projectHighlight.industry && (
                        <Badge variant="secondary">
                          {projectHighlight.industry}
                        </Badge>
                      )}
                      <div className="flex gap-2">
                        {projectHighlight.featured && (
                          <Badge className="bg-gradient-to-r from-primary to-secondary">
                            Featured
                          </Badge>
                        )}
                        {projectHighlight.published ? (
                          <Badge variant="outline">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
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
