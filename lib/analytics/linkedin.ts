// LinkedIn Campaign Manager account 515845001 (Capsule Codes).
export const PARTNER_ID = "10790593";

/** Conversion "Contacto": a visitor sent the contact form. */
export const CONTACT_CONVERSION_ID = 30718089;

declare global {
  interface Window {
    lintrk?: (action: "track", data: { conversion_id: number }) => void;
  }
}

/**
 * Reports a conversion to LinkedIn.
 *
 * The Insight Tag only renders in production, so outside it there is no
 * `lintrk` to call and this is a no-op — the same reason local traffic never
 * reaches the Campaign Manager reports. In production the tag defines its
 * queueing stub before insight.min.js lands, so a call made early is held and
 * replayed rather than dropped.
 */
export function trackLinkedInConversion(conversionId: number) {
  if (typeof window === "undefined" || typeof window.lintrk !== "function") {
    return;
  }

  window.lintrk("track", { conversion_id: conversionId });
}
