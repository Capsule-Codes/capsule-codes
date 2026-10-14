import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getProjectCover,
  getProjectScreenshots,
  getProjectThumb,
  isPortraitImage,
  resolvePrimaryImage,
} from "./project-media.ts";

const COVER = "https://cdn.test/cover.webp";

function img(id: string, url: string, w = 1000, h = 600, sortOrder = 0) {
  return {
    mediaId: id,
    blobKey: url,
    mimeType: "image/webp",
    width: w,
    height: h,
    sizeBytes: 1,
    alt: id,
    sortOrder,
    createdAt: "",
  };
}

test("isPortraitImage", () => {
  assert.equal(isPortraitImage(img("a", "u", 500, 900)), true);
  assert.equal(isPortraitImage(img("a", "u", 900, 500)), false);
  assert.equal(isPortraitImage(null), false);
  assert.equal(isPortraitImage({ width: 0, height: 0 }), false);
});

test("getProjectCover returns image or null", () => {
  assert.equal(getProjectCover({ image: COVER }), COVER);
  assert.equal(getProjectCover({ image: "" }), null);
  assert.equal(getProjectCover({ image: undefined as unknown as string }), null);
});

test("getProjectScreenshots excludes the cover and sorts by sortOrder", () => {
  const shots = getProjectScreenshots({
    image: COVER,
    images: [img("c", COVER, 1600, 1000, 0), img("b", "s2", 500, 900, 2), img("a", "s1", 500, 900, 1)],
  });
  assert.deepEqual(shots.map((s) => s.mediaId), ["a", "b"]);
});

test("getProjectScreenshots handles missing images", () => {
  assert.deepEqual(getProjectScreenshots({ image: COVER }), []);
  assert.deepEqual(getProjectScreenshots({ image: COVER, images: [] }), []);
});

test("getProjectScreenshots keeps everything when image is empty", () => {
  const shots = getProjectScreenshots({ image: "", images: [img("a", "s1")] });
  assert.equal(shots.length, 1);
});

test("getProjectThumb prefers the cover, landscape", () => {
  const t = getProjectThumb({ image: COVER, images: [img("a", "s1", 500, 900)] });
  assert.deepEqual(t, { url: COVER, portrait: false, isCover: true });
});

test("getProjectThumb legacy mirror: image equals a portrait screenshot keeps portrait", () => {
  const t = getProjectThumb({ image: "s1", images: [img("a", "s1", 500, 900)] });
  assert.equal(t.url, "s1");
  assert.equal(t.portrait, true);
});

test("getProjectThumb falls back to coverMediaId then first screenshot", () => {
  const images = [img("a", "s1", 900, 500, 0), img("b", "s2", 500, 900, 1)];
  assert.deepEqual(getProjectThumb({ image: "", images, coverMediaId: "b" }), {
    url: "s2",
    portrait: true,
    isCover: false,
  });
  assert.equal(getProjectThumb({ image: "", images }).url, "s1");
});

test("getProjectThumb with nothing", () => {
  assert.deepEqual(getProjectThumb({ image: "" }), { url: null, portrait: false, isCover: false });
});

test("resolvePrimaryImage never overwrites an existing cover", () => {
  assert.equal(resolvePrimaryImage(COVER, [img("a", "s1")]), COVER);
});

test("resolvePrimaryImage falls back to first screenshot when empty", () => {
  assert.equal(resolvePrimaryImage("", [img("a", "s1")]), "s1");
  assert.equal(resolvePrimaryImage("", []), "");
});

test("resolvePrimaryImage re-points when the current image was a removed screenshot", () => {
  assert.equal(resolvePrimaryImage("s1", [img("b", "s2")], "s1"), "s2");
  assert.equal(resolvePrimaryImage("s1", [], "s1"), "");
  assert.equal(resolvePrimaryImage(COVER, [img("b", "s2")], "s1"), COVER);
});

test("desktopGalleryLayout fills complete rows on a 6-column grid", async () => {
  const { desktopGalleryLayout } = await import("./project-media.ts");
  const span = { featured: 4, third: 2, half: 3, full: 6 } as const;
  assert.deepEqual(desktopGalleryLayout(0), []);
  assert.deepEqual(desktopGalleryLayout(1), ["full"]);
  assert.deepEqual(desktopGalleryLayout(2), ["half", "half"]);
  assert.deepEqual(desktopGalleryLayout(3), ["featured", "third", "third"]);
  assert.deepEqual(desktopGalleryLayout(4), ["half", "half", "half", "half"]);
  for (let n = 3; n <= 14; n++) {
    const layout = desktopGalleryLayout(n);
    assert.equal(layout.length, n);
    // featured is 4 cols x 2 rows next to two stacked thirds; the rest flows.
    const rest = layout.slice(layout[0] === "featured" ? 3 : 0);
    let row = 0;
    for (const kind of rest) {
      row += span[kind];
      if (row === 6) row = 0;
      assert.ok(row < 6, `n=${n} overflows a row`);
    }
    assert.equal(row, 0, `n=${n} leaves an incomplete last row`);
  }
});
