import { test } from "node:test";
import assert from "node:assert/strict";
import { CACHE_TAGS, revalidateContent, withRevalidation } from "./cache-tags.ts";

function fakes() {
  const tags: string[] = [];
  const paths: Array<[string, string | undefined]> = [];
  return {
    tags,
    paths,
    deps: {
      revalidateTag: (tag: string) => void tags.push(tag),
      revalidatePath: (path: string, type?: "layout" | "page") => void paths.push([path, type]),
    },
  };
}

test("each content resource has its own distinct tag", () => {
  const values = Object.values(CACHE_TAGS);
  assert.equal(new Set(values).size, values.length);
});

test("revalidating a resource invalidates its tag", () => {
  const f = fakes();
  revalidateContent(["projects"], f.deps);
  assert.deepEqual(f.tags, [CACHE_TAGS.projects]);
});

test("several resources invalidate each tag once", () => {
  const f = fakes();
  revalidateContent(["projects", "team", "projects"], f.deps);
  assert.deepEqual(f.tags, [CACHE_TAGS.projects, CACHE_TAGS.team]);
});

test("the public page tree is invalidated once, whatever the resources", () => {
  const f = fakes();
  revalidateContent(["reviews", "technologies"], f.deps);
  assert.deepEqual(f.paths, [["/[locale]", "layout"]]);
});

test("no resources means nothing is invalidated", () => {
  const f = fakes();
  revalidateContent([], f.deps);
  assert.deepEqual(f.tags, []);
  assert.deepEqual(f.paths, []);
});

test("a successful write handler revalidates its resources and returns its response", async () => {
  const f = fakes();
  const res = new Response("{}", { status: 201 });
  const handler = withRevalidation(["reviews"], async (_req: string) => res, f.deps);
  assert.equal(await handler("req"), res);
  assert.deepEqual(f.tags, [CACHE_TAGS.reviews]);
});

test("a failed write handler (4xx/5xx) revalidates nothing", async () => {
  const f = fakes();
  const handler = withRevalidation(["reviews"], async () => new Response("no", { status: 500 }), f.deps);
  assert.equal((await handler()).status, 500);
  assert.deepEqual(f.tags, []);
});

test("a throwing write handler revalidates nothing and rethrows", async () => {
  const f = fakes();
  const handler = withRevalidation(["team"], async () => { throw new Error("boom"); }, f.deps);
  await assert.rejects(() => handler(), /boom/);
  assert.deepEqual(f.tags, []);
});
