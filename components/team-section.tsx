"use client";
import { useLanguage } from "@/hooks/use-language";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { TeamMember } from "@/lib/data-context";

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

export function TeamSection({ teamMembers }: TeamSectionProps) {
  const { t, language } = useLanguage();

  const cofounders = teamMembers.filter((m) => m.category === "cofounder");
  const developers = teamMembers.filter((m) => m.category === "developer");

  const tr = (m: TeamMember) => m.translations?.[language] ?? m.translations.en;

  return (
    <section id="team" className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="— 04 / Team"
          title={<>{t.team.title.firstPart} <em className="not-italic text-brand-grad">{t.team.title.secondPart}</em></>}
          lead={t.team.subtitle}
        />

        <div className="mt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-4">— {t.team.coFoundersTitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cofounders.map((m, i) => {
              const c = tr(m);
              return (
                <ScrollReveal key={m.id} delay={i * 0.08}>
                  <MemberCard name={c.name} role={c.role} description={c.description} avatarUrl={m.avatar} />
                </ScrollReveal>
              );
            })}
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mt-9 mb-4">— {t.team.developersTitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {developers.map((m, i) => {
              const c = tr(m);
              return (
                <ScrollReveal key={m.id} delay={i * 0.08}>
                  <MemberCard name={c.name} role={c.role} description={c.description} avatarUrl={m.avatar} />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberCard({ name, role, description, avatarUrl }: { name: string; role: string; description: string; avatarUrl: string | null }) {
  return (
    <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6">
      <div className="flex items-center gap-3.5 mb-3.5">
        <div className="size-[52px] rounded-full shrink-0 bg-gradient-to-br from-[oklch(0.4_0.15_180)] to-[oklch(0.5_0.18_155)] shadow-[0_0_16px_oklch(0.5_0.15_180_/_0.3)] overflow-hidden">
          {avatarUrl && <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />}
        </div>
        <div>
          <h5 className="text-[15px] font-semibold leading-tight">{name}</h5>
          <span className="font-mono text-[10px] text-[color:var(--brand-cyan)] tracking-[0.04em]">{role}</span>
        </div>
      </div>
      <p className="text-[12.5px] text-[color:var(--ink-muted)] leading-[1.55]">{description}</p>
    </div>
  );
}
