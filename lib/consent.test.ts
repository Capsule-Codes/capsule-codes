import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_VERSION,
  clearCookieStrings,
  consentCookie,
  linkedinCookieNames,
  parseConsent,
  readConsent,
  serializeConsent,
} from "./consent.ts";

const NOW = new Date("2026-10-13T12:00:00.000Z");

test("serialize then parse round-trips the choice, version and timestamp", () => {
  const raw = serializeConsent("accepted", NOW);
  assert.deepEqual(parseConsent(raw), {
    version: CONSENT_VERSION,
    choice: "accepted",
    timestamp: NOW.toISOString(),
  });
  assert.equal(parseConsent(serializeConsent("rejected", NOW))?.choice, "rejected");
});

test("parseConsent treats missing, malformed or unknown values as undecided", () => {
  for (const raw of [undefined, null, "", "garbage", "{", "null", "[]", '{"v":1}', '{"v":1,"choice":"maybe","ts":"x"}']) {
    assert.equal(parseConsent(raw), null, String(raw));
  }
});

test("a stored choice from another version is ignored so people are asked again", () => {
  const old = JSON.stringify({ v: CONSENT_VERSION - 1, choice: "accepted", ts: NOW.toISOString() });
  assert.equal(parseConsent(old), null);
  const future = JSON.stringify({ v: CONSENT_VERSION + 1, choice: "accepted", ts: NOW.toISOString() });
  assert.equal(parseConsent(future), null);
});

test("a choice without a valid timestamp is ignored", () => {
  assert.equal(parseConsent(JSON.stringify({ v: CONSENT_VERSION, choice: "accepted", ts: "nope" })), null);
  assert.equal(parseConsent(JSON.stringify({ v: CONSENT_VERSION, choice: "accepted" })), null);
});

test("consentCookie is first-party, site-wide, lax and expires in six months", () => {
  const c = consentCookie("rejected", NOW);
  assert.ok(c.startsWith(`${CONSENT_COOKIE}=`));
  assert.match(c, /; Path=\//);
  assert.match(c, /; SameSite=Lax/);
  assert.match(c, new RegExp(`; Max-Age=${CONSENT_MAX_AGE_SECONDS}`));
  assert.ok(!c.includes("; Secure"));
  assert.ok(consentCookie("rejected", NOW, { secure: true }).endsWith("; Secure"));
  assert.ok(CONSENT_MAX_AGE_SECONDS >= 150 * 86400 && CONSENT_MAX_AGE_SECONDS <= 200 * 86400);
});

test("readConsent finds the cookie among others and decodes it", () => {
  const value = consentCookie("accepted", NOW).split(";")[0].split("=").slice(1).join("=");
  const header = `theme=dark; ${CONSENT_COOKIE}=${value}; other=1`;
  assert.equal(readConsent(header)?.choice, "accepted");
  assert.equal(readConsent("theme=dark; other=1"), null);
  assert.equal(readConsent(""), null);
  assert.equal(readConsent(`${CONSENT_COOKIE}=%7Bbroken`), null);
});

test("linkedinCookieNames picks LinkedIn first-party cookies only", () => {
  const header = "li_fat_id=1; li_sugr=2; bcookie=3; lidc=4; UserMatchHistory=5; theme=dark; cc_consent=x; lithium=1";
  assert.deepEqual(linkedinCookieNames(header), ["li_fat_id", "li_sugr", "bcookie", "lidc", "UserMatchHistory"]);
  assert.deepEqual(linkedinCookieNames(""), []);
});

test("clearCookieStrings expires a cookie on the host and on the parent domain", () => {
  const out = clearCookieStrings("li_fat_id", "www.capsulecodes.com");
  assert.ok(out.every((c) => c.startsWith("li_fat_id=;") && c.includes("Max-Age=0") && c.includes("Path=/")));
  assert.ok(out.some((c) => !c.includes("Domain=")));
  assert.ok(out.some((c) => c.includes("Domain=www.capsulecodes.com")));
  assert.ok(out.some((c) => c.includes("Domain=.capsulecodes.com")));
});

test("clearCookieStrings does not invent a parent domain for localhost", () => {
  const out = clearCookieStrings("li_fat_id", "localhost");
  assert.ok(out.every((c) => !c.includes("Domain=.")));
});
