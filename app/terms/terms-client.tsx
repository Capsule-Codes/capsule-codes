"use client"

import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function TermsOfServiceClient() {
  const { t } = useLanguage();
  const content = t.legal.termsOfService;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.projects.backToHome}
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {content.title.split(" ")[0]}{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {content.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="text-muted-foreground">{content.lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.introduction}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.services}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.userObligations}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.intellectualProperty}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.payment}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.liability}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.termination}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.changes}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.contact}
          </p>
        </section>
      </div>
    </div>
  );
}
