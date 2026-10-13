import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSitemapEntries } from "./sitemap-entries.ts";

const built = new Date("2026-01-01T00:00:00Z");
const ORIGIN = "https://www.capsulecodes.com";

test("sitemap lists every page in en, es and it with www URLs", () => {
  const entries = buildSitemapEntries([{ id: "a" }, { id: "b" }], built);
  const urls = entries.map((e) => e.url);
  assert.ok(urls.every((u) => u.startsWith(ORIGIN)));
  assert.deepEqual(urls, [
    ORIGIN, `${ORIGIN}/es`, `${ORIGIN}/it`,
    `${ORIGIN}/projects`, `${ORIGIN}/es/projects`, `${ORIGIN}/it/projects`,
    `${ORIGIN}/projects/a`, `${ORIGIN}/es/projects/a`, `${ORIGIN}/it/projects/a`,
    `${ORIGIN}/projects/b`, `${ORIGIN}/es/projects/b`, `${ORIGIN}/it/projects/b`,
    `${ORIGIN}/privacy`, `${ORIGIN}/es/privacy`, `${ORIGIN}/it/privacy`,
    `${ORIGIN}/terms`, `${ORIGIN}/es/terms`, `${ORIGIN}/it/terms`,
  ]);
});

test("every entry carries the same hreflang set, x-default on english", () => {
  const entries = buildSitemapEntries([{ id: "a" }], built);
  for (const url of [`${ORIGIN}/projects/a`, `${ORIGIN}/es/projects/a`, `${ORIGIN}/it/projects/a`]) {
    assert.deepEqual(entries.find((e) => e.url === url)!.alternates, {
      languages: {
        en: `${ORIGIN}/projects/a`,
        es: `${ORIGIN}/es/projects/a`,
        it: `${ORIGIN}/it/projects/a`,
        "x-default": `${ORIGIN}/projects/a`,
      },
    });
  }
  assert.equal(entries[0].alternates?.languages?.es, `${ORIGIN}/es`);
});

test("projects use their own updatedAt in every locale", () => {
  const entries = buildSitemapEntries([{ id: "a", updatedAt: "2026-03-05T10:00:00Z" }], built);
  for (const prefix of ["", "/es", "/it"]) {
    const e = entries.find((x) => x.url === `${ORIGIN}${prefix}/projects/a`)!;
    assert.equal((e.lastModified as Date).toISOString(), "2026-03-05T10:00:00.000Z");
  }
});

test("projects without a valid updatedAt omit lastModified; static pages use the fixed build date", () => {
  const entries = buildSitemapEntries([{ id: "b" }, { id: "c", updatedAt: "nope" }], built);
  assert.equal(entries.find((e) => e.url.endsWith("/projects/b"))!.lastModified, undefined);
  assert.equal(entries.find((e) => e.url.endsWith("/es/projects/c"))!.lastModified, undefined);
  assert.equal(entries.find((e) => e.url.endsWith("/privacy"))!.lastModified, built);
  assert.equal(entries.find((e) => e.url.endsWith("/it/terms"))!.lastModified, built);
});
