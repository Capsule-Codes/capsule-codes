/**
 * Tiny, safe markdown subset for case study copy: paragraphs, **bold**,
 * _italics_, [links](https://…) and -/1. lists. It parses to a plain AST that
 * React renders as elements, so raw HTML in the source is only ever text.
 */
export type MdInline =
  | { type: "text"; value: string }
  | { type: "strong"; children: MdInline[] }
  | { type: "em"; children: MdInline[] }
  | { type: "link"; href: string; children: MdInline[] };

export type MdBlock =
  | { type: "paragraph"; children: MdInline[] }
  | { type: "list"; ordered: boolean; items: MdInline[][] };

/** Allowed link targets: http(s), mailto and site-relative paths ("/x", "/#y"). */
export function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https?:\/\/\S+$/i.test(h) || /^mailto:\S+$/i.test(h)) return h;
  if (/^\/(?!\/)\S*$/.test(h)) return h;
  return null;
}

const isWordChar = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c);
const isSpace = (c: string | undefined) => !c || /\s/.test(c);

function pushText(out: MdInline[], value: string) {
  if (!value) return;
  const last = out[out.length - 1];
  if (last?.type === "text") last.value += value;
  else out.push({ type: "text", value });
}

function pushAll(out: MdInline[], nodes: MdInline[]) {
  for (const n of nodes) {
    if (n.type === "text") pushText(out, n.value);
    else out.push(n);
  }
}

/** Index of the closing `marker` for an emphasis run opened at `from`, or -1. */
function findClose(src: string, marker: string, from: number): number {
  let j = src.indexOf(marker, from);
  while (j !== -1) {
    const before = src[j - 1];
    const after = src[j + marker.length];
    const single = marker.length === 1;
    const partOfDouble = single && (after === marker || before === marker);
    const intraword = marker[0] === "_" && isWordChar(after);
    if (j > from && !isSpace(before) && !partOfDouble && !intraword) return j;
    j = src.indexOf(marker, j + 1);
  }
  return -1;
}

/** Parses `[label](href)` at `i`; returns the end index and node, or null. */
function parseLink(src: string, i: number): { end: number; nodes: MdInline[] } | null {
  const close = src.indexOf("](", i + 1);
  if (close === -1 || src.slice(i + 1, close).includes("\n")) return null;
  let depth = 1;
  let j = close + 2;
  for (; j < src.length && depth > 0; j++) {
    if (src[j] === "(") depth++;
    else if (src[j] === ")") depth--;
  }
  if (depth !== 0) return null;
  const label = parseInline(src.slice(i + 1, close));
  const href = safeHref(src.slice(close + 2, j - 1));
  return { end: j, nodes: href ? [{ type: "link", href, children: label }] : label };
}

export function parseInline(src: string): MdInline[] {
  const out: MdInline[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "[") {
      const link = parseLink(src, i);
      if (link) {
        pushAll(out, link.nodes);
        i = link.end;
        continue;
      }
    }
    if (c === "*" || c === "_") {
      const double = src[i + 1] === c;
      const marker = double ? c + c : c;
      const openOk =
        !isSpace(src[i + marker.length]) && !(c === "_" && isWordChar(src[i - 1]));
      const close = openOk ? findClose(src, marker, i + marker.length) : -1;
      if (close !== -1) {
        const children = parseInline(src.slice(i + marker.length, close));
        out.push({ type: double ? "strong" : "em", children });
        i = close + marker.length;
        continue;
      }
      pushText(out, marker);
      i += marker.length;
      continue;
    }
    pushText(out, c);
    i++;
  }
  return out;
}

const UL = /^\s*[-*+]\s+(.*)$/;
const OL = /^\s*\d+[.)]\s+(.*)$/;

export function parseMarkdown(src: string): MdBlock[] {
  const blocks: MdBlock[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (para.length) blocks.push({ type: "paragraph", children: parseInline(para.join(" ")) });
    if (list) blocks.push({ type: "list", ordered: list.ordered, items: list.items.map(parseInline) });
    para = [];
    list = null;
  };

  for (const rawLine of src.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    const ul = UL.exec(rawLine);
    const ol = ul ? null : OL.exec(rawLine);
    const item = ul ?? ol;
    if (item) {
      const ordered = !!ol;
      if (para.length || (list && list.ordered !== ordered)) flush();
      if (!list) list = { ordered, items: [] };
      list.items.push(item[1].trim());
      continue;
    }
    if (list) flush();
    para.push(line);
  }
  flush();
  return blocks;
}
