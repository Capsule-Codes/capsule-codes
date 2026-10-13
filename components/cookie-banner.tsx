"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/hooks/use-consent";
import { useLanguage, useLocalePath } from "@/hooks/use-language";

// One style for both choices, visible as buttons on the dark surface.
const CHOICE_BUTTON =
  "h-10 border-[color:var(--ink-line-strong)] bg-[color:var(--hover-bg-strong)] text-foreground hover:bg-[color:var(--hover-bg)] dark:border-[color:var(--ink-line-strong)] dark:bg-[color:var(--hover-bg-strong)] dark:hover:bg-[color:var(--hover-bg)]";

/**
 * Consent banner. Accept and Reject are the same component with the same size
 * and weight, side by side: neither is nudged over the other.
 */
export function CookieBanner() {
  const { bannerOpen, accept, reject } = useConsent();
  const { t } = useLanguage();
  const localePath = useLocalePath();

  if (!bannerOpen) return null;

  return (
    <section
      aria-label={t.consent.regionLabel}
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-[color:var(--ink-line-strong)] bg-[color:var(--ink-bg-2)] p-4 shadow-[0_12px_40px_oklch(0_0_0_/_0.45)] sm:inset-x-6 sm:bottom-6 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)]">
            — {t.consent.title}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--ink-muted)]">
            {t.consent.body}{" "}
            <Link
              href={`${localePath("/privacy")}#cookies`}
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              {t.consent.privacyLink}
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:w-64 sm:shrink-0">
          <Button type="button" variant="outline" className={CHOICE_BUTTON} onClick={reject}>
            {t.consent.reject}
          </Button>
          <Button type="button" variant="outline" className={CHOICE_BUTTON} onClick={accept}>
            {t.consent.accept}
          </Button>
        </div>
      </div>
    </section>
  );
}
