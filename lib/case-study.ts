/**
 * Case study stored in the nullable jsonb column `projects.case_study`.
 * The shape is fixed: content is authored outside the app in exactly this form.
 */
export type CaseStudyLang = "en" | "es" | "it";

export interface CaseStudyHighlight {
  title: string;
  body: string;
}

export interface CaseStudyLocale {
  /** Short localized subtitle (replaces the English-only `subtitle` column). */
  subtitle: string;
  /** 2–3 sentence lead. */
  summary: string;
  /** Markdown, 1–3 paragraphs. */
  challenge: string;
  /** Markdown, 1–3 paragraphs. */
  solution: string;
  /** 3–5 key technical/product decisions. */
  highlights: CaseStudyHighlight[];
  /** Markdown, honest outcomes. */
  results: string;
}

export interface CaseStudyLinks {
  web?: string;
  appStore?: string;
  googlePlay?: string;
}

export interface CaseStudyMeta {
  client: string;
  industry: string;
  year: number;
  countries: string[];
  platforms: string[];
  role: string;
  links?: CaseStudyLinks;
}

export interface CaseStudy {
  meta: CaseStudyMeta;
  en: CaseStudyLocale;
  es: CaseStudyLocale;
  it: CaseStudyLocale;
}

type Result<T> = { value: T; error?: undefined } | { value?: undefined; error: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

const LINK_KEYS = ["web", "appStore", "googlePlay"] as const;

function isSafeUrl(v: unknown): v is string {
  return typeof v === "string" && /^https?:\/\/\S+$/i.test(v.trim());
}

function readStrings(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  return v.filter(isText).map((s) => s.trim());
}

function readMeta(v: unknown): Result<CaseStudyMeta> {
  if (!isRecord(v)) return { error: "meta: missing or not an object" };
  for (const key of ["client", "industry", "role"] as const) {
    if (!isText(v[key])) return { error: `meta.${key}: required non-empty string` };
  }
  if (typeof v.year !== "number" || !Number.isInteger(v.year)) {
    return { error: "meta.year: required integer" };
  }
  const countries = readStrings(v.countries);
  if (!countries) return { error: "meta.countries: required array of strings" };
  const platforms = readStrings(v.platforms);
  if (!platforms) return { error: "meta.platforms: required array of strings" };

  const meta: CaseStudyMeta = {
    client: (v.client as string).trim(),
    industry: (v.industry as string).trim(),
    year: v.year,
    countries,
    platforms,
    role: (v.role as string).trim(),
  };
  if (isRecord(v.links)) {
    const links: CaseStudyLinks = {};
    for (const key of LINK_KEYS) {
      const url = v.links[key];
      if (isSafeUrl(url)) links[key] = url.trim();
    }
    if (Object.keys(links).length > 0) meta.links = links;
  }
  return { value: meta };
}

function readLocale(v: unknown, lang: CaseStudyLang): Result<CaseStudyLocale> {
  if (!isRecord(v)) return { error: `${lang}: missing or not an object` };
  for (const key of ["subtitle", "summary", "challenge", "solution", "results"] as const) {
    if (!isText(v[key])) return { error: `${lang}.${key}: required non-empty string` };
  }
  if (!Array.isArray(v.highlights)) return { error: `${lang}.highlights: required array` };
  const highlights = v.highlights
    .filter((h): h is Record<string, unknown> => isRecord(h) && isText(h.title) && isText(h.body))
    .map((h) => ({ title: (h.title as string).trim(), body: (h.body as string).trim() }));
  return {
    value: {
      subtitle: (v.subtitle as string).trim(),
      summary: (v.summary as string).trim(),
      challenge: (v.challenge as string).trim(),
      solution: (v.solution as string).trim(),
      highlights,
      results: (v.results as string).trim(),
    },
  };
}

function readCaseStudy(input: unknown): Result<CaseStudy> {
  let raw = input;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return { error: "not valid JSON" };
    }
  }
  if (!isRecord(raw)) return { error: "case study must be a JSON object" };
  const meta = readMeta(raw.meta);
  if (meta.error !== undefined) return { error: meta.error };
  const en = readLocale(raw.en, "en");
  if (en.error !== undefined) return { error: en.error };
  // es/it are optional: a missing or invalid locale falls back to English.
  const es = readLocale(raw.es, "es").value ?? en.value;
  const it = readLocale(raw.it, "it").value ?? en.value;
  return { value: { meta: meta.value, en: en.value, es, it } };
}

/** Tolerant validator: missing/invalid es or it fall back to en; anything else invalid is null. */
export function parseCaseStudy(input: unknown): CaseStudy | null {
  return readCaseStudy(input).value ?? null;
}

export function getCaseStudyLocale(
  caseStudy: CaseStudy | null | undefined,
  lang: CaseStudyLang,
): CaseStudyLocale | null {
  return caseStudy ? caseStudy[lang] : null;
}

/** Admin editor validation: blank text clears the case study (null). */
export function validateCaseStudyJson(
  text: string,
): { ok: true; value: CaseStudy | null } | { ok: false; error: string } {
  if (!text.trim()) return { ok: true, value: null };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}` };
  }
  const result = readCaseStudy(raw);
  if (result.error !== undefined) return { ok: false, error: result.error };
  return { ok: true, value: result.value };
}
