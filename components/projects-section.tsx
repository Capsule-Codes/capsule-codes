"use client";

import Link from "next/link";
import { Capsule } from "@/components/ui/capsule";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useLanguage } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";
import {
  ProjectsCarousel,
  getProjectContent,
  getCategoryLabel,
  getProjectImage,
} from "./projects-carousel";

interface ProjectsSectionProps {
  projects?: Project[];
}

const FALLBACK_BG =
  "radial-gradient(ellipse at 30% 30%, oklch(0.4 0.18 180 / 0.5), transparent 60%), oklch(0.12 0.02 200)";

export function ProjectsSection({
  projects: projectsProp,
}: ProjectsSectionProps = {}) {
  const { t, language } = useLanguage();

  const allProjects = projectsProp ?? [];
  const projects = allProjects.filter((p) => p.published === true);

  const featuredIndex = projects.findIndex((p) => p.featured === true);
  const featured = featuredIndex >= 0 ? projects[featuredIndex] : null;
  const others = featured
    ? projects.filter((_, i) => i !== featuredIndex)
    : projects;

  const titleWords = t.projects.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const leadingWords = titleWords.slice(0, -1).join(" ");

  return (
    <section
      id="projects"
      className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]"
    >
      <SectionHeader
        eyebrow="— 05 / Projects"
        title={
          <>
            {leadingWords}
            {leadingWords && " "}
            <em className="not-italic text-brand-grad">{lastWord}</em>
          </>
        }
        lead={t.projects.subtitle}
      />

      {/* Mobile carousel */}
      <ProjectsCarousel projects={projects} />

      {/* Desktop bento */}
      {projects.length > 0 && (
        <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-4 mt-12 lg:mt-14">
          {featured && (
            <ScrollReveal className="col-span-1 row-span-2">
              <BentoCard project={featured} featured language={language} t={t} />
            </ScrollReveal>
          )}
          {others.slice(0, featured ? 4 : 6).map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.06}>
              <BentoCard project={project} language={language} t={t} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}

interface BentoCardProps {
  project: Project;
  featured?: boolean;
  language: ReturnType<typeof useLanguage>["language"];
  t: ReturnType<typeof useLanguage>["t"];
}

function BentoCard({ project, featured = false, language, t }: BentoCardProps) {
  const content = getProjectContent(project, language);
  const image = getProjectImage(project);
  const category = getCategoryLabel(project.category, t);

  return (
    <Link href={`/projects/${project.id}`} className="block h-full group">
      <article
        className={`relative overflow-hidden rounded-2xl bg-cover bg-center border border-[color:var(--ink-line)] transition-[transform,border-color] duration-300 group-hover:-translate-y-0.5 group-hover:border-[color:var(--brand-cyan)]/40 ${
          featured ? "h-full min-h-[400px]" : "aspect-[4/3]"
        }`}
        style={{
          backgroundImage: image ? `url(${image})` : FALLBACK_BG,
        }}
      >
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, oklch(0.05 0 0 / 0.95))",
          }}
        />
        <div
          className={`absolute left-5 right-5 bottom-5 z-[2] flex flex-col ${
            featured ? "gap-3" : "gap-2"
          }`}
        >
          <Capsule size="sm" dot={false}>
            {category}
          </Capsule>
          <h3
            className={`font-semibold tracking-[-0.01em] text-white ${
              featured ? "text-2xl leading-[1.15]" : "text-base"
            }`}
          >
            {content.title}
          </h3>
          {featured && content.description && (
            <p className="text-[13px] leading-[1.5] text-white/70 line-clamp-3">
              {content.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
