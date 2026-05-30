"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useLanguage } from "@/hooks/use-language";

export function AboutSection() {
  const { t } = useLanguage();

  const titleWords = t.about.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const leadingWords = titleWords.slice(0, -1).join(" ");

  const values = [
    {
      title: t.about.values.precision.title,
      description: t.about.values.precision.description,
    },
    {
      title: t.about.values.innovation.title,
      description: t.about.values.innovation.description,
    },
    {
      title: t.about.values.speed.title,
      description: t.about.values.speed.description,
    },
    {
      title: t.about.values.collaboration.title,
      description: t.about.values.collaboration.description,
    },
  ];

  return (
    <section
      id="about"
      className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]"
    >
      <SectionHeader
        eyebrow="— 01 / About"
        title={
          <>
            {leadingWords}
            {leadingWords && " "}
            <em className="not-italic text-brand-grad">{lastWord}</em>
          </>
        }
        lead={t.about.subtitle}
      />

      <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-14 lg:items-start">
        <ScrollReveal>
          <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-5">
            {t.about.mission.title}
          </h3>
          <p className="text-[15px] leading-[1.65] text-[color:var(--ink-muted)] mb-4">
            {t.about.mission.paragraph1}
          </p>
          <p className="text-[15px] leading-[1.65] text-[color:var(--ink-muted)] mb-4">
            {t.about.mission.paragraph2}
          </p>
          <p className="text-[15px] leading-[1.65] text-[color:var(--ink-muted)]">
            {t.about.mission.paragraph3}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((value, index) => (
            <ScrollReveal key={value.title} delay={index * 0.08}>
              <div className="relative h-full overflow-hidden bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[radial-gradient(circle,oklch(0.5_0.15_180_/_0.2),transparent_70%)] blur-2xl pointer-events-none" />
                <div className="relative z-[2] w-9 h-9 rounded-xl bg-gradient-to-b from-[oklch(0.3_0.08_180)] to-[oklch(0.2_0.05_170)] border border-[color:oklch(0.5_0.12_180_/_0.5)] mb-4 flex items-center justify-center shadow-[0_0_16px_oklch(0.5_0.15_180_/_0.2)]">
                  <div className="w-[14px] h-[14px] rounded-[4px] brand-grad" />
                </div>
                <h4 className="relative z-[2] text-[15px] font-semibold tracking-[-0.01em] mb-2">
                  {value.title}
                </h4>
                <p className="relative z-[2] text-[12.5px] leading-[1.55] text-[color:var(--ink-muted)]">
                  {value.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
