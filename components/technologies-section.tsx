"use client";

import { Capsule } from "@/components/ui/capsule";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useLanguage } from "@/hooks/use-language";
import type { Technology } from "@/lib/data-context";

interface TechnologiesSectionProps {
  technologies: Technology[];
}

export function TechnologiesSection({
  technologies,
}: TechnologiesSectionProps) {
  const { t, language } = useLanguage();

  const titleWords = t.technologies.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const leadingWords = titleWords.slice(0, -1).join(" ");

  const getTechName = (tech: Technology) => {
    const translated =
      tech.translations?.[language as keyof typeof tech.translations]?.name;
    return translated && translated.length > 0 ? translated : tech.name;
  };

  return (
    <section
      id="technologies"
      className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]"
    >
      <SectionHeader
        eyebrow="— 03 / Technologies"
        title={
          <>
            {leadingWords}
            {leadingWords && " "}
            <em className="not-italic text-brand-grad">{lastWord}</em>
          </>
        }
        lead={t.technologies.subtitle}
      />

      <div className="mt-12 lg:mt-14">
        <ScrollReveal>
          <div className="flex flex-wrap gap-2.5 max-w-[800px]">
            {technologies.map((tech) => (
              <Capsule
                key={tech.id}
                dot={false}
                icon={<span>{tech.icon}</span>}
              >
                {getTechName(tech)}
              </Capsule>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
