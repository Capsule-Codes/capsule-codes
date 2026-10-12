import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_COVER_BYTES,
  COVER_WIDTH,
  COVER_HEIGHT,
  buildCoverPath,
  validateCoverFile,
  buildCoverPatch,
  coverShortId,
} from "./project-cover.ts";

test("cover is 16:10 at 1600x1000", () => {
  assert.equal(COVER_WIDTH, 1600);
  assert.equal(COVER_HEIGHT, 1000);
});

test("buildCoverPath uses projects/<id>/cover-<shortid>.webp", () => {
  assert.equal(
    buildCoverPath("p-1", "fd47533e"),
    "projects/p-1/cover-fd47533e.webp",
  );
});

test("coverShortId is 8 hex chars from a uuid", () => {
  assert.equal(coverShortId("fd47533e-aaaa-bbbb-cccc-1234567890ab"), "fd47533e");
});

test("each upload gets a distinct path (never overwrites an old cover)", () => {
  assert.notEqual(buildCoverPath("p", "aaaaaaaa"), buildCoverPath("p", "bbbbbbbb"));
});

test("buildCoverPath rejects unsafe ids", () => {
  assert.throws(() => buildCoverPath("../x", "aaaaaaaa"));
  assert.throws(() => buildCoverPath("p", "../../"));
});

test("validateCoverFile accepts images within limit", () => {
  assert.deepEqual(validateCoverFile({ type: "image/png", size: 1000 }), { ok: true });
  assert.deepEqual(validateCoverFile({ type: "image/webp", size: MAX_COVER_BYTES }), { ok: true });
});

test("validateCoverFile rejects non-images, empty and oversized", () => {
  assert.equal(validateCoverFile({ type: "application/pdf", size: 10 }).ok, false);
  assert.equal(validateCoverFile({ type: "image/svg+xml", size: 10 }).ok, false);
  assert.equal(validateCoverFile({ type: "image/png", size: 0 }).ok, false);
  assert.equal(validateCoverFile({ type: "image/png", size: MAX_COVER_BYTES + 1 }).ok, false);
});

test("buildCoverPatch only touches image, never images[]", () => {
  const patch = buildCoverPatch("https://cdn.test/c.webp");
  assert.deepEqual(patch, { image: "https://cdn.test/c.webp" });
  assert.equal("images" in patch, false);
  assert.equal("coverMediaId" in patch, false);
});

test("buildCoverPatch with null clears the cover", () => {
  assert.deepEqual(buildCoverPatch(null), { image: "" });
});
