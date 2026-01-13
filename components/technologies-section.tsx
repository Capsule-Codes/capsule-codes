"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import type { Technology } from "@/lib/data-context"

interface TechnologiesSectionProps {
  technologies?: Technology[]
}

export function TechnologiesSection({ technologies: technologiesProp }: TechnologiesSectionProps = {}) {
  const { t } = useLanguage()
  const technologies = technologiesProp || []

  // Group technologies by category
  const groupedTechnologies = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    },
    {} as Record<string, typeof technologies>,
  )

  const categoryColors = {
    frontend: "from-primary to-primary/70",
    mobile: "from-secondary to-secondary/70",
    backend: "from-accent to-accent/70",
    database: "from-primary/80 to-secondary/80",
    deployment: "from-secondary/80 to-accent/80",
  }

  const categoryOrder = ["frontend", "mobile", "backend", "database", "deployment"]

  return (
    <section id="technologies" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.technologies.title.split(" ")[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.technologies.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{t.technologies.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categoryOrder.map((categoryKey) => {
            const categoryTechs = groupedTechnologies[categoryKey] || []
            if (categoryTechs.length === 0) return null

            return (
              <Card
                key={categoryKey}
                className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors duration-300"
              >
                <div className={`h-1 bg-gradient-to-r ${categoryColors[categoryKey as keyof typeof categoryColors]}`} />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-center capitalize">
                    {t.technologies.categories[categoryKey as keyof typeof t.technologies.categories]}
                  </h3>
                  <div className="space-y-4">
                    {categoryTechs.map((tech) => (
                      <div
                        key={tech.id}
                        className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200"
                      >
                        <span className="text-2xl mr-3">{tech.icon}</span>
                        <span className="font-medium">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
