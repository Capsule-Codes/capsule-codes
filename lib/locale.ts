import { absoluteUrl } from "./site.ts";

export const LOCALES = ["en", "es", "it"] as const;
export type Locale = (typeof LOCALES)[number];

/** English lives at the root, without a prefix. */
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Request header the middleware uses to tell the root layout the page language. */
export const LOCALE_HEADER = "x-locale";

/** Header value to locale; anything unrecognised (admin, api, 404 pass) is English. */
export function resolveRequestLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Splits "/path?query#hash" into the path and the untouched suffix. */
function splitSuffix(input: string): [path: string, suffix: string] {
  const i = input.search(/[?#]/);
  return i === -1 ? [input, ""] : [input.slice(0, i), input.slice(i)];
}

/**
 * Public URL of a page in a locale. `path` is the unprefixed page path
 * ("/", "/projects/x", "/#about"); English stays unprefixed.
 */
export function localePath(locale: Locale, path: string): string {
  const [pathname, suffix] = splitSuffix(path);
  if (locale === DEFAULT_LOCALE) return `${pathname || "/"}${suffix}`;
  return `/${locale}${pathname === "/" ? "" : pathname}${suffix}`;
}

/** Reads the locale prefix of a pathname; `locale` is null when there is none. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const [first, ...rest] = pathname.split("/").filter(Boolean);
  if (isLocale(first)) {
    return { locale: first, path: rest.length ? `/${rest.join("/")}` : "/" };
  }
  return { locale: null, path: pathname || "/" };
}

/** The same page in another locale, from any pathname (prefixed or not). */
export function twinPath(pathname: string, target: Locale): string {
  return localePath(target, splitLocale(pathname).path);
}

/** Absolute hreflang map for a page path, `x-default` pointing at English. */
export function alternateUrls(path: string): Record<Locale | "x-default", string> {
  const url = (locale: Locale) => absoluteUrl(localePath(locale, path));
  return { en: url("en"), es: url("es"), it: url("it"), "x-default": url("en") };
}

/** `locale` is the language the request is served in (sent to the layout as a header). */
export type LocaleRoute =
  | { action: "next"; locale: Locale }
  | { action: "rewrite"; to: string; locale: Locale }
  | { action: "redirect"; to: string; locale: Locale };

const UNLOCALIZED_SEGMENTS = new Set(["admin", "api", "_next"]);

/**
 * Middleware decision for a pathname:
 * - admin, api, Next internals and files are left alone (served in English);
 * - es/it pass through to `app/[locale]`;
 * - English (no prefix) is rewritten to the internal `/en` segment;
 * - the internal `/en` prefix is never public: redirect to the bare path.
 */
export function resolveLocaleRoute(pathname: string): LocaleRoute {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && UNLOCALIZED_SEGMENTS.has(first)) return { action: "next", locale: DEFAULT_LOCALE };
  if (/\.[^/]+$/.test(pathname)) return { action: "next", locale: DEFAULT_LOCALE };

  const { locale, path } = splitLocale(pathname);
  if (locale === DEFAULT_LOCALE) return { action: "redirect", to: path, locale };
  if (locale) return { action: "next", locale };
  return {
    action: "rewrite",
    to: `/${DEFAULT_LOCALE}${path === "/" ? "" : path}`,
    locale: DEFAULT_LOCALE,
  };
}

/** True on the home page of any locale ("/", "/es", "/it"). */
export function isHomePath(pathname: string): boolean {
  return splitLocale(pathname).path === "/";
}
