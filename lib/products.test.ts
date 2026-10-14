import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { PRODUCTS, getProductCopy } from "./products.ts";

const LOCALES = ["en", "es", "it"] as const;

test("lists the three owned products in order with their links", () => {
  assert.deepEqual(
    PRODUCTS.map((p) => [p.id, p.href]),
    [
      ["stagionaly", "https://stagionaly.com"],
      ["orbys", "https://www.getorbys.com"],
      ["elevate", "https://byelevate.app"],
    ],
  );
});

test("every product has non-empty copy in every locale", () => {
  for (const p of PRODUCTS) {
    for (const l of LOCALES) {
      const c = getProductCopy(p, l);
      assert.ok(c.tagline.length > 10, `${p.id}/${l} tagline`);
      assert.ok(c.description.length > 20, `${p.id}/${l} description`);
    }
  }
});

test("locales differ so es/it never fall back to English copy", () => {
  for (const p of PRODUCTS) {
    const en = getProductCopy(p, "en");
    for (const l of ["es", "it"] as const) {
      assert.notEqual(getProductCopy(p, l).tagline, en.tagline, `${p.id}/${l}`);
      assert.notEqual(getProductCopy(p, l).description, en.description, `${p.id}/${l}`);
    }
  }
});

test("cover images exist in public/ and are served from /images/products", () => {
  for (const p of PRODUCTS) {
    assert.ok(p.image.startsWith("/images/products/"));
    assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)), p.image);
  }
});

test("Elevate is honest: website live, apps not claimed as released", () => {
  const elevate = PRODUCTS.find((p) => p.id === "elevate")!;
  assert.equal(elevate.status, "websiteLive");
  for (const p of PRODUCTS.filter((x) => x.id !== "elevate")) assert.equal(p.status, "live");
  for (const l of LOCALES) {
    const text = JSON.stringify(getProductCopy(elevate, l)).toLowerCase();
    assert.ok(!/app store|google play|in production|producción|produzione/.test(text), l);
  }
});
