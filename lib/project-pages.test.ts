import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildProjectMetadata,
  findPublishedProject,
  getNextProject,
  getPublishedProjects,
  isProjectPublished,
  resolveProjectSubtitle,
} from "./project-pages.ts";

const tr = (title: string, description = "d") => ({ title, subtitle: "s", description });

function project(id: string, over: Record<string, unknown> = {}) {
  return {
    id,
    title: `T-${id}`,
    description: "Base description",
    translations: { en: tr(`EN-${id}`, "English description"), es: tr(`ES-${id}`), it: tr(`IT-${id}`) },
    image: `https://cdn.test/${id}.webp`,
    technologies: [],
    category: "web" as const,
    published: true,
    ...over,
  };
}

test("isProjectPublished requires published === true", () => {
  assert.equal(isProjectPublished(project("a")), true);
  assert.equal(isProjectPublished(project("a", { published: false })), false);
  assert.equal(isProjectPublished(project("a", { published: undefined })), false);
});

test("getPublishedProjects ignores showOnHome", () => {
  const list = [
    project("a"),
    project("b", { published: false }),
    project("c", { showOnHome: false }),
  ];
  assert.deepEqual(getPublishedProjects(list).map((p) => p.id), ["a", "c"]);
});

test("findPublishedProject returns null for unknown or unpublished ids", () => {
  const list = [project("a"), project("b", { published: false })];
  assert.equal(findPublishedProject(list, "a")?.id, "a");
  assert.equal(findPublishedProject(list, "b"), null);
  assert.equal(findPublishedProject(list, "zzz"), null);
});

test("buildProjectMetadata uses english copy and the cover as OG image", () => {
  const m = buildProjectMetadata(project("a"));
  assert.equal(m.title, "EN-a");
  assert.equal(m.description, "English description");
  assert.deepEqual(m.openGraph?.images, [{ url: "https://cdn.test/a.webp", alt: "EN-a" }]);
  assert.equal(m.alternates?.canonical, "https://www.capsulecodes.com/projects/a");
});

test("buildProjectMetadata falls back to base fields and the site card without cover", () => {
  const m = buildProjectMetadata(
    project("a", { translations: undefined, image: "" }),
  );
  assert.equal(m.title, "T-a");
  assert.equal(m.description, "Base description");
  assert.equal(m.openGraph.images[0].url, "https://www.capsulecodes.com/og-image.png");
});

test("buildProjectMetadata truncates long descriptions", () => {
  const m = buildProjectMetadata(project("a", { translations: undefined, description: "x".repeat(400) }));
  assert.ok((m.description as string).length <= 200);
  assert.ok((m.description as string).endsWith("…"));
});

test("resolveProjectSubtitle prefers the localized subtitle, then the DB column", () => {
  const p = project("a", { subtitle: "Column subtitle" });
  assert.equal(resolveProjectSubtitle(p, "es"), "s");
  const noTr = project("b", {
    subtitle: "Column subtitle",
    translations: { en: tr("E"), es: { title: "x", subtitle: "", description: "d" }, it: tr("I") },
  });
  assert.equal(resolveProjectSubtitle(noTr, "es"), "Column subtitle");
  assert.equal(resolveProjectSubtitle(project("c", { translations: undefined }), "en"), undefined);
  assert.equal(resolveProjectSubtitle(project("d", { subtitle: "  " , translations: { en: { title: "t", description: "d" } } }), "en"), undefined);
});

test("buildProjectMetadata is localized: es/it copy, locale canonical and hreflang", () => {
  const es = buildProjectMetadata(project("a"), "es");
  assert.equal(es.title, "ES-a");
  assert.equal(es.alternates.canonical, "https://www.capsulecodes.com/es/projects/a");
  assert.equal(es.openGraph.locale, "es_ES");
  assert.equal(es.alternates.languages.it, "https://www.capsulecodes.com/it/projects/a");
  assert.equal(es.alternates.languages["x-default"], "https://www.capsulecodes.com/projects/a");
  assert.equal(buildProjectMetadata(project("a"), "it").title, "IT-a");
});

test("buildProjectMetadata falls back from a missing locale to english then base fields", () => {
  const onlyEn = project("a", { translations: { en: tr("EN-a", "English description") } });
  const es = buildProjectMetadata(onlyEn, "es");
  assert.equal(es.title, "EN-a");
  assert.equal(es.description, "English description");
  const none = buildProjectMetadata(project("a", { translations: undefined }), "it");
  assert.equal(none.title, "T-a");
});

const csLocale = (tag: string) => ({
  subtitle: `${tag} case subtitle`,
  summary: `${tag} case summary.`,
  challenge: "c",
  solution: "s",
  highlights: [],
  results: "r",
});
const caseStudy = {
  meta: { client: "C", industry: "I", year: 2025, countries: [], platforms: [], role: "R" },
  en: csLocale("en"),
  es: csLocale("es"),
  it: csLocale("it"),
};

test("buildProjectMetadata uses the case study subtitle and summary per locale", () => {
  const p = project("a", { caseStudy });
  const es = buildProjectMetadata(p, "es");
  assert.equal(es.title, "ES-a — es case subtitle");
  assert.equal(es.description, "es case summary.");
  assert.equal(es.alternates.canonical, "https://www.capsulecodes.com/es/projects/a");
  assert.equal(buildProjectMetadata(p, "en").description, "en case summary.");
  assert.equal(buildProjectMetadata(project("b", { caseStudy: null }), "es").title, "ES-b");
});

test("resolveProjectSubtitle prefers the localized case study subtitle", () => {
  const p = project("a", { subtitle: "English column", caseStudy });
  assert.equal(resolveProjectSubtitle(p, "es"), "es case subtitle");
});

test("getNextProject returns the next published project in list order and wraps", () => {
  const list = [project("a"), project("b", { published: false }), project("c"), project("d")];
  assert.equal(getNextProject(list, "a")?.id, "c");
  assert.equal(getNextProject(list, "c")?.id, "d");
  assert.equal(getNextProject(list, "d")?.id, "a");
});

test("getNextProject is null when there is no other published project", () => {
  assert.equal(getNextProject([project("a")], "a"), null);
  assert.equal(getNextProject([project("a"), project("b", { published: false })], "a"), null);
  assert.equal(getNextProject([project("a")], "zzz")?.id, "a");
});
