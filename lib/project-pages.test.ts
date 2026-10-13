import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildProjectMetadata,
  findPublishedProject,
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

test("buildProjectMetadata falls back to base fields and omits images without cover", () => {
  const m = buildProjectMetadata(
    project("a", { translations: undefined, image: "" }),
  );
  assert.equal(m.title, "T-a");
  assert.equal(m.description, "Base description");
  assert.equal(m.openGraph?.images, undefined);
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
