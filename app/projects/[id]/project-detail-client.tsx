"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import type { Project } from "@/lib/data-context"

interface ProjectDetailClientProps {
  project: Project
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { t, language } = useLanguage()

  // Helper function to get project content in current language
  const getProjectContent = (project: Project) => {
    if (project.translations && project.translations[language as keyof typeof project.translations]) {
      return project.translations[language as keyof typeof project.translations];
    }
    return { title: project.title, subtitle: "", description: project.description };
  };

  const content = getProjectContent(project);
  
  // Get all images (use images array if available, otherwise fallback to single image).
  // blobKey now stores a full public URL (Supabase Storage), so use it as-is.
  const images = project.images && project.images.length > 0
    ? project.images.sort((a, b) => a.sortOrder - b.sortOrder).map(img => img.blobKey)
    : project.image
      ? [project.image]
      : [];

  return (
    <>
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/#projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.projects.backToProjects}
          </Link>
        </Button>
      </div>

      {/* Header Section - Título y Subtítulo */}
      <div className="mb-12">
        <div className="flex gap-2 mb-4">
          <Badge className="capitalize">{project.category}</Badge>
          {project.published && (
            <Badge className="bg-green-500 text-white hover:bg-green-600">
              {language === "es"
                ? "Publicado"
                : language === "it"
                ? "Pubblicato"
                : "Published"}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {content.title.split(" ")[0]}{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {content.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        {content.subtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Content Row - Foto y Descripción lado a lado */}
      {images.length > 0 ? (
        <div className="mb-12">
          {images.length === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Single Image */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Image
                  src={images[0]}
                  alt={content.title}
                  fill
                  className="object-contain bg-muted/50"
                  priority
                />
              </div>
              {/* Description */}
              <div className="flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {content.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* First Row: First Image and Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* First Image */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Image
                    src={images[0]}
                    alt={`${content.title} - 1`}
                    fill
                    className="object-contain bg-muted/50"
                    priority
                  />
                </div>
                {/* Description */}
                <div className="flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {content.description}
                  </p>
                </div>
              </div>
              {/* Additional Images Grid - Estilo Apple */}
              {images.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.slice(1).map((img, index) => (
                    <div
                      key={index + 1}
                      className="relative w-full aspect-video rounded-lg overflow-hidden border border-border animate-in fade-in slide-in-from-bottom-4 duration-700"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <Image
                        src={img}
                        alt={`${content.title} - ${index + 2}`}
                        fill
                        className="object-cover bg-muted/50 hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Description only if no images */
        <div className="mb-12">
          <div className="max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      )}

      {/* Technologies */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t.technologies.title}</h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-sm py-1.5 px-3">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {project.liveUrl && (
          <Button size="lg" className="flex-1" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 mr-2" />
              {t.projects.viewLive}
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button size="lg" variant="outline" className="flex-1" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          </Button>
        )}
      </div>
    </>
  )
}