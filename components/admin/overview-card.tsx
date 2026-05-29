"use client";
import Link from "next/link";
import { Capsule } from "@/components/ui/capsule";
import { ArrowUpRight } from "lucide-react";

interface OverviewCardProps {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  count?: number;
}

export function OverviewCard({ href, eyebrow, title, description, count }: OverviewCardProps) {
  return (
    <Link
      href={href}
      className="group relative block bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--brand-cyan)]/40"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3">{eyebrow}</div>
      <h3 className="text-lg font-semibold tracking-[-0.01em] mb-2">{title}</h3>
      <p className="text-[12.5px] leading-[1.55] text-[color:var(--ink-muted)]">{description}</p>
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[color:var(--ink-muted)] group-hover:text-foreground transition">
        {typeof count === "number" && (
          <Capsule size="sm" dot={false} className="!text-[10px]">{count} items</Capsule>
        )}
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
