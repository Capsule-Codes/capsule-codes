import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  /** Heading element for the title; a route's page-level heading should pass "h1". */
  as?: "h1" | "h2";
}

export function SectionHeader({ eyebrow, title, lead, align = "left", className, as: Heading = "h2" }: SectionHeaderProps) {
  return (
    <ScrollReveal className={cn("max-w-[720px]", align === "center" && "mx-auto text-center", className)}>
      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3.5">{eyebrow}</div>
      <Heading className="font-sans text-[38px] leading-[1.05] font-semibold tracking-[-0.035em] mb-4">{title}</Heading>
      {lead && <p className="text-base leading-[1.6] text-[color:var(--ink-muted)]">{lead}</p>}
    </ScrollReveal>
  );
}
