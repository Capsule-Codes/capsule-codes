"use client";

import { Capsule } from "@/components/ui/capsule";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { Project } from "@/lib/data-context";
import { getProjectContent, getCategoryLabel } from "@/components/projects-carousel";

interface ProjectsListProps {
  projects: Project[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ProjectsList({ projects, activeId, onSelect }: ProjectsListProps) {
  const { language, t } = useLanguage();

  return (
    <div
      className={cn(
        "border-[color:var(--ink-line)]",
        "max-md:flex max-md:gap-2 max-md:overflow-x-auto max-md:border-b max-md:p-3",
        "md:block md:border-r md:p-[18px]",
      )}
    >
      {projects.map((project, index) => {
        const content = getProjectContent(project, language);
        const isActive = project.id === activeId;
        return (
          <button
            key={project.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(project.id)}
            className={cn(
              "text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
              "max-md:shrink-0 max-md:whitespace-nowrap max-md:rounded-xl max-md:border max-md:px-4 max-md:py-2.5",
              "md:grid md:grid-cols-[42px_1fr_auto] md:items-center md:gap-4 md:rounded-2xl md:border md:px-3.5 md:py-5",
              "md:[&+button]:mt-2",
              isActive
                ? "border-[color:var(--ink-line)] bg-[color:var(--hover-bg)] text-[color:var(--ink-fg)]"
                : "border-transparent text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--ink-fg)]",
            )}
          >
            <span className="hidden text-[13px] text-[color:var(--ink-muted)] md:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="block min-w-0">
              <span className="block truncate text-base font-semibold tracking-[-0.01em] md:mb-1.5">
                {content.title}
              </span>
              {content.subtitle && (
                <span className="hidden truncate text-[13px] text-[color:var(--ink-muted)] md:block">
                  {content.subtitle}
                </span>
              )}
            </span>
            <span className="hidden md:block">
              <Capsule size="sm" dot={false}>
                {getCategoryLabel(project.category, t)}
              </Capsule>
            </span>
          </button>
        );
      })}
    </div>
  );
}
