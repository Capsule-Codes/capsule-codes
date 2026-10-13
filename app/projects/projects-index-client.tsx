"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/project-card";
import { useLanguage } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";

export function ProjectsIndexClient({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const titleWords = t.projects.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const leadingWords = titleWords.slice(0, -1).join(" ");

  return (
    <>
      <div className="mb-10">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.projects.backToHome}
          </Link>
        </Button>
      </div>

      <SectionHeader
        eyebrow={`— ${t.nav.projects}`}
        title={
          <>
            {leadingWords}
            {leadingWords && " "}
            <em className="not-italic text-brand-grad">{lastWord}</em>
          </>
        }
        lead={t.projects.subtitle}
      />

      {projects.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] p-6">
            <p className="text-[13px] text-[color:var(--ink-muted)]">{t.projects.noProjects}</p>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
