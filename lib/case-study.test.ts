import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCaseStudy, getCaseStudyLocale, validateCaseStudyJson } from "./case-study.ts";

const loc = (tag: string) => ({
  subtitle: `${tag} subtitle`,
  summary: `${tag} summary`,
  challenge: `${tag} challenge`,
  solution: `${tag} solution`,
  highlights: [
    { title: `${tag} h1`, body: `${tag} b1` },
    { title: `${tag} h2`, body: `${tag} b2` },
  ],
  results: `${tag} results`,
});

const valid = () => ({
  meta: {
    client: "UR POV",
    industry: "Media",
    year: 2025,
    countries: ["USA"],
    platforms: ["iOS", "Android"],
    role: "Design & full-stack development",
    links: { web: "https://example.com", appStore: "https://apps.apple.com/x" },
  },
  en: loc("en"),
  es: loc("es"),
  it: loc("it"),
});

test("parses a complete case study unchanged", () => {
  const input = valid();
  assert.deepEqual(parseCaseStudy(input), input);
});

test("accepts a JSON string (jsonb may arrive serialized)", () => {
  assert.deepEqual(parseCaseStudy(JSON.stringify(valid())), valid());
});

test("returns null for null, non-objects and garbage", () => {
  for (const bad of [null, undefined, 42, "nope", [], "{bad json"]) {
    assert.equal(parseCaseStudy(bad), null, String(bad));
  }
});

test("returns null without meta or without an English locale", () => {
  const noMeta: Record<string, unknown> = valid();
  delete noMeta.meta;
  assert.equal(parseCaseStudy(noMeta), null);
  const noEn: Record<string, unknown> = valid();
  delete noEn.en;
  assert.equal(parseCaseStudy(noEn), null);
});

test("returns null when meta is invalid", () => {
  assert.equal(parseCaseStudy({ ...valid(), meta: { ...valid().meta, client: "" } }), null);
  assert.equal(parseCaseStudy({ ...valid(), meta: { ...valid().meta, year: "2025" } }), null);
  assert.equal(parseCaseStudy({ ...valid(), meta: { ...valid().meta, platforms: "iOS" } }), null);
});

test("a missing or invalid es/it locale falls back to English", () => {
  const input: Record<string, unknown> = valid();
  delete input.es;
  input.it = { summary: 3 };
  const cs = parseCaseStudy(input)!;
  assert.deepEqual(cs.es, cs.en);
  assert.deepEqual(cs.it, cs.en);
});

test("drops invalid highlights and unsafe or empty links", () => {
  const input = valid();
  (input.en.highlights as unknown[]).push({ title: "", body: "x" }, "junk");
  input.meta.links = { web: "javascript:alert(1)", appStore: "", googlePlay: "https://play.google.com/x" } as never;
  const cs = parseCaseStudy(input)!;
  assert.equal(cs.en.highlights.length, 2);
  assert.deepEqual(cs.meta.links, { googlePlay: "https://play.google.com/x" });
});

test("omits links entirely when none are valid", () => {
  const input = valid();
  input.meta.links = { web: "ftp://x" } as never;
  assert.equal("links" in parseCaseStudy(input)!.meta, false);
});

test("getCaseStudyLocale picks the language", () => {
  const cs = parseCaseStudy(valid())!;
  assert.equal(getCaseStudyLocale(cs, "es")?.summary, "es summary");
  assert.equal(getCaseStudyLocale(null, "es"), null);
});

test("validateCaseStudyJson: empty clears, invalid reports an error, valid parses", () => {
  assert.deepEqual(validateCaseStudyJson("   "), { ok: true, value: null });
  const syntax = validateCaseStudyJson("{");
  assert.equal(syntax.ok, false);
  const shape = validateCaseStudyJson(JSON.stringify({ meta: {} }));
  assert.equal(shape.ok, false);
  const good = validateCaseStudyJson(JSON.stringify(valid()));
  assert.equal(good.ok, true);
  assert.equal(good.ok && good.value?.meta.client, "UR POV");
});
