"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProjectsPage() {
  const { t, language } = useLanguage()
  const { projects } = useData()

  // Helper function to get project content in current language
  const getProjectContent = (project: typeof projects[0]) => {
    if (project.translations && project.translations[language as keyof typeof project.translations]) {
      return project.translations[language as keyof typeof project.translations];
    }
    return { title: project.title, description: project.description };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.projects.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.projects.subtitle}</p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const content = getProjectContent(project);
              return (
                <Card
                  key={project.id}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={content.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {content.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">{content.description}</CardDescription>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t.projects.viewLive}
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg">
              <Link href="/">← {t.projects.backToHome}</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
