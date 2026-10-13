import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_LOCALE,
  LOCALES,
  alternateUrls,
  isHomePath,
  isLocale,
  resolveRequestLocale,
  localePath,
  resolveLocaleRoute,
  splitLocale,
  twinPath,
} from "./locale.ts";

test("locales: english is the default and the only unprefixed one", () => {
  assert.deepEqual([...LOCALES], ["en", "es", "it"]);
  assert.equal(DEFAULT_LOCALE, "en");
  assert.equal(isLocale("es"), true);
  assert.equal(isLocale("xx"), false);
  assert.equal(isLocale(undefined), false);
});

test("localePath leaves english unprefixed and prefixes es/it", () => {
  assert.equal(localePath("en", "/projects"), "/projects");
  assert.equal(localePath("es", "/projects"), "/es/projects");
  assert.equal(localePath("it", "/projects/abc"), "/it/projects/abc");
});

test("localePath maps the root to the bare prefix and keeps hash and query", () => {
  assert.equal(localePath("en", "/"), "/");
  assert.equal(localePath("es", "/"), "/es");
  assert.equal(localePath("it", "/#about"), "/it#about");
  assert.equal(localePath("en", "/#about"), "/#about");
  assert.equal(localePath("es", "/projects?x=1"), "/es/projects?x=1");
});

test("splitLocale separates an explicit prefix from the page path", () => {
  assert.deepEqual(splitLocale("/"), { locale: null, path: "/" });
  assert.deepEqual(splitLocale("/projects/a"), { locale: null, path: "/projects/a" });
  assert.deepEqual(splitLocale("/es"), { locale: "es", path: "/" });
  assert.deepEqual(splitLocale("/es/"), { locale: "es", path: "/" });
  assert.deepEqual(splitLocale("/it/projects/a"), { locale: "it", path: "/projects/a" });
  assert.deepEqual(splitLocale("/en/privacy"), { locale: "en", path: "/privacy" });
});

test("splitLocale does not mistake words that start with a locale", () => {
  assert.deepEqual(splitLocale("/essays"), { locale: null, path: "/essays" });
  assert.deepEqual(splitLocale("/italy"), { locale: null, path: "/italy" });
});

test("twinPath keeps the page and switches the language", () => {
  assert.equal(twinPath("/", "es"), "/es");
  assert.equal(twinPath("/es", "en"), "/");
  assert.equal(twinPath("/es/projects/abc", "it"), "/it/projects/abc");
  assert.equal(twinPath("/it/privacy", "en"), "/privacy");
  assert.equal(twinPath("/projects", "es"), "/es/projects");
  // the internal rewrite target must not leak into links
  assert.equal(twinPath("/en/projects", "it"), "/it/projects");
});

test("alternateUrls builds absolute hreflang urls with x-default on english", () => {
  assert.deepEqual(alternateUrls("/projects"), {
    en: "https://www.capsulecodes.com/projects",
    es: "https://www.capsulecodes.com/es/projects",
    it: "https://www.capsulecodes.com/it/projects",
    "x-default": "https://www.capsulecodes.com/projects",
  });
  assert.equal(alternateUrls("/").es, "https://www.capsulecodes.com/es");
  assert.equal(alternateUrls("/")["x-default"], "https://www.capsulecodes.com");
});

test("resolveLocaleRoute rewrites unprefixed public paths to the internal en segment", () => {
  assert.deepEqual(resolveLocaleRoute("/"), { action: "rewrite", to: "/en", locale: "en" });
  assert.deepEqual(resolveLocaleRoute("/projects"), { action: "rewrite", to: "/en/projects", locale: "en" });
  assert.deepEqual(resolveLocaleRoute("/projects/a"), { action: "rewrite", to: "/en/projects/a", locale: "en" });
  assert.deepEqual(resolveLocaleRoute("/privacy"), { action: "rewrite", to: "/en/privacy", locale: "en" });
});

test("resolveLocaleRoute lets es/it through", () => {
  assert.deepEqual(resolveLocaleRoute("/es"), { action: "next", locale: "es" });
  assert.deepEqual(resolveLocaleRoute("/it/projects/a"), { action: "next", locale: "it" });
});

test("resolveLocaleRoute redirects the internal en prefix to the canonical path", () => {
  assert.deepEqual(resolveLocaleRoute("/en"), { action: "redirect", to: "/", locale: "en" });
  assert.deepEqual(resolveLocaleRoute("/en/"), { action: "redirect", to: "/", locale: "en" });
  assert.deepEqual(resolveLocaleRoute("/en/projects/a"), { action: "redirect", to: "/projects/a", locale: "en" });
});

test("resolveLocaleRoute never touches admin, api, next internals or files", () => {
  for (const p of ["/admin", "/admin/projects", "/api/contact", "/api/admin/session", "/_next/static/x.js", "/logo.svg", "/sitemap.xml", "/robots.txt"]) {
    assert.deepEqual(resolveLocaleRoute(p), { action: "next", locale: "en" }, p);
  }
});

test("resolveLocaleRoute only exempts admin/api as whole segments", () => {
  assert.deepEqual(resolveLocaleRoute("/administrators"), { action: "rewrite", to: "/en/administrators", locale: "en" });
  assert.deepEqual(resolveLocaleRoute("/apiary"), { action: "rewrite", to: "/en/apiary", locale: "en" });
});

test("an unknown prefix is rewritten under en, where no route matches (404)", () => {
  assert.deepEqual(resolveLocaleRoute("/xx/projects"), { action: "rewrite", to: "/en/xx/projects", locale: "en" });
});

test("isHomePath is true for the home of every locale", () => {
  for (const p of ["/", "/es", "/es/", "/it", "/en"]) assert.equal(isHomePath(p), true, p);
  for (const p of ["/projects", "/es/projects", "/it/privacy"]) assert.equal(isHomePath(p), false, p);
});

test("resolveRequestLocale trusts only known locales and defaults to english", () => {
  assert.equal(resolveRequestLocale("es"), "es");
  assert.equal(resolveRequestLocale("it"), "it");
  assert.equal(resolveRequestLocale("xx"), "en");
  assert.equal(resolveRequestLocale(null), "en");
  assert.equal(resolveRequestLocale(undefined), "en");
});
