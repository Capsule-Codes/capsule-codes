import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMarkdown, parseInline, safeHref } from "./markdown.ts";

const text = (value: string) => ({ type: "text", value });

test("splits paragraphs on blank lines and joins soft line breaks", () => {
  assert.deepEqual(parseMarkdown("First line\nsame paragraph.\n\nSecond."), [
    { type: "paragraph", children: [text("First line same paragraph.")] },
    { type: "paragraph", children: [text("Second.")] },
  ]);
});

test("empty input yields no blocks", () => {
  assert.deepEqual(parseMarkdown("   \n\n "), []);
});

test("bold, italics and nesting", () => {
  assert.deepEqual(parseInline("a **b** _c_ *d* __e__"), [
    text("a "),
    { type: "strong", children: [text("b")] },
    text(" "),
    { type: "em", children: [text("c")] },
    text(" "),
    { type: "em", children: [text("d")] },
    text(" "),
    { type: "strong", children: [text("e")] },
  ]);
  assert.deepEqual(parseInline("**bold _it_**"), [
    { type: "strong", children: [text("bold "), { type: "em", children: [text("it")] }] },
  ]);
});

test("unclosed markers stay literal", () => {
  assert.deepEqual(parseInline("2 * 3 and **open"), [text("2 * 3 and **open")]);
});

test("snake_case words are not italicised", () => {
  assert.deepEqual(parseInline("use case_study_json here"), [text("use case_study_json here")]);
});

test("links keep safe hrefs and drop unsafe ones to plain text", () => {
  assert.deepEqual(parseInline("see [site](https://x.com) now"), [
    text("see "),
    { type: "link", href: "https://x.com", children: [text("site")] },
    text(" now"),
  ]);
  assert.deepEqual(parseInline("[bad](javascript:alert(1))"), [text("bad")]);
});

test("safeHref allows http(s), mailto and site-relative paths only", () => {
  assert.equal(safeHref("https://a.b"), "https://a.b");
  assert.equal(safeHref("mailto:a@b.c"), "mailto:a@b.c");
  assert.equal(safeHref("/#contact"), "/#contact");
  assert.equal(safeHref("//evil.com"), null);
  assert.equal(safeHref("JavaScript:alert(1)"), null);
  assert.equal(safeHref("data:text/html,x"), null);
});

test("raw HTML is kept as inert text, never parsed", () => {
  assert.deepEqual(parseMarkdown("<script>alert(1)</script>"), [
    { type: "paragraph", children: [text("<script>alert(1)</script>")] },
  ]);
});

test("unordered and ordered lists", () => {
  assert.deepEqual(parseMarkdown("Intro\n\n- one\n* **two**\n\n1. a\n2. b"), [
    { type: "paragraph", children: [text("Intro")] },
    {
      type: "list",
      ordered: false,
      items: [[text("one")], [{ type: "strong", children: [text("two")] }]],
    },
    { type: "list", ordered: true, items: [[text("a")], [text("b")]] },
  ]);
});

test("a list directly after a paragraph line starts a new block", () => {
  assert.deepEqual(parseMarkdown("We shipped:\n- iOS\n- Android"), [
    { type: "paragraph", children: [text("We shipped:")] },
    { type: "list", ordered: false, items: [[text("iOS")], [text("Android")]] },
  ]);
});
