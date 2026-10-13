import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE_URL, absoluteUrl } from "./site.ts";

test("SITE_URL is the canonical www origin without trailing slash", () => {
  assert.equal(SITE_URL, "https://www.capsulecodes.com");
});

test("absoluteUrl joins paths against SITE_URL", () => {
  assert.equal(absoluteUrl(""), SITE_URL);
  assert.equal(absoluteUrl("/"), SITE_URL);
  assert.equal(absoluteUrl("/projects"), `${SITE_URL}/projects`);
  assert.equal(absoluteUrl("projects/a"), `${SITE_URL}/projects/a`);
});
