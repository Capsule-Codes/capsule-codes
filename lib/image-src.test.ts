import { test } from "node:test";
import assert from "node:assert/strict";
import { canOptimizeImage } from "./image-src.ts";

const bucket = "https://qijznxwebaukhrkqkbdn.supabase.co/storage/v1/object/public/images";

test("Supabase public storage images are optimizable", () => {
  assert.equal(canOptimizeImage(`${bucket}/projects/a/cover-1.webp`), true);
});

test("site-local images are optimizable", () => {
  assert.equal(canOptimizeImage("/images/capsule-codes-logo-360.webp"), true);
});

test("other hosts, protocol-relative and data URLs are not (they would throw in next/image)", () => {
  assert.equal(canOptimizeImage("https://example.com/a.png"), false);
  assert.equal(canOptimizeImage("//qijznxwebaukhrkqkbdn.supabase.co/storage/v1/object/public/images/a.png"), false);
  assert.equal(canOptimizeImage("data:image/png;base64,AAAA"), false);
  assert.equal(canOptimizeImage("blob:http://localhost/abc"), false);
});

test("Supabase URLs outside public storage are not optimizable", () => {
  assert.equal(canOptimizeImage("https://qijznxwebaukhrkqkbdn.supabase.co/rest/v1/projects"), false);
  assert.equal(canOptimizeImage("https://evil.com/storage/v1/object/public/images/a.png"), false);
});

test("empty or malformed values are not optimizable", () => {
  assert.equal(canOptimizeImage(""), false);
  assert.equal(canOptimizeImage("not a url"), false);
});
