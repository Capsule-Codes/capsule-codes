"use client";

import { useLanguage } from "@/hooks/use-language";
import type { ProjectHighlight } from "@/lib/data-context.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CaseStudiesClientProps {
  projectHighlights: ProjectHighlight[];
}

export function ProjectHighlightsClient({ projectHighlights }: CaseStudiesClientProps) {
  const { t, language } = useLanguage();

  const getProjectHighlightContent = (projectHighlight: ProjectHighlight) => {
    if (
      projectHighlight.translations &&
      projectHighlight.translations[language as keyof typeof projectHighlight.translations]
    ) {
      return projectHighlight.translations[
        language as keyof typeof projectHighlight.translations
      ];
    }
    return {
      title: projectHighlight.title,
      subtitle: projectHighlight.subtitle,
      challenge: "",
      solution: "",
      results: "",
      features: [],
    };
  };

  const publishedCaseStudies = projectHighlights.filter((cs) => cs.published);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t.projectHighlights.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.projectHighlights.subtitle}
        </p>
      </div>

      {/* Grid of case studies */}
      {publishedCaseStudies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No case studies available yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCaseStudies.map((projectHighlight) => {
            const content = getProjectHighlightContent(projectHighlight);
            const primaryImage = projectHighlight.images?.[0]
              ? `/api/images/${projectHighlight.images[0].blobKey}`
              : projectHighlight.image;

            return (
              <Link key={projectHighlight.id} href={`/project-highlights/${projectHighlight.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={primaryImage || "/placeholder.jpg"}
                      alt={content.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {projectHighlight.featured && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-secondary">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2">
                          {content.title}
                        </CardTitle>
                        {projectHighlight.client_name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {projectHighlight.client_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {content.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Industry */}
                    {projectHighlight.industry && (
                      <Badge variant="secondary">{projectHighlight.industry}</Badge>
                    )}

                    {/* Technologies */}
                    {projectHighlight.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectHighlight.technologies
                          .slice(0, 3)
                          .map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        {projectHighlight.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{projectHighlight.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {t.projectHighlights.viewProjectHighlight}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
