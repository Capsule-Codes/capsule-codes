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

      <ScrollReveal>
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-5">
              {t.about.mission.title}
            </h3>
            <p className="text-[15px] leading-[1.65] text-[color:var(--ink-muted)] mb-4">
              {t.about.mission.paragraph1}
            </p>
            <p className="text-[15px] leading-[1.65] text-[color:var(--ink-muted)] mb-4">
              {t.about.mission.paragraph2}
            </p>
            <p className="text-[15px] leading-[1.65] text-[color:var(--ink-muted)] mb-4">
              {t.about.mission.paragraph3}
            </p>
          </div>

          <div
            className="relative aspect-square rounded-3xl overflow-hidden border border-[color:var(--ink-line)] flex items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, oklch(0.45 0.2 180 / 0.4), transparent 70%), var(--ink-bg-2)",
            }}
          >
            <div
              className="inset-[-20%] absolute pointer-events-none animate-conic-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, oklch(0.5 0.15 180 / 0.3), transparent, oklch(0.5 0.18 150 / 0.3), transparent)",
              }}
            />
            <div className="relative z-[2] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[oklch(0.5_0.18_180)] to-[oklch(0.45_0.16_150)] shadow-[0_0_40px_oklch(0.55_0.18_180_/_0.5),0_1px_0_oklch(1_0_0_/_0.2)_inset] flex items-center justify-center text-4xl">
              🐉
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {values.map((value, index) => (
          <ScrollReveal key={value.title} delay={index * 0.08}>
            <div className="relative overflow-hidden bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6">
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
    </section>
  );
}
