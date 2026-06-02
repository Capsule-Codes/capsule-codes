"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import type { Project } from "@/lib/data-context"

interface ProjectsPageClientProps {
  projects: Project[]
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const { t, language } = useLanguage()

  // Helper function to get project content in current language
  const getProjectContent = (project: Project) => {
    if (project.translations && project.translations[language as keyof typeof project.translations]) {
      return project.translations[language as keyof typeof project.translations];
    }
    return { title: project.title, subtitle: "", description: project.description };
  };

  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t.projects.title.split(" ")[0]}{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t.projects.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{t.projects.subtitle}</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
          const content = getProjectContent(project);
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={content.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 capitalize">
                      {project.category}
                    </Badge>
                    {project.published && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white hover:bg-green-600">
                        {language === "es"
                          ? "Publicado"
                          : language === "it"
                          ? "Pubblicato"
                          : "Published"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {content.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mb-4 flex-1">{content.subtitle}</CardDescription>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.liveUrl && (
                      <Button size="sm" className="flex-1" asChild onClick={(e) => e.stopPropagation()}>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t.projects.viewLive}
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild onClick={(e) => e.stopPropagation()}>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Back to Home */}
      <div className="text-center mt-16">
        <Button asChild variant="outline" size="lg">
          <Link href="/">← {t.projects.backToHome}</Link>
        </Button>
      </div>
    </>
  )
}
