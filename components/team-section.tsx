"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import type { TeamMember } from "@/lib/data-context";
import Image from "next/image";

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

export function TeamSection({ teamMembers }: TeamSectionProps) {
  const { t, language } = useLanguage();

  const coFounders = teamMembers
    .filter((member) => member.category === "cofounder" && member.published)
    .sort((a, b) => a.order - b.order);

  const developers = teamMembers
    .filter((member) => member.category === "developer" && member.published)
    .sort((a, b) => a.order - b.order);

  const getMemberContent = (member: TeamMember) => {
    const translation =
      member.translations[language as keyof typeof member.translations];
    return {
      name: translation?.name || member.translations.en.name,
      role: translation?.role || member.translations.en.role,
      description:
        translation?.description || member.translations.en.description,
    };
  };

  return (
    <section id="team" className="py-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.team.title.firstPart}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.team.title.secondPart}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t.team.subtitle}
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t.team.coFoundersTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coFounders.map((member) => {
              const content = getMemberContent(member);
              return (
                <Card
                  key={member.id}
                  className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                  <CardContent className="p-6">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={content.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-5xl">👤</div>
                      )}
                    </div>

                    <div className="text-center">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {content.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium mb-4">
                        {content.role}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {content.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t.team.developersTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((member) => {
              const content = getMemberContent(member);
              return (
                <Card
                  key={member.id}
                  className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-accent to-primary" />
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {member.avatar ? (
                        <Image
                          src={member.avatar}
                          alt={content.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">👤</div>
                      )}
                    </div>

                    <div className="text-center">
                      <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {content.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium mb-4">
                        {content.role}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {content.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
