"use client";
import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8 pb-6 border-b border-[color:var(--ink-line)]">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
        {subtitle && (
          <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      )}
    </header>
  );
}
