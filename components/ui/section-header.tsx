import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, lead, align = "left", className }: SectionHeaderProps) {
  return (
    <ScrollReveal className={cn("max-w-[720px]", align === "center" && "mx-auto text-center", className)}>
      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-3.5">{eyebrow}</div>
      <h2 className="font-sans text-[38px] leading-[1.05] font-semibold tracking-[-0.035em] mb-4">{title}</h2>
      {lead && <p className="text-base leading-[1.6] text-[color:var(--ink-muted)]">{lead}</p>}
    </ScrollReveal>
  );
}
