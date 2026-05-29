"use client";

import { useLanguage } from "@/hooks/use-language";

export function TeamSection() {
  const { t } = useLanguage();
  return (
    <section id="team" className="py-20 scroll-mt-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.team.title.firstPart} {t.team.title.secondPart}</h2>
        <p className="text-muted-foreground">team rendering migrated to Supabase — wired in Task 15</p>
      </div>
    </section>
  );
}
