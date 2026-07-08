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
        "max-lg:flex max-lg:gap-2 max-lg:overflow-x-auto max-lg:border-b max-lg:p-3",
        "lg:block lg:border-r lg:p-[18px]",
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
              "max-lg:shrink-0 max-lg:whitespace-nowrap max-lg:rounded-xl max-lg:border max-lg:px-4 max-lg:py-2.5",
              "lg:grid lg:grid-cols-[42px_1fr_auto] lg:items-center lg:gap-4 lg:rounded-2xl lg:border lg:px-3.5 lg:py-5",
              "lg:[&+button]:mt-2",
              isActive
                ? "border-[color:var(--ink-line)] bg-[color:var(--hover-bg)] text-[color:var(--ink-fg)]"
                : "border-transparent text-[color:var(--ink-muted)] hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--ink-fg)]",
            )}
          >
            <span className="hidden text-[13px] text-[color:var(--ink-muted)] lg:block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="block min-w-0">
              <span className="block truncate text-base font-semibold tracking-[-0.01em] lg:mb-1.5">
                {content.title}
              </span>
              {content.subtitle && (
                <span className="hidden truncate text-[13px] text-[color:var(--ink-muted)] lg:block">
                  {content.subtitle}
                </span>
              )}
            </span>
            <span className="hidden lg:block">
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
