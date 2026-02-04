"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb, Rocket } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function AboutSection() {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: t.about.values.precision.title,
      description: t.about.values.precision.description,
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-secondary" />,
      title: t.about.values.innovation.title,
      description: t.about.values.innovation.description,
    },
    {
      icon: <Rocket className="w-8 h-8 text-accent" />,
      title: t.about.values.speed.title,
      description: t.about.values.speed.description,
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: t.about.values.collaboration.title,
      description: t.about.values.collaboration.description,
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.about.title.split(" ")[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.about.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6">{t.about.mission.title}</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t.about.mission.paragraph1}
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t.about.mission.paragraph2}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.about.mission.paragraph3}
            </p>
          </div>
          <div className="relative">
            <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center overflow-hidden">
              {/* Dragon */}
              <div className="text-6xl animate-float z-10 relative">🐉</div>

              {/* Code lines coming from dragon */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Line 1 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-code-flow-1">
                  <div className="text-xs font-mono text-primary/80 whitespace-nowrap">
                    const code = {"{"}...{"}"};
                  </div>
                </div>

                {/* Line 2 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-code-flow-2">
                  <div className="text-xs font-mono text-secondary/80 whitespace-nowrap">
                    {"<"}Component {"/>"}
                  </div>
                </div>

                {/* Line 3 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-code-flow-3">
                  <div className="text-xs font-mono text-accent/80 whitespace-nowrap">
                    function() {"{"}...{"}"}
                  </div>
                </div>

                {/* Line 4 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-code-flow-4">
                  <div className="text-xs font-mono text-primary/80 whitespace-nowrap">
                    export default
                  </div>
                </div>

                {/* Line 5 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-code-flow-5">
                  <div className="text-xs font-mono text-secondary/80 whitespace-nowrap">
                    import React
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-colors duration-300"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h4 className="text-xl font-semibold mb-3">{value.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
