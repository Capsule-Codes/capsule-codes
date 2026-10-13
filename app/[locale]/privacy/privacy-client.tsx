"use client"

import { useConsent } from "@/hooks/use-consent";
import { useLanguage, useLocalePath } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PrivacyPolicyClient() {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const { openSettings } = useConsent();
  const content = t.legal.privacyPolicy;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href={localePath("/")}>
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
          <h2 className="text-2xl font-semibold mb-4">1. {content.headings[0]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.introduction}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. {content.headings[1]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.dataCollection}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. {content.headings[2]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.dataUsage}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. {content.headings[3]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.dataProtection}
          </p>
        </section>

        <section id="cookies" className="scroll-mt-28">
          <h2 className="text-2xl font-semibold mb-4">5. {content.headings[4]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.cookies}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={openSettings}
          >
            {t.consent.settings}
          </Button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. {content.headings[5]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.thirdParty}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. {content.headings[6]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.rights}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. {content.headings[7]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.changes}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. {content.headings[8]}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.sections.contact}
          </p>
        </section>
      </div>
    </div>
  );
}
