/**
 * Cookie consent state. Pure helpers: the banner and the tag loader live in
 * components, this module only knows how to write, read and validate the choice.
 */

export type ConsentChoice = "accepted" | "rejected";

export interface ConsentRecord {
  version: number;
  choice: ConsentChoice;
  /** ISO 8601 time of the choice. */
  timestamp: string;
}

export const CONSENT_COOKIE = "cc_consent";

/** Bump when the purposes change: everybody is asked again. */
export const CONSENT_VERSION = 1;

/** Six months, the usual re-ask horizon. */
export const CONSENT_MAX_AGE_SECONDS = 182 * 24 * 60 * 60;

export function serializeConsent(choice: ConsentChoice, now: Date): string {
  return JSON.stringify({ v: CONSENT_VERSION, choice, ts: now.toISOString() });
}

/** Parses a stored value; anything unrecognised or from another version is "undecided". */
export function parseConsent(raw: string | null | undefined): ConsentRecord | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const { v, choice, ts } = data as Record<string, unknown>;
  if (v !== CONSENT_VERSION) return null;
  if (choice !== "accepted" && choice !== "rejected") return null;
  if (typeof ts !== "string" || Number.isNaN(new Date(ts).getTime())) return null;
  return { version: v, choice, timestamp: ts };
}

/** The `document.cookie` assignment that stores a choice (first-party, site-wide). */
export function consentCookie(
  choice: ConsentChoice,
  now: Date,
  options: { secure?: boolean } = {},
): string {
  const value = encodeURIComponent(serializeConsent(choice, now));
  return (
    `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax` +
    (options.secure ? "; Secure" : "")
  );
}

function cookiePairs(cookieHeader: string): [name: string, value: string][] {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const i = part.indexOf("=");
      return i === -1 ? [part, ""] : [part.slice(0, i), part.slice(i + 1)];
    });
}

/** Reads the stored choice from a `document.cookie` string. */
export function readConsent(cookieHeader: string): ConsentRecord | null {
  const found = cookiePairs(cookieHeader).find(([name]) => name === CONSENT_COOKIE);
  if (!found) return null;
  try {
    return parseConsent(decodeURIComponent(found[1]));
  } catch {
    return null;
  }
}

const LINKEDIN_COOKIES = new Set(["bcookie", "bscookie", "lidc", "UserMatchHistory", "AnalyticsSyncHistory"]);

/**
 * LinkedIn cookies visible to the page (those on our own domain, such as
 * `li_fat_id`). The ones LinkedIn sets on linkedin.com are not reachable from here.
 */
export function linkedinCookieNames(cookieHeader: string): string[] {
  return cookiePairs(cookieHeader)
    .map(([name]) => name)
    .filter((name) => name.startsWith("li_") || LINKEDIN_COOKIES.has(name));
}

/** `document.cookie` assignments that expire a cookie on the host and its parent domain. */
export function clearCookieStrings(name: string, hostname: string): string[] {
  const expire = "=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const out = [`${name}${expire}`];
  const labels = hostname.split(".");
  const isIp = /^\d+(\.\d+){3}$/.test(hostname);
  if (labels.length >= 2 && !isIp) {
    out.push(`${name}${expire}; Domain=${hostname}`);
    out.push(`${name}${expire}; Domain=.${labels.slice(-2).join(".")}`);
  }
  return out;
}
