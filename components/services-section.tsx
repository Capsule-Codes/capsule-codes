"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Smartphone, Database, Cloud, Palette, Cog } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function ServicesSection() {
  const { t } = useLanguage()

  const services = [
    {
      icon: <Globe className="w-12 h-12 text-primary" />,
      title: t.services.web.title,
      description: t.services.web.description,
      features: t.services.web.features,
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: <Smartphone className="w-12 h-12 text-secondary" />,
      title: t.services.mobile.title,
      description: t.services.mobile.description,
      features: t.services.mobile.features,
      color: "from-secondary/20 to-secondary/5",
    },
    {
      icon: <Database className="w-12 h-12 text-accent" />,
      title: t.services.backend.title,
      description: t.services.backend.description,
      features: t.services.backend.features,
      color: "from-accent/20 to-accent/5",
    },
    {
      icon: <Cloud className="w-12 h-12 text-primary" />,
      title: t.services.cloud.title,
      description: t.services.cloud.description,
      features: t.services.cloud.features,
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: <Palette className="w-12 h-12 text-secondary" />,
      title: t.services.design.title,
      description: t.services.design.description,
      features: t.services.design.features,
      color: "from-secondary/20 to-secondary/5",
    },
    {
      icon: <Cog className="w-12 h-12 text-accent" />,
      title: t.services.consulting.title,
      description: t.services.consulting.description,
      features: t.services.consulting.features,
      color: "from-accent/20 to-accent/5",
    },
  ]

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.services.title.split(" ")[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.services.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{t.services.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 bg-transparent"
                  onClick={() => {
                    const contactElement = document.querySelector("#contact")
                    if (contactElement) {
                      contactElement.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {t.services.learnMore}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
