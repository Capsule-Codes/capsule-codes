import { Fragment } from "react";
import { parseInline, parseMarkdown, type MdInline } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/** Renders the safe markdown subset as React elements (never as raw HTML). */
function Inline({ nodes }: { nodes: MdInline[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.type) {
          case "text":
            return <Fragment key={i}>{node.value}</Fragment>;
          case "strong":
            return (
              <strong key={i} className="font-semibold text-[color:var(--ink-fg)]">
                <Inline nodes={node.children} />
              </strong>
            );
          case "em":
            return (
              <em key={i}>
                <Inline nodes={node.children} />
              </em>
            );
          case "link": {
            const external = /^https?:/i.test(node.href);
            return (
              <a
                key={i}
                href={node.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-[color:var(--brand-cyan)] underline decoration-[color:var(--brand-cyan)]/40 underline-offset-4 transition-colors hover:decoration-[color:var(--brand-cyan)]"
              >
                <Inline nodes={node.children} />
              </a>
            );
          }
        }
      })}
    </>
  );
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, i) =>
        block.type === "paragraph" ? (
          <p key={i}>
            <Inline nodes={block.children} />
          </p>
        ) : (
          (() => {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                key={i}
                className={cn(
                  "space-y-2 pl-5 marker:text-[color:var(--brand-cyan)]",
                  block.ordered ? "list-decimal" : "list-disc",
                )}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <Inline nodes={item} />
                  </li>
                ))}
              </List>
            );
          })()
        ),
      )}
    </div>
  );
}

/** Single-line markdown (bold, italics, links) without block wrappers. */
export function InlineMarkdown({ source }: { source: string }) {
  return <Inline nodes={parseInline(source)} />;
}
