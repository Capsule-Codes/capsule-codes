"use client";
import { useState, type ReactNode } from "react";

export type LangCode = "en" | "es" | "it";

interface MultilingualTabsProps {
  /** Per-lang completion booleans, used to render a check dot on each tab. */
  completion: Record<LangCode, boolean>;
  children: (lang: LangCode) => ReactNode;
}

const LANGS: LangCode[] = ["en", "es", "it"];

export function MultilingualTabs({ completion, children }: MultilingualTabsProps) {
  const [lang, setLang] = useState<LangCode>("en");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 p-1 bg-white/[0.04] border border-[color:var(--ink-line)] rounded-full w-fit">
        {LANGS.map((l) => {
          const active = lang === l;
          const done = completion[l];
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={
                active
                  ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/[0.06] text-foreground"
                  : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[color:var(--ink-muted)] hover:text-foreground transition"
              }
            >
              <span className="font-mono uppercase">{l}</span>
              {done && (
                <span
                  aria-hidden
                  className="block size-1.5 rounded-full bg-[color:var(--brand-green)]"
                  style={{ boxShadow: "0 0 8px var(--brand-green)" }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div>{children(lang)}</div>
    </div>
  );
}
