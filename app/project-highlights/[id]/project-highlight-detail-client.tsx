"use client";

import { useLanguage } from "@/hooks/use-language";
import type { ProjectHighlight } from "@/lib/data-context.tsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectHighlightDetailClientProps {
  projectHighlight: ProjectHighlight;
}

export function ProjectHighlightDetailClient({
  projectHighlight,
}: ProjectHighlightDetailClientProps) {
  const { t, language } = useLanguage();

  const content = projectHighlight.translations?.[
    language as keyof typeof projectHighlight.translations
  ] || {
    title: projectHighlight.title,
    subtitle: projectHighlight.subtitle,
    challenge: "",
    solution: "",
    results: "",
    features: [],
  };

  const images = projectHighlight.images || [];
  const primaryImage = images[0]
    ? `/api/images/${images[0].blobKey}`
    : projectHighlight.image;
  const additionalImages = images.slice(1);

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <Link href="/project-highlights">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t.projectHighlights.backToCaseStudies}
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          {projectHighlight.featured && (
            <Badge className="bg-gradient-to-r from-primary to-secondary">
              Featured
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold">{content.title}</h1>
          <p className="text-xl text-muted-foreground">{content.subtitle}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            {projectHighlight.client_name && (
              <div>
                <span className="font-semibold">{t.projectHighlights.client}:</span>{" "}
                {projectHighlight.client_name}
              </div>
            )}
            {projectHighlight.industry && (
              <div>
                <span className="font-semibold">{t.projectHighlights.industry}:</span>{" "}
                {projectHighlight.industry}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {projectHighlight.live_url && (
              <Link
                href={projectHighlight.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Live
                </Button>
              </Link>
            )}
            {projectHighlight.github_url && (
              <Link
                href={projectHighlight.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Primary Image */}
        {primaryImage && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={primaryImage}
              alt={content.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Challenge Section */}
      {content.challenge && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">{t.projectHighlights.challenge}</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {content.challenge}
            </p>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {content.solution && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">{t.projectHighlights.solution}</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {content.solution}
            </p>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {projectHighlight.technologies.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">{t.projectHighlights.techStack}</h2>
          <div className="flex flex-wrap gap-2">
            {projectHighlight.technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Key Features */}
      {content.features && content.features.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">{t.projectHighlights.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    {feature}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Results Section */}
      {content.results && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">{t.projectHighlights.results}</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {content.results}
            </p>
          </div>
        </section>
      )}

      {/* Metrics */}
      {projectHighlight.metrics && projectHighlight.metrics.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">{t.projectHighlights.metrics}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectHighlight.metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  {metric.icon && (
                    <div className="text-4xl mb-2">{metric.icon}</div>
                  )}
                  <div className="text-3xl font-bold text-primary">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Additional Images / Screenshots */}
      {additionalImages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalImages.map((img) => (
              <div
                key={img.mediaId}
                className="relative h-[300px] rounded-lg overflow-hidden"
              >
                <Image
                  src={`/api/images/${img.blobKey}`}
                  alt={img.alt || content.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Architecture Diagram */}
      {projectHighlight.architecture_diagram && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Technical Architecture</h2>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-muted">
            <Image
              src={projectHighlight.architecture_diagram}
              alt="Architecture Diagram"
              fill
              className="object-contain"
            />
          </div>
        </section>
      )}

      {/* Testimonial */}
      {projectHighlight.testimonial && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Client Testimonial</h2>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-lg italic">"{projectHighlight.testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  {projectHighlight.testimonial.avatar && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={projectHighlight.testimonial.avatar}
                        alt={projectHighlight.testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">
                      {projectHighlight.testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {projectHighlight.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
