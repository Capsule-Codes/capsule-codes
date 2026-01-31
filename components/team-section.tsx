"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";

export function TeamSection() {
  const { t } = useLanguage();

  const coFounders = [
    {
      name: t.team.coFounders.miguel.name,
      role: t.team.coFounders.miguel.role,
      description: t.team.coFounders.miguel.description,
      image: "/images/team/placeholder-1.jpg",
    },
    {
      name: t.team.coFounders.facundo.name,
      role: t.team.coFounders.facundo.role,
      description: t.team.coFounders.facundo.description,
      image: "/images/team/placeholder-2.jpg",
    },
  ];

  const developers = [
    {
      name: t.team.developers.marco.name,
      role: t.team.developers.marco.role,
      description: t.team.developers.marco.description,
      image: "/images/team/placeholder-3.jpg",
    },
    {
      name: t.team.developers.lucas.name,
      role: t.team.developers.lucas.role,
      description: t.team.developers.lucas.description,
      image: "/images/team/placeholder-4.jpg",
    },
    {
      name: t.team.developers.juan.name,
      role: t.team.developers.juan.role,
      description: t.team.developers.juan.description,
      image: "/images/team/placeholder-5.jpg",
    },
  ];

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
            {coFounders.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="text-5xl">👤</div>
                    {/* <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>

                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t.team.developersTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-accent to-primary" />
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl">👤</div>
                    {/* <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
