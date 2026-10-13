"use client";

import Script from "next/script";

import { useConsent } from "@/hooks/use-consent";
import { PARTNER_ID } from "@/lib/analytics/linkedin";

/**
 * LinkedIn Insight Tag. Renders only in production (so local and test traffic
 * stays out of the Campaign Manager reports) and only after the visitor has
 * accepted cookies: nothing is requested from LinkedIn before that, and never
 * after a rejection.
 *
 * There is deliberately no `<noscript>` pixel: without JavaScript nobody can
 * give consent, so that fallback would track visitors who never agreed.
 */
export function LinkedInInsightTag() {
  const { choice } = useConsent();

  if (process.env.NODE_ENV !== "production") return null;
  if (choice !== "accepted") return null;

  return (
    <>
      <Script id="linkedin-insight-init" strategy="afterInteractive">
        {`
          window._linkedin_partner_id = "${PARTNER_ID}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
          if (!window.lintrk) {
            window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
            window.lintrk.q = [];
          }
        `}
      </Script>
      <Script
        id="linkedin-insight"
        strategy="afterInteractive"
        src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
      />
    </>
  );
}
