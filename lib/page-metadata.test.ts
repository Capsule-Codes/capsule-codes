import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLocalizedMetadata, buildPageMetadata } from "./page-metadata.ts";
import { LOCALES } from "./locale.ts";

const ORIGIN = "https://www.capsulecodes.com";

test("home metadata is localized with canonical per locale", () => {
  const en = buildPageMetadata("en", "home");
  const es = buildPageMetadata("es", "home");
  const it = buildPageMetadata("it", "home");
  assert.equal(en.alternates.canonical, ORIGIN);
  assert.equal(es.alternates.canonical, `${ORIGIN}/es`);
  assert.equal(it.alternates.canonical, `${ORIGIN}/it`);
  assert.match(es.title, /Desarrollo/);
  assert.match(it.title, /Sviluppo/);
  assert.notEqual(es.description, en.description);
  assert.notEqual(it.description, en.description);
});

test("every page and locale has hreflang for all locales plus x-default", () => {
  for (const page of ["home", "projects", "privacy", "terms"] as const) {
    for (const locale of LOCALES) {
      const m = buildPageMetadata(locale, page);
      assert.deepEqual(Object.keys(m.alternates.languages), ["en", "es", "it", "x-default"], `${page}/${locale}`);
      assert.equal(m.alternates.languages["x-default"], m.alternates.languages.en);
      assert.ok(m.title.length > 0 && m.description.length > 0);
      assert.equal(m.openGraph.url, m.alternates.canonical);
    }
  }
});

test("open graph carries the locale, its alternates, site name and image", () => {
  const es = buildPageMetadata("es", "projects");
  assert.equal(es.openGraph.locale, "es_ES");
  assert.deepEqual(es.openGraph.alternateLocale, ["en_US", "it_IT"]);
  assert.equal(es.openGraph.siteName, "Capsule Codes");
  assert.equal(es.openGraph.images[0].url, `${ORIGIN}/og-image.png`);
  assert.equal(es.alternates.canonical, `${ORIGIN}/es/projects`);
  assert.equal(buildPageMetadata("en", "projects").openGraph.locale, "en_US");
});

test("buildLocalizedMetadata uses the given title, image and path", () => {
  const m = buildLocalizedMetadata({
    locale: "it",
    path: "/projects/a",
    title: "Titolo",
    description: "Descrizione",
    image: "https://cdn.test/a.webp",
  });
  assert.equal(m.alternates.canonical, `${ORIGIN}/it/projects/a`);
  assert.equal(m.alternates.languages.es, `${ORIGIN}/es/projects/a`);
  assert.deepEqual(m.openGraph.images, [{ url: "https://cdn.test/a.webp", alt: "Titolo" }]);
  assert.deepEqual(m.twitter.images, ["https://cdn.test/a.webp"]);
});
