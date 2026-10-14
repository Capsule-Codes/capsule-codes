import { test } from "node:test";
import assert from "node:assert/strict";
import { isUuid } from "./uuid.ts";

test("isUuid accepts canonical UUIDs in any case", () => {
  assert.equal(isUuid("d00a66a9-0ed9-4505-831b-9481297b6704"), true);
  assert.equal(isUuid("D00A66A9-0ED9-4505-831B-9481297B6704"), true);
});

test("isUuid rejects anything that is not a UUID", () => {
  for (const value of ["nope", "", "d00a66a9-0ed9-4505-831b", "d00a66a9-0ed9-4505-831b-9481297b6704x", "../admin"]) {
    assert.equal(isUuid(value), false, value);
  }
});
