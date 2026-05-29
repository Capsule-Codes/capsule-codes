"use client";
import { Capsule } from "@/components/ui/capsule";
import { ParallaxConstellation } from "@/components/motion/parallax-constellation";
import { Magnetic } from "@/components/motion/magnetic";
import { useLanguage } from "@/hooks/use-language";
import { Zap, ArrowRight } from "lucide-react";

export function HeroSection() {
  const { t } = useLanguage();
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden">
      {/* atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,oklch(0.45_0.22_185_/_0.45),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_30%_80%,oklch(0.4_0.2_155_/_0.3),transparent_70%)]" />
        <div className="absolute inset-0 [background-image:radial-gradient(oklch(1_0_0_/_0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      </div>

      {/* constellation — 6 on md+, 2 on mobile */}
      <ParallaxConstellation className="absolute inset-0 pointer-events-none">
        <Capsule size="sm" className="absolute top-[18%] left-[8%] rotate-[-6deg] animate-capsule-drift opacity-90">web platforms</Capsule>
        <Capsule size="sm" className="absolute top-[14%] right-[12%] rotate-[5deg] animate-capsule-drift opacity-90" style={{ animationDelay: "1s" }}>mobile apps</Capsule>
        {/* the remaining 4 are hidden on mobile */}
        <Capsule size="sm" className="absolute top-[70%] left-[6%] rotate-[2deg] opacity-60 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "2s" }}>fintech</Capsule>
        <Capsule size="sm" className="absolute top-[75%] right-[9%] rotate-[-4deg] opacity-60 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "3s" }}>edtech</Capsule>
        <Capsule size="sm" dot={false} className="absolute top-[42%] left-[14%] rotate-[3deg] opacity-30 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "1.5s" }}>react native</Capsule>
        <Capsule size="sm" dot={false} className="absolute top-[38%] right-[16%] rotate-[-3deg] opacity-30 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "2.5s" }}>next.js</Capsule>
      </ParallaxConstellation>

      <div className="container mx-auto px-4 lg:px-12 py-[100px] lg:py-[120px] text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <Capsule icon={<Zap className="w-3 h-3" />} className="mb-7">{t.hero.badge}</Capsule>

          <h1 className="font-sans text-4xl md:text-6xl lg:text-[60px] leading-[1.02] font-semibold tracking-[-0.045em] mb-6 text-balance max-w-[920px] mx-auto">
            {t.hero.title.firstCommonText}{" "}
            <em className="not-italic text-brand-grad">{t.hero.title.firstKeyword}</em>{" "}
            {t.hero.title.secondCommonText}{" "}
            <em className="not-italic text-brand-grad">{t.hero.title.secondKeyword}</em>{" "}
            {t.hero.title.thirdCommonText}{" "}
            <em className="not-italic text-brand-grad">{t.hero.title.thirdKeyword}</em>
          </h1>

          <p className="text-base md:text-lg text-[color:var(--ink-muted)] mb-10 max-w-[620px] mx-auto text-pretty leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* stats pill bar */}
          <div className="inline-flex items-stretch gap-2 mb-10 p-2 bg-white/[0.03] border border-[color:var(--ink-line)] rounded-full backdrop-blur-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-[color:var(--ink-muted)]"><span className="font-mono font-semibold text-[color:var(--ink-fg)]">10+</span> {t.hero.stats.projects}</div>
            <div className="w-px self-center h-4 bg-[color:var(--ink-line)]" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-[color:var(--ink-muted)]"><span className="font-mono font-semibold text-[color:var(--ink-fg)]">8</span> {t.hero.stats.countries}</div>
            <div className="w-px self-center h-4 bg-[color:var(--ink-line)]" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-[color:var(--ink-muted)]"><span className="font-mono font-semibold text-[color:var(--ink-fg)]">2</span> {t.hero.stats.apps}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Magnetic>
              <button onClick={() => scroll("projects")} className="brand-grad text-black rounded-full px-6 py-3 text-sm font-semibold shadow-[0_6px_22px_oklch(0.5_0.16_180_/_0.4)] inline-flex items-center gap-2">
                {t.hero.cta.viewProjects} <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => scroll("contact")} className="bg-white/[0.05] text-[color:var(--ink-fg)] border border-white/[0.1] rounded-full px-6 py-3 text-sm font-medium inline-flex items-center gap-2">
                {t.hero.cta.contact}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
