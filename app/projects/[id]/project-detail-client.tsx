"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import type { Project } from "@/lib/data-context"
import { isPortraitImage } from "@/components/projects-carousel"
import { ProjectLightbox } from "@/components/project-lightbox"

interface ProjectDetailClientProps {
  project: Project
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const { t, language } = useLanguage()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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
  // Keep full ProjectImage objects (sorted by sortOrder) so we retain real dimensions.
  const imageObjects =
    project.images && project.images.length > 0
      ? [...project.images].sort((a, b) => a.sortOrder - b.sortOrder)
      : [];
  const images = imageObjects.length > 0
    ? imageObjects.map((img) => img.blobKey)
    : project.image
      ? [project.image]
      : [];

  // A project is "portrait" when at least half of its images are portrait.
  const portraitCount = imageObjects.filter((img) => isPortraitImage(img)).length;
  const isPortraitProject =
    imageObjects.length > 0 && portraitCount >= imageObjects.length / 2;

  // Ordered list backing the lightbox. Must match the exact render order of the
  // active layout so click indexes line up: the portrait layout renders the
  // dimension-filtered imageObjects, the landscape layout renders `images`.
  const portraitImages = imageObjects.filter(
    (img) => img.width > 0 && img.height > 0,
  );
  const lightboxImages = isPortraitProject
    ? portraitImages.map((img, index) => ({
        src: img.blobKey,
        alt: `${content.title} - ${index + 1}`,
      }))
    : images.map((src, index) => ({
        src,
        alt: images.length === 1 ? content.title : `${content.title} - ${index + 1}`,
      }));

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
      {isPortraitProject ? (
        /* App Store layout for portrait (vertical) screenshots */
        <div className="mb-12 space-y-8">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {imageObjects
              .filter((img) => img.width > 0 && img.height > 0)
              .map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`${language === "es" ? "Ampliar imagen" : language === "it" ? "Ingrandisci immagine" : "Open image"} ${index + 1}`}
                className="cursor-zoom-in animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Image
                  src={img.blobKey}
                  alt={`${content.title} - ${index + 1}`}
                  width={img.width}
                  height={img.height}
                  priority={index === 0}
                  className="h-[55vh] md:h-[70vh] max-h-[640px] w-auto max-w-full rounded-[1.5rem] border border-border transition-transform duration-300 hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        </div>
      ) : images.length > 0 ? (
        <div className="mb-12">
          {images.length === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Single Image */}
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                aria-label={language === "es" ? "Ampliar imagen" : language === "it" ? "Ingrandisci immagine" : "Open image"}
                className="relative w-full aspect-video rounded-lg overflow-hidden border border-border cursor-zoom-in animate-in fade-in slide-in-from-bottom-4 duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={images[0]}
                  alt={content.title}
                  fill
                  className="object-contain bg-muted/50 transition-transform duration-300 hover:scale-105"
                  priority
                />
              </button>
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
                <button
                  type="button"
                  onClick={() => setLightboxIndex(0)}
                  aria-label={`${language === "es" ? "Ampliar imagen" : language === "it" ? "Ingrandisci immagine" : "Open image"} 1`}
                  className="relative w-full aspect-video rounded-lg overflow-hidden border border-border cursor-zoom-in animate-in fade-in slide-in-from-bottom-4 duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Image
                    src={images[0]}
                    alt={`${content.title} - 1`}
                    fill
                    className="object-contain bg-muted/50 transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </button>
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
                    <button
                      key={index + 1}
                      type="button"
                      onClick={() => setLightboxIndex(index + 1)}
                      aria-label={`${language === "es" ? "Ampliar imagen" : language === "it" ? "Ingrandisci immagine" : "Open image"} ${index + 2}`}
                      className="relative w-full aspect-video rounded-lg overflow-hidden border border-border cursor-zoom-in animate-in fade-in slide-in-from-bottom-4 duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <Image
                        src={img}
                        alt={`${content.title} - ${index + 2}`}
                        fill
                        className="object-cover bg-muted/50 hover:scale-105 transition-transform duration-300"
                      />
                    </button>
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
              <Globe className="w-5 h-5 mr-2" />
              {language === "es"
                ? "Sitio web"
                : language === "it"
                ? "Sito web"
                : "Visit Website"}
            </a>
          </Button>
        )}
        {project.appStoreUrl && (
          <Button size="lg" variant="outline" className="flex-1" asChild>
            <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.05 12.04c-.02-2.07 1.69-3.06 1.77-3.11-.96-1.41-2.46-1.6-3-1.62-1.28-.13-2.5.75-3.15.75-.65 0-1.66-.73-2.73-.71-1.4.02-2.69.81-3.41 2.07-1.45 2.52-.37 6.25 1.04 8.29.69 1 1.51 2.12 2.58 2.08 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.6.67 2.69.65 1.11-.02 1.82-1.02 2.5-2.02.79-1.16 1.11-2.28 1.13-2.34-.03-.01-2.17-.83-2.19-3.29zM15 5.13c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-.99 1.58-.87 2.51.91.07 1.85-.46 2.42-1.14z" />
              </svg>
              App Store
            </a>
          </Button>
        )}
        {project.playStoreUrl && (
          <Button size="lg" variant="outline" className="flex-1" asChild>
            <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3.6 2.27c-.2.21-.31.53-.31.95v17.56c0 .42.11.74.31.95l.06.05L13.5 12v-.02L3.66 2.22l-.06.05zM17.1 15.62l-3.6-3.6v-.04l3.6-3.6.08.05 4.27 2.42c1.22.69 1.22 1.83 0 2.53l-4.27 2.42-.08-.18zM13.5 12.02l3.6 3.6L5.9 21.96c-.4.23-.78.21-1.04 0l8.64-9.94zM4.86 2.04c.26-.21.64-.23 1.04 0l11.2 6.34-3.6 3.6L4.86 2.04z" />
              </svg>
              Google Play
            </a>
          </Button>
        )}
      </div>

      {lightboxImages.length > 0 && (
        <ProjectLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  )
}