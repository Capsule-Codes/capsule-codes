"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import Link from "next/link";
import type { Project } from "@/lib/data-context";

interface ProjectsCarouselProps {
  projects: Project[];
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || projects.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, projects.length]);

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
      subtitle: undefined,
      description: project.description,
    };
  };

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setIsAutoPlaying(false);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlaying(false);
  };

  const goToProject = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 border border-border rounded-lg p-6 max-w-md mx-auto">
          <div className="text-muted-foreground mb-2">📁</div>
          <h3 className="text-foreground font-medium mb-2">
            {language === "es"
              ? "No hay proyectos disponibles"
              : language === "it"
                ? "Nessun progetto disponibile"
                : "No projects available"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {language === "es"
              ? "Los proyectos aparecerán aquí una vez que se agreguen desde el panel de administración."
              : language === "it"
                ? "I progetti appariranno qui una volta aggiunti dal pannello di amministrazione."
                : "Projects will appear here once added from the admin panel."}
          </p>
        </div>
      </div>
    );
  }

  const currentProject = projects[currentIndex];
  const projectContent = getProjectContent(currentProject);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative">
        <Link href={`/projects/${currentProject.id}`}>
          <Card className="group overflow-hidden border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="relative overflow-hidden h-64 md:h-80">
              <img
                src={currentProject.image || "/placeholder.svg"}
                alt={projectContent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <Badge className="absolute top-4 left-4 capitalize">
                {currentProject.category}
              </Badge>
              {currentProject.published && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white hover:bg-green-600">
                  {language === "es"
                    ? "Publicado"
                    : language === "it"
                    ? "Pubblicato"
                    : "Published"}
                </Badge>
              )}
            </div>

            <CardHeader className="pb-4">
              <CardTitle className="text-2xl md:text-3xl group-hover:text-primary transition-colors duration-300">
                {projectContent.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-muted-foreground mb-4 flex-1">{projectContent.subtitle}</CardDescription>

              <div className="flex flex-wrap gap-2 mb-6">
                {currentProject.technologies.map((tech, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {currentProject.liveUrl && (
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t.projects.viewDemo}
                    </a>
                  </Button>
                )}
                {currentProject.githubUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-muted bg-transparent"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevProject}
            className="hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextProject}
            className="hover:bg-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
