import Script from "next/script";

// LinkedIn Campaign Manager account 515845001 (Capsule Codes).
const PARTNER_ID = "10790593";

/**
 * LinkedIn Insight Tag. Renders only in production so local and test traffic
 * stays out of the Campaign Manager reports.
 */
export function LinkedInInsightTag() {
  if (process.env.NODE_ENV !== "production") return null;

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
      {/*
        Written as raw HTML on purpose. Rendered as a React <img>, Next hoists a
        <link rel="preload" as="image"> for it into <head>, and the browser then
        fetches the no-JS fallback for every visitor — including the ones the JS
        tag already counted. One install, two page views per load.
      */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" alt="" src="https://px.ads.linkedin.com/collect/?pid=${PARTNER_ID}&fmt=gif" />`,
        }}
      />
    </>
  );
}
