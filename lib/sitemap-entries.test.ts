import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSitemapEntries } from "./sitemap-entries.ts";

const built = new Date("2026-01-01T00:00:00Z");

test("sitemap uses www URLs and per-project updatedAt", () => {
  const entries = buildSitemapEntries(
    [
      { id: "a", updatedAt: "2026-03-05T10:00:00Z" },
      { id: "b" },
    ],
    built,
  );
  const urls = entries.map((e) => e.url);
  assert.ok(urls.every((u) => u.startsWith("https://www.capsulecodes.com")));
  assert.deepEqual(urls, [
    "https://www.capsulecodes.com",
    "https://www.capsulecodes.com/projects",
    "https://www.capsulecodes.com/projects/a",
    "https://www.capsulecodes.com/projects/b",
    "https://www.capsulecodes.com/privacy",
    "https://www.capsulecodes.com/terms",
  ]);
  const a = entries.find((e) => e.url.endsWith("/projects/a"))!;
  assert.equal((a.lastModified as Date).toISOString(), "2026-03-05T10:00:00.000Z");
});

test("projects without a valid updatedAt omit lastModified; static pages use the fixed build date", () => {
  const entries = buildSitemapEntries([{ id: "b" }, { id: "c", updatedAt: "nope" }], built);
  assert.equal(entries.find((e) => e.url.endsWith("/projects/b"))!.lastModified, undefined);
  assert.equal(entries.find((e) => e.url.endsWith("/projects/c"))!.lastModified, undefined);
  assert.equal(entries.find((e) => e.url.endsWith("/privacy"))!.lastModified, built);
});
