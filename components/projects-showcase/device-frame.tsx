import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FrameProps {
  children: ReactNode;
  className?: string;
}

export function BrowserFrame({ children, className }: FrameProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[color:var(--ink-line-strong)] bg-[color:var(--ink-bg-2)] shadow-[0_28px_70px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="flex h-9 shrink-0 items-center gap-[7px] border-b border-[color:var(--ink-line)] bg-[color:var(--hover-bg)] px-3.5">
        <span className="size-2 rounded-full bg-[color:var(--ink-line-strong)]" />
        <span className="size-2 rounded-full bg-[color:var(--ink-line-strong)]" />
        <span className="size-2 rounded-full bg-[color:var(--ink-line-strong)]" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className }: FrameProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[30px] border border-[color:var(--ink-line-strong)] bg-[color:var(--ink-bg-2)] p-1.5 shadow-[0_28px_70px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-[color:var(--ink-line)] bg-[color:var(--ink-bg)]">
        <div className="absolute left-1/2 top-2.5 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[color:var(--ink-line-strong)]" />
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
