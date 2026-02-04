"use client";

import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ProjectsCarousel } from "./projects-carousel";
import type { Project } from "@/lib/data-context";

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({
  projects: projectsProp,
}: ProjectsSectionProps = {}) {
  const { t } = useLanguage();

  // Use prop if provided, otherwise fall back to context (for backward compatibility)
  // This allows the component to work both with SSR (props) and client-side (context)
  const projects = projectsProp || [];

  const featuredProjects = projects.filter((project) => project.featured);

  const handleViewAllProjects = () => {
    window.location.href = "/projects";
  };

  return (
    <section id="projects" className="py-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.projects.title.split(" ")[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.projects.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t.projects.subtitle}
          </p>
        </div>

        <ProjectsCarousel projects={featuredProjects} />

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6 hover:scale-105 transition-transform duration-300"
            onClick={handleViewAllProjects}
          >
            {t.projects.viewAll}
          </Button>
        </div>
      </div>
    </section>
  );
}
