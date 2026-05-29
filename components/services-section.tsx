"use client";

import { Capsule } from "@/components/ui/capsule";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { useLanguage } from "@/hooks/use-language";

const SERVICE_KEYS = [
  "web",
  "mobile",
  "backend",
  "cloud",
  "design",
  "consulting",
] as const;

type ServiceKey = (typeof SERVICE_KEYS)[number];

export function ServicesSection() {
  const { t } = useLanguage();

  const titleWords = t.services.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const leadingWords = titleWords.slice(0, -1).join(" ");

  return (
    <section
      id="services"
      className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]"
    >
      <SectionHeader
        eyebrow="— 02 / Services"
        title={
          <>
            {leadingWords}
            {leadingWords && " "}
            <em className="not-italic text-brand-grad">{lastWord}</em>
          </>
        }
        lead={t.services.subtitle}
      />

      <div className="mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICE_KEYS.map((key: ServiceKey, index) => {
          const service = t.services[key];
          const features = service.features as string[];

          return (
            <ScrollReveal key={key} delay={index * 0.06}>
              <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-7 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--brand-cyan)]/40">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[oklch(0.3_0.08_180)] to-[oklch(0.2_0.05_170)] border border-[color:oklch(0.5_0.12_180_/_0.5)] mb-[18px] flex items-center justify-center shadow-[0_0_16px_oklch(0.5_0.15_180_/_0.2)]">
                  <div className="w-4 h-4 rounded brand-grad" />
                </div>
                <h4 className="text-base font-semibold tracking-[-0.01em] mb-2">
                  {service.title}
                </h4>
                <p className="text-[13px] leading-[1.5] text-[color:var(--ink-muted)] mb-3.5">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((feature) => (
                    <Capsule size="sm" dot={false} key={feature}>
                      {feature}
                    </Capsule>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
