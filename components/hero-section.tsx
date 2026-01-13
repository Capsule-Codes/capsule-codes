"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Code, Smartphone } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-12 h-12 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-primary/10 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mt-12 mb-8">
            <Zap className="w-4 h-4 mr-2" />
            {t.hero.badge}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            {t.hero.title.transform}{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t.hero.title.ideas}
            </span>{" "}
            {t.hero.title.into}{" "}
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              {t.hero.title.reality}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            {t.hero.subtitle}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <Code className="w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-muted-foreground">{t.hero.stats.projects}</div>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-8 h-8 text-secondary mb-2" />
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-muted-foreground">{t.hero.stats.satisfaction}</div>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-accent mb-2" />
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-muted-foreground">{t.hero.stats.support}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.hero.cta.viewProjects}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
