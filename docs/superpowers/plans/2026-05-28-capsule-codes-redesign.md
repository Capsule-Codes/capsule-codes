# Capsule Codes Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the visual redesign defined in `docs/superpowers/specs/2026-05-28-capsule-codes-redesign-design.md` to the public site + admin panel, migrate Team to Supabase, and ship a first-class light mode.

**Architecture:** Phase-based execution. Phase 0 (foundation) and Phase 1 (Team data layer) can run in parallel. Phase 2 (public site) and Phase 3 (admin) both depend on Phase 0+1 and CAN run in parallel after they complete. Phase 4 is final QA/polish.

**Tech Stack:** Next.js 14 App Router, Tailwind v4 (CSS-first config), shadcn/ui Radix primitives, Supabase (data + auth), Resend (email), Azure Blob (project images), `motion` (formerly framer-motion) for animations, `next/font/google` for Inter + JetBrains Mono.

**Conventions:**
- Conventional commits, NO `Co-Authored-By` trailer
- Never run `npm run build` — only `npm run dev` for live verification
- Use `rg`, `fd`, `eza`, `bat` instead of `grep`/`find`/`ls`/`cat`
- One task = one focused commit
- Each phase ends with a `git log --oneline` sanity check

**No-test note:** The repo has no test framework. Verification is **visual via dev server** for UI work, **SQL/API curl** for data work. Do NOT add a test framework as part of this redesign — out of scope.

---

## Phase 0 — Foundation (must run first)

### Task 1: Swap font system (Geist → Inter + JetBrains Mono)

**Files:**
- Modify: `app/layout.tsx`
- Modify: `package.json`

- [ ] **Step 1: Add Google Fonts via next/font, replace geist imports**

Read `app/layout.tsx` first. Replace any geist imports/usage with:

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
```

Apply both variables on `<html>`:

```tsx
<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
```

Also set `defaultTheme="dark"` on the existing `ThemeProvider` wrapping `{children}` (next-themes).

- [ ] **Step 2: Remove geist dependency**

```bash
npm uninstall geist
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open http://localhost:3000. Page should render (will look broken until next tasks — that's OK). Check DevTools → Network: `Inter` and `JetBrainsMono` font files load. No 404s.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx package.json package-lock.json
git commit -m "feat: swap geist for inter + jetbrains mono via next/font"
```

---

### Task 2: Replace globals.css with new design system tokens

**Files:**
- Modify: `app/globals.css` (full rewrite)

- [ ] **Step 1: Read current globals.css to know what's there**

```bash
bat /Users/facundo/Desktop/Projects/personal/capsule-codes-website/app/globals.css
```

- [ ] **Step 2: Replace contents entirely**

Replace the whole file with this. Note: this preserves the Tailwind v4 `@theme inline {}` pattern from the current file.

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* === DARK MODE (default, primary experience) === */
:root,
.dark {
  --ink-bg: oklch(0.07 0.005 200);
  --ink-bg-2: oklch(0.09 0.008 200);
  --ink-fg: oklch(0.96 0 0);
  --ink-muted: oklch(0.62 0.02 200);
  --ink-line: oklch(1 0 0 / 0.08);
  --ink-line-strong: oklch(1 0 0 / 0.14);

  --brand-cyan: oklch(0.7 0.18 200);
  --brand-green: oklch(0.75 0.18 155);

  --cap-bg: linear-gradient(180deg, oklch(0.26 0.04 200), oklch(0.16 0.03 170));
  --cap-border: oklch(0.5 0.12 180 / 0.55);
  --cap-shadow: 0 1px 0 oklch(1 0 0 / 0.1) inset, 0 -1px 0 oklch(0 0 0 / 0.3) inset, 0 6px 16px oklch(0 0 0 / 0.4), 0 0 24px oklch(0.55 0.15 180 / 0.2);

  --status-success-bg: oklch(0.4 0.18 155 / 0.2);
  --status-success-fg: oklch(0.85 0.18 155);
  --status-success-border: oklch(0.5 0.18 155 / 0.4);
  --status-warning-bg: oklch(0.35 0.05 80 / 0.2);
  --status-warning-fg: oklch(0.85 0.15 80);
  --status-warning-border: oklch(0.5 0.15 80 / 0.4);
  --status-info-bg: oklch(0.4 0.18 200 / 0.25);
  --status-info-fg: oklch(0.85 0.18 200);
  --status-info-border: oklch(0.5 0.18 200 / 0.4);

  --radius: 0.875rem;

  /* shadcn compat — map to new tokens */
  --background: var(--ink-bg);
  --foreground: var(--ink-fg);
  --card: var(--ink-bg-2);
  --card-foreground: var(--ink-fg);
  --popover: var(--ink-bg-2);
  --popover-foreground: var(--ink-fg);
  --primary: var(--brand-cyan);
  --primary-foreground: oklch(0.07 0 0);
  --secondary: var(--brand-green);
  --secondary-foreground: oklch(0.07 0 0);
  --muted: var(--ink-bg-2);
  --muted-foreground: var(--ink-muted);
  --accent: var(--brand-green);
  --accent-foreground: oklch(0.07 0 0);
  --destructive: oklch(0.6 0.22 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: var(--ink-line);
  --input: var(--ink-bg-2);
  --ring: var(--brand-cyan);
}

/* === LIGHT MODE (first-class, equally polished) === */
.light {
  --ink-bg: oklch(0.985 0.003 200);
  --ink-bg-2: oklch(0.97 0.005 200);
  --ink-fg: oklch(0.16 0 0);
  --ink-muted: oklch(0.45 0.02 200);
  --ink-line: oklch(0 0 0 / 0.08);
  --ink-line-strong: oklch(0 0 0 / 0.14);

  --brand-cyan: oklch(0.5 0.18 210);
  --brand-green: oklch(0.55 0.18 160);

  --cap-bg: linear-gradient(180deg, oklch(1 0 0), oklch(0.96 0.005 200));
  --cap-border: oklch(0.4 0.12 200 / 0.25);
  --cap-shadow: 0 1px 0 oklch(1 0 0) inset, 0 -1px 0 oklch(0 0 0 / 0.08) inset, 0 4px 12px oklch(0.4 0.1 200 / 0.12);

  --status-success-bg: oklch(0.55 0.18 155 / 0.15);
  --status-success-fg: oklch(0.4 0.18 155);
  --status-success-border: oklch(0.55 0.18 155 / 0.4);
  --status-warning-bg: oklch(0.7 0.15 80 / 0.18);
  --status-warning-fg: oklch(0.45 0.15 80);
  --status-warning-border: oklch(0.55 0.15 80 / 0.4);
  --status-info-bg: oklch(0.55 0.18 200 / 0.15);
  --status-info-fg: oklch(0.35 0.18 200);
  --status-info-border: oklch(0.55 0.18 200 / 0.4);

  --background: var(--ink-bg);
  --foreground: var(--ink-fg);
  --card: var(--ink-bg-2);
  --card-foreground: var(--ink-fg);
  --popover: var(--ink-bg-2);
  --popover-foreground: var(--ink-fg);
  --primary: var(--brand-cyan);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: var(--brand-green);
  --secondary-foreground: oklch(0.98 0 0);
  --muted: var(--ink-bg-2);
  --muted-foreground: var(--ink-muted);
  --accent: var(--brand-green);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.55 0.22 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: var(--ink-line);
  --input: var(--ink-bg-2);
  --ring: var(--brand-cyan);
}

@theme inline {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ink-bg: var(--ink-bg);
  --color-ink-bg-2: var(--ink-bg-2);
  --color-ink-fg: var(--ink-fg);
  --color-ink-muted: var(--ink-muted);
  --color-ink-line: var(--ink-line);
  --color-brand-cyan: var(--brand-cyan);
  --color-brand-green: var(--brand-green);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-sans; }
  html { color-scheme: dark; }
  .light html { color-scheme: light; }
}

/* === New animations === */
@keyframes capsule-drift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(4px, -6px); }
  50% { transform: translate(-3px, -8px); }
  75% { transform: translate(-5px, -2px); }
}

@keyframes conic-spin {
  to { transform: rotate(360deg); }
}

@keyframes orbit {
  to { transform: rotate(360deg); }
}

.animate-capsule-drift { animation: capsule-drift 8s ease-in-out infinite; }
.animate-conic-spin { animation: conic-spin 20s linear infinite; }
.animate-orbit { animation: orbit 12s linear infinite; }

/* Brand gradient utility */
.brand-grad {
  background: linear-gradient(180deg, oklch(0.85 0.16 195), oklch(0.72 0.18 155));
}
.light .brand-grad {
  background: linear-gradient(180deg, oklch(0.55 0.18 200), oklch(0.5 0.18 160));
}
.text-brand-grad {
  background: linear-gradient(180deg, oklch(0.85 0.16 195), oklch(0.72 0.18 155));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.light .text-brand-grad {
  background: linear-gradient(180deg, oklch(0.55 0.18 200), oklch(0.5 0.18 160));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Page should render in dark mode by default (near-black bg, light text). Old layout will look broken; new tokens are in place. Toggle to light theme via browser DevTools → add `light` class on html — page should turn near-white with darker text.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace design tokens with capsule-codes redesign system (dark + light)"
```

---

### Task 3: Build Capsule atomic component

**Files:**
- Create: `components/ui/capsule.tsx`

- [ ] **Step 1: Create the file**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const capsuleVariants = cva(
  "relative z-[2] inline-flex items-center gap-2 rounded-full font-mono font-medium tracking-[0.01em] transition-[transform,box-shadow] duration-200 ease-out",
  {
    variants: {
      size: {
        sm: "px-3 py-[5px] text-[10px] gap-1.5",
        md: "px-4 py-2 text-xs gap-2",
        lg: "px-5 py-3 text-sm gap-2",
      },
      variant: {
        default:
          "text-white border bg-[image:var(--cap-bg)] border-[color:var(--cap-border)] shadow-[var(--cap-shadow)]",
        success:
          "border bg-[color:var(--status-success-bg)] text-[color:var(--status-success-fg)] border-[color:var(--status-success-border)]",
        warning:
          "border bg-[color:var(--status-warning-bg)] text-[color:var(--status-warning-fg)] border-[color:var(--status-warning-border)]",
        info:
          "border bg-[color:var(--status-info-bg)] text-[color:var(--status-info-fg)] border-[color:var(--status-info-border)]",
      },
      interactive: {
        true: "hover:scale-[1.02] hover:brightness-110 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: { size: "md", variant: "default", interactive: false },
  }
);

interface CapsuleProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof capsuleVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Capsule = React.forwardRef<HTMLSpanElement, CapsuleProps>(
  ({ className, size, variant, interactive, dot = true, icon, children, ...props }, ref) => {
    const dotColor =
      variant === "success" ? "var(--status-success-fg)" :
      variant === "warning" ? "var(--status-warning-fg)" :
      variant === "info" ? "var(--status-info-fg)" :
      "var(--brand-green)";

    return (
      <span ref={ref} className={cn(capsuleVariants({ size, variant, interactive }), className)} {...props}>
        {dot && (
          <span
            aria-hidden
            className="block size-1.5 rounded-full"
            style={{
              backgroundColor: dotColor,
              boxShadow: variant === "default" ? `0 0 8px ${dotColor}` : "none",
            }}
          />
        )}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);
Capsule.displayName = "Capsule";
```

- [ ] **Step 2: Visual sanity-check by dropping it temporarily into hero**

Edit `components/hero-section.tsx`, near the existing Badge, add temporarily:

```tsx
import { Capsule } from "@/components/ui/capsule";
// ... inside the JSX, near the Badge:
<div className="flex gap-2 flex-wrap justify-center my-4">
  <Capsule size="sm">small</Capsule>
  <Capsule>medium · default</Capsule>
  <Capsule size="lg">large</Capsule>
  <Capsule dot={false}>no dot</Capsule>
  <Capsule variant="success">published</Capsule>
  <Capsule variant="warning">draft</Capsule>
  <Capsule variant="info">unread</Capsule>
</div>
```

Run `npm run dev`, open homepage. Confirm capsules render with gradient bg + glow + colored dot + bevel shadows. Hover should NOT scale (not interactive by default). Remove the temporary markup after verifying.

- [ ] **Step 3: Commit**

```bash
git add components/ui/capsule.tsx
git commit -m "feat: add Capsule atomic component with size, variant, and dot variants"
```

---

### Task 4: Build motion + section header utilities

**Files:**
- Create: `components/motion/scroll-reveal.tsx`
- Create: `components/motion/magnetic.tsx`
- Create: `components/motion/ambient-cursor-glow.tsx`
- Create: `components/motion/parallax-constellation.tsx`
- Create: `components/ui/section-header.tsx`
- Modify: `package.json` (add `motion`)

- [ ] **Step 1: Install motion library**

```bash
npm install motion
```

- [ ] **Step 2: Create `components/motion/scroll-reveal.tsx`**

```tsx
"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article";
}

export function ScrollReveal({ children, delay = 0, className, as = "div" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
```

- [ ] **Step 3: Create `components/motion/magnetic.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode, type HTMLAttributes } from "react";

interface MagneticProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strength?: number;
}

export function Magnetic({ children, strength = 0.25, className, ...rest }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    x.set(Math.max(-8, Math.min(8, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create `components/motion/ambient-cursor-glow.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export function AmbientCursorGlow() {
  const { resolvedTheme } = useTheme();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 50, damping: 14, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 50, damping: 14, mass: 0.6 });

  useEffect(() => {
    if (resolvedTheme !== "dark") return;
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [resolvedTheme, x, y]);

  if (resolvedTheme !== "dark") return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        width: 400, height: 400,
        background: "radial-gradient(circle, oklch(0.6 0.18 200 / 0.08), transparent 60%)",
        filter: "blur(60px)",
      }}
      className="pointer-events-none fixed left-0 top-0 z-0"
    />
  );
}
```

- [ ] **Step 5: Create `components/motion/parallax-constellation.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

interface ParallaxConstellationProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxConstellation({ children, className }: ParallaxConstellationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 14 });
  const sy = useSpring(y, { stiffness: 60, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px * -24);
    y.set(py * -24);
  };

  return (
    <motion.div ref={ref} onMouseMove={onMove} className={className}>
      <motion.div style={{ x: sx, y: sy }}>{children}</motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 6: Create `components/ui/section-header.tsx`**

```tsx
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
```

- [ ] **Step 7: Verify build via dev server**

```bash
npm run dev
```

No console errors related to missing imports. (Components aren't used yet — just verifying they compile.)

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json components/motion components/ui/section-header.tsx
git commit -m "feat: add motion utilities and SectionHeader primitive"
```

---

## Phase 1 — Team Data Layer (parallel-safe with Phase 0)

### Task 5: Create `team_members` Supabase table

**Files:**
- (DB only — apply via Supabase MCP)

- [ ] **Step 1: Inspect existing tables to match conventions**

Use Supabase MCP `list_tables` for the public schema. Note column naming (snake_case), timestamp columns (`created_at`, `updated_at`), id type (uuid), and how `translations` JSONB is shaped on `projects`/`reviews`.

- [ ] **Step 2: Apply migration via MCP**

Use `mcp__supabase__apply_migration` with name `create_team_members` and this SQL:

```sql
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('cofounder', 'developer')),
  name text NOT NULL,
  avatar_url text,
  display_order integer NOT NULL DEFAULT 0,
  translations jsonb NOT NULL DEFAULT '{
    "en": {"role": "", "description": ""},
    "es": {"role": "", "description": ""},
    "it": {"role": "", "description": ""}
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX team_members_type_order_idx ON public.team_members(type, display_order);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public read (mirror of projects/reviews policy)
CREATE POLICY "team_members_read_all" ON public.team_members
  FOR SELECT USING (true);

-- Service role write only (admin API routes use service key)
CREATE POLICY "team_members_write_service" ON public.team_members
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS team_members_updated_at ON public.team_members;
CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

NOTE: if `set_updated_at()` already exists in the schema, the `CREATE OR REPLACE` is harmless. Verify after via MCP `list_tables`.

- [ ] **Step 3: Verify**

Use MCP `list_tables` again — confirm `team_members` is present with the columns above. Use `execute_sql` to run `SELECT * FROM public.team_members;` — should return empty.

- [ ] **Step 4: Document the migration**

Create `docs/migrations/2026-05-28-team-members.md` with the SQL above for archival/replay reference, then:

```bash
mkdir -p docs/migrations
# write the file with the SQL block above as content
git add docs/migrations/2026-05-28-team-members.md
git commit -m "feat(db): add team_members table with RLS + updated_at trigger"
```

---

### Task 6: Add TeamMember type + server fetcher

**Files:**
- Modify: `lib/data-context.tsx` (add `TeamMember` type to export)
- Modify: `lib/server/data.ts` (add `getTeamMembers` + extend `getHomePageData`)

- [ ] **Step 1: Read current `lib/data-context.tsx` to see how Project/Review types are declared**

```bash
bat /Users/facundo/Desktop/Projects/personal/capsule-codes-website/lib/data-context.tsx | head -80
```

- [ ] **Step 2: Add TeamMember type alongside the existing exports in `lib/data-context.tsx`**

```ts
export type TeamMemberTranslation = { role: string; description: string };

export type TeamMember = {
  id: string;
  type: "cofounder" | "developer";
  name: string;
  avatar_url: string | null;
  display_order: number;
  translations: {
    en: TeamMemberTranslation;
    es: TeamMemberTranslation;
    it: TeamMemberTranslation;
  };
  created_at: string;
  updated_at: string;
};
```

- [ ] **Step 3: Add fetcher in `lib/server/data.ts`**

After the `getReviews` function, add:

```ts
import type { TeamMember } from "@/lib/data-context";

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not configured");
    return [];
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .order("type", { ascending: true })       // cofounder before developer (alphabetical)
      .order("display_order", { ascending: true });
    if (error) {
      console.error("Error fetching team members:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}
```

Then update `getHomePageData`:

```ts
export async function getHomePageData() {
  const [projects, technologies, reviews, contactInfo, teamMembers] = await Promise.all([
    getProjects(),
    getTechnologies(),
    getReviews(),
    getContactInfo(),
    getTeamMembers(),
  ]);
  return { projects, technologies, reviews, contactInfo, teamMembers };
}
```

- [ ] **Step 4: Verify dev server compiles**

```bash
npm run dev
```

No TS errors in terminal.

- [ ] **Step 5: Commit**

```bash
git add lib/data-context.tsx lib/server/data.ts
git commit -m "feat: add TeamMember type and getTeamMembers server fetcher"
```

---

### Task 7: Add Team API routes + extend supabase-context

**Files:**
- Create: `app/api/admin/team-members/route.ts`
- Create: `app/api/admin/team-members/[id]/route.ts`
- Modify: `lib/supabase-context.tsx`

- [ ] **Step 1: Inspect an existing API admin route for pattern**

```bash
bat /Users/facundo/Desktop/Projects/personal/capsule-codes-website/app/api/admin/reviews/route.ts
fd "route.ts" /Users/facundo/Desktop/Projects/personal/capsule-codes-website/app/api/admin/reviews
```

- [ ] **Step 2: Create `app/api/admin/team-members/route.ts`** (GET all, POST new)

Mirror the structure of `app/api/admin/reviews/route.ts` exactly, swapping the table name to `team_members`. Fields accepted on POST: `type`, `name`, `avatar_url`, `display_order`, `translations`. Return shape: same row.

- [ ] **Step 3: Create `app/api/admin/team-members/[id]/route.ts`** (PUT, DELETE)

Mirror `app/api/admin/reviews/[id]/route.ts`.

- [ ] **Step 4: Extend `lib/supabase-context.tsx`**

Add to the interface:

```ts
teamMembers: TeamMember[];
addTeamMember: (member: Omit<TeamMember, "id" | "created_at" | "updated_at">) => Promise<TeamMember | void>;
updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
deleteTeamMember: (id: string) => Promise<void>;
```

Add state: `const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);`

In `loadData`, add `fetch("/api/admin/team-members", { cache: "no-store" })` to the `Promise.all` and set its result.

Add handlers `addTeamMember` / `updateTeamMember` / `deleteTeamMember` mirroring the existing `addReview` / `updateReview` / `deleteReview` pattern, hitting `/api/admin/team-members(/:id)`.

Add `teamMembers, addTeamMember, updateTeamMember, deleteTeamMember` to the provider value.

Import `TeamMember` from `./data-context` at the top.

- [ ] **Step 5: Verify dev server compiles**

```bash
npm run dev
```

Hit http://localhost:3000/api/admin/team-members — should return `[]` (empty JSON array). No 500.

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/team-members lib/supabase-context.tsx
git commit -m "feat(api): add team-members admin endpoints and context handlers"
```

---

### Task 8: Seed `team_members` from current i18n content

**Files:**
- Create: `scripts/seed-team-members.ts`
- Run once

- [ ] **Step 1: Write the seed script**

```ts
// scripts/seed-team-members.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { translations } from "../lib/i18n";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !serviceKey) throw new Error("Missing Supabase env vars");

const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

type Trans = { role: string; description: string };

function rowFor(
  type: "cofounder" | "developer",
  name: string,
  order: number,
  en: Trans, es: Trans, it: Trans
) {
  return {
    type,
    name,
    avatar_url: null,
    display_order: order,
    translations: { en, es, it },
  };
}

async function run() {
  const en = translations.en.team;
  const es = translations.es.team;
  const it = translations.it.team;

  const rows = [
    rowFor("cofounder", en.coFounders.miguel.name, 0,
      { role: en.coFounders.miguel.role, description: en.coFounders.miguel.description },
      { role: es.coFounders.miguel.role, description: es.coFounders.miguel.description },
      { role: it.coFounders.miguel.role, description: it.coFounders.miguel.description }),
    rowFor("cofounder", en.coFounders.facundo.name, 1,
      { role: en.coFounders.facundo.role, description: en.coFounders.facundo.description },
      { role: es.coFounders.facundo.role, description: es.coFounders.facundo.description },
      { role: it.coFounders.facundo.role, description: it.coFounders.facundo.description }),
    rowFor("developer", en.developers.marco.name, 0,
      { role: en.developers.marco.role, description: en.developers.marco.description },
      { role: es.developers.marco.role, description: es.developers.marco.description },
      { role: it.developers.marco.role, description: it.developers.marco.description }),
    rowFor("developer", en.developers.lucas.name, 1,
      { role: en.developers.lucas.role, description: en.developers.lucas.description },
      { role: es.developers.lucas.role, description: es.developers.lucas.description },
      { role: it.developers.lucas.role, description: it.developers.lucas.description }),
    rowFor("developer", en.developers.juan.name, 2,
      { role: en.developers.juan.role, description: en.developers.juan.description },
      { role: es.developers.juan.role, description: es.developers.juan.description },
      { role: it.developers.juan.role, description: it.developers.juan.description }),
  ];

  // Idempotency: delete-by-name then insert
  const names = rows.map(r => r.name);
  const { error: delErr } = await sb.from("team_members").delete().in("name", names);
  if (delErr) throw delErr;

  const { error: insErr, data } = await sb.from("team_members").insert(rows).select();
  if (insErr) throw insErr;

  console.log(`Seeded ${data?.length ?? 0} team members.`);
}

run().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Run it**

```bash
npx tsx scripts/seed-team-members.ts
```

Expected output: `Seeded 5 team members.`

If `tsx` isn't installed: `npm install -D tsx` first, then run.

- [ ] **Step 3: Verify rows landed**

Via Supabase MCP `execute_sql`: `SELECT id, type, name, display_order FROM team_members ORDER BY type, display_order;` — should list 5 rows: 2 cofounders, 3 developers.

- [ ] **Step 4: Commit the script (so we can replay if needed)**

```bash
git add scripts/seed-team-members.ts package.json package-lock.json
git commit -m "chore: add seed script for team_members from i18n content"
```

---

### Task 9: Remove migrated team-member content from i18n.ts

**Files:**
- Modify: `lib/i18n.ts` (remove `coFounders` and `developers` keys from all 3 languages, also from the `Translations` interface)

- [ ] **Step 1: Update the `Translations` interface in `lib/i18n.ts`**

In the `team` block, remove:

```ts
  coFounders: { miguel: {...}; facundo: {...}; };
  developers: { marco: {...}; lucas: {...}; juan: {...}; };
```

Keep `title`, `subtitle`, `coFoundersTitle`, `developersTitle` (the section labels).

- [ ] **Step 2: Remove the corresponding data from each `en`, `es`, `it` entries**

Use `rg` to find them:

```bash
rg -n "coFounders|developers:" /Users/facundo/Desktop/Projects/personal/capsule-codes-website/lib/i18n.ts
```

Delete the `coFounders: { miguel: {...}, facundo: {...} }` and `developers: { marco: {...}, lucas: {...}, juan: {...} }` blocks from `en.team`, `es.team`, `it.team`. **Keep** `title`, `subtitle`, `coFoundersTitle`, `developersTitle`.

- [ ] **Step 3: Find any remaining references to those keys (will be in team-section.tsx, handled later in Task 17 but compile must not break now)**

```bash
rg -n "t\.team\.coFounders|t\.team\.developers" /Users/facundo/Desktop/Projects/personal/capsule-codes-website
```

If `components/team-section.tsx` still references them, leave a `// TODO migrate in Task 17` placeholder ONLY if absolutely necessary to keep dev server compiling. Otherwise stub out the section temporarily:

```tsx
// in team-section.tsx, replace member-mapping JSX with:
return <section id="team" className="py-20"><div className="container">team migration pending</div></section>;
```

This stub is replaced in Task 17.

- [ ] **Step 4: Verify dev server compiles**

```bash
npm run dev
```

No TS errors. Homepage renders (team section will be a placeholder).

- [ ] **Step 5: Commit**

```bash
git add lib/i18n.ts components/team-section.tsx
git commit -m "refactor(i18n): remove team-member content (now in team_members table)"
```

---

## Phase 2 — Public Homepage Redesign (depends on Phase 0+1 complete)

> All Phase 2 tasks share these conventions:
> - Use the `Capsule` component for tags/badges
> - Use `SectionHeader` for eyebrow + title + lead
> - Wrap section content in `ScrollReveal` where it adds value (don't over-animate)
> - Section padding: `py-[90px] px-8 lg:px-12`
> - Sections live on `bg-background`, separated by `border-t border-[color:var(--ink-line)]`
> - Use `useLanguage()` for copy — don't change i18n keys (except where Phase 1 already removed them)
> - Reference the spec sections 4.1 → 4.10 for exact content and structure

### Task 10: Header redesign

**Files:**
- Modify: `components/header.tsx` (full rewrite)

- [ ] **Step 1: Read current header.tsx + simple-language-switcher.tsx to see what's there**

```bash
bat /Users/facundo/Desktop/Projects/personal/capsule-codes-website/components/header.tsx
```

- [ ] **Step 2: Rewrite per spec §4.1**

Key elements:
- Brand `capsule.codes` (JetBrains Mono 600, `.` in `text-[color:var(--brand-cyan)]`)
- Center nav links wrapped in pill container `bg-white/[0.04] border border-[color:var(--ink-line)] rounded-full p-1`
- Active link bg `bg-white/[0.06]`, inactive `text-[color:var(--ink-muted)]`
- Right: Magnetic-wrapped `Contact` CTA (`brand-grad` rounded-full)
- Sticky with `backdrop-blur-xl bg-background/70`
- Hide-on-scroll-down behavior: useState + scroll listener tracking direction, hide after 200px scroll-down, show on scroll-up
- Language switcher: keep `SimpleLanguageSwitcher` (data-driven), restyle wrapper to pill aesthetic
- Mobile: hamburger toggling a full-page overlay with the same pill nav

Wrap CTA with `<Magnetic>` from `components/motion/magnetic`. Use existing `useLanguage()` for nav labels (`t.nav.*`).

- [ ] **Step 3: Verify visually**

`npm run dev`. Header should be dark, sticky, pill-styled. Scroll down/up to confirm hide-on-scroll. Toggle language to confirm i18n still works.

- [ ] **Step 4: Commit**

```bash
git add components/header.tsx
git commit -m "feat(ui): redesign header with pill nav, sticky blur, hide-on-scroll"
```

---

### Task 11: Hero redesign

**Files:**
- Modify: `components/hero-section.tsx` (full rewrite)

- [ ] **Step 1: Rewrite per spec §4.2**

Structure (top to bottom, centered):

```tsx
"use client";
import { Capsule } from "@/components/ui/capsule";
import { ParallaxConstellation } from "@/components/motion/parallax-constellation";
import { Magnetic } from "@/components/motion/magnetic";
import { useLanguage } from "@/hooks/use-language";
import { Zap, ArrowRight } from "lucide-react";

export function HeroSection() {
  const { t } = useLanguage();
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden">
      {/* atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,oklch(0.45_0.22_185_/_0.45),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_30%_80%,oklch(0.4_0.2_155_/_0.3),transparent_70%)]" />
        <div className="absolute inset-0 [background-image:radial-gradient(oklch(1_0_0_/_0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      </div>

      {/* constellation — 6 on md+, 2 on mobile */}
      <ParallaxConstellation className="absolute inset-0 pointer-events-none">
        <Capsule size="sm" className="absolute top-[18%] left-[8%] rotate-[-6deg] animate-capsule-drift opacity-90">web platforms</Capsule>
        <Capsule size="sm" className="absolute top-[14%] right-[12%] rotate-[5deg] animate-capsule-drift opacity-90" style={{ animationDelay: "1s" }}>mobile apps</Capsule>
        {/* the remaining 4 are hidden on mobile */}
        <Capsule size="sm" className="absolute top-[70%] left-[6%] rotate-[2deg] opacity-60 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "2s" }}>fintech</Capsule>
        <Capsule size="sm" className="absolute top-[75%] right-[9%] rotate-[-4deg] opacity-60 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "3s" }}>edtech</Capsule>
        <Capsule size="sm" dot={false} className="absolute top-[42%] left-[14%] rotate-[3deg] opacity-30 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "1.5s" }}>react native</Capsule>
        <Capsule size="sm" dot={false} className="absolute top-[38%] right-[16%] rotate-[-3deg] opacity-30 hidden md:inline-flex animate-capsule-drift" style={{ animationDelay: "2.5s" }}>next.js</Capsule>
      </ParallaxConstellation>

      <div className="container mx-auto px-4 lg:px-12 py-[100px] lg:py-[120px] text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <Capsule icon={<Zap className="w-3 h-3" />} className="mb-7">{t.hero.badge}</Capsule>

          <h1 className="font-sans text-4xl md:text-6xl lg:text-[60px] leading-[1.02] font-semibold tracking-[-0.045em] mb-6 text-balance max-w-[920px] mx-auto">
            {t.hero.title.firstCommonText}{" "}
            <em className="not-italic text-brand-grad">{t.hero.title.firstKeyword}</em>{" "}
            {t.hero.title.secondCommonText}{" "}
            <em className="not-italic text-brand-grad">{t.hero.title.secondKeyword}</em>{" "}
            {t.hero.title.thirdCommonText}{" "}
            <em className="not-italic text-brand-grad">{t.hero.title.thirdKeyword}</em>
          </h1>

          <p className="text-base md:text-lg text-[color:var(--ink-muted)] mb-10 max-w-[620px] mx-auto text-pretty leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* stats pill bar */}
          <div className="inline-flex items-stretch gap-2 mb-10 p-2 bg-white/[0.03] border border-[color:var(--ink-line)] rounded-full backdrop-blur-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-[color:var(--ink-muted)]"><span className="font-mono font-semibold text-[color:var(--ink-fg)]">10+</span> {t.hero.stats.projects}</div>
            <div className="w-px self-center h-4 bg-[color:var(--ink-line)]" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-[color:var(--ink-muted)]"><span className="font-mono font-semibold text-[color:var(--ink-fg)]">8</span> {t.hero.stats.countries}</div>
            <div className="w-px self-center h-4 bg-[color:var(--ink-line)]" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs text-[color:var(--ink-muted)]"><span className="font-mono font-semibold text-[color:var(--ink-fg)]">2</span> {t.hero.stats.apps}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Magnetic>
              <button onClick={() => scroll("projects")} className="brand-grad text-black rounded-full px-6 py-3 text-sm font-semibold shadow-[0_6px_22px_oklch(0.5_0.16_180_/_0.4)] inline-flex items-center gap-2">
                {t.hero.cta.viewProjects} <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => scroll("contact")} className="bg-white/[0.05] text-[color:var(--ink-fg)] border border-white/[0.1] rounded-full px-6 py-3 text-sm font-medium inline-flex items-center gap-2">
                {t.hero.cta.contact}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

`npm run dev`. Hero shows constellation, big headline with 3 gradient words, stats pill, two CTAs. Move mouse — constellation parallaxes. Mobile DevTools — only 2 constellation capsules visible at < 768px.

- [ ] **Step 3: Commit**

```bash
git add components/hero-section.tsx
git commit -m "feat(ui): redesign hero with constellation, gradient keywords, magnetic CTAs"
```

---

### Task 12: About redesign

**Files:**
- Modify: `components/about-section.tsx` (full rewrite)

- [ ] **Step 1: Rewrite per spec §4.3**

Key structure:
- Eyebrow `— 01 / About`
- Title `t.about.title` — split last word with `text-brand-grad`
- Lead: `t.about.subtitle`
- Mission row: 2-col grid `[1.2fr_1fr]`
  - Left: `<h3>{t.about.mission.title}</h3>` + 3 paragraphs (`paragraph1/2/3`)
  - Right: `aspect-square` panel with conic-gradient ring (`animate-conic-spin`) + central 100px orb (linear-gradient + glow) containing `🐉`
- Values grid: 4 columns (`md:grid-cols-2 lg:grid-cols-4`) — each card with icon (40x40 gradient square), title, description
- Wrap each value card in `ScrollReveal` with staggered `delay={index * 0.08}`

Use `Capsule` ONLY if it adds value — about section is mostly typography/cards, not capsules.

Reference the spec for exact visual treatment. Use `t.about.values.precision/innovation/speed/collaboration` for the 4 values.

- [ ] **Step 2: Verify**

`npm run dev` → about section renders with dragon orb, 3 paragraphs, and 4 value cards. Scroll into view triggers reveal.

- [ ] **Step 3: Commit**

```bash
git add components/about-section.tsx
git commit -m "feat(ui): redesign about with conic-gradient dragon orb and value cards"
```

---

### Task 13: Services redesign

**Files:**
- Modify: `components/services-section.tsx` (full rewrite)

- [ ] **Step 1: Rewrite per spec §4.4**

Key structure:
- Eyebrow `— 02 / Services`
- Title `t.services.title` (gradient on last word) + lead
- 3-col grid on desktop, 2 on tablet, 1 on mobile
- Each service card: bg `var(--ink-bg-2)`, border, 16px radius, padding 28px
  - Icon container (40x40 with gradient + glow)
  - Title from `t.services.X.title`
  - Description from `t.services.X.description`
  - Tags via `Capsule size="sm" dot={false}` for each `t.services.X.features[i]`
- Render 6 services in this order: `web, mobile, backend, cloud, design, consulting`. Omit `maintenance` (spec says 6 cards visible — confirm with spec §4.4 which lists 6–7; choose 6 for clean 3x2 grid)
- Hover: card translateY(-2px) + border shifts to `border-[color:var(--brand-cyan)]/40`
- Wrap each card in `ScrollReveal` with staggered delay

- [ ] **Step 2: Verify**

Services section renders 6 cards with icons, descriptions, and capsule tags. Hover lifts cards.

- [ ] **Step 3: Commit**

```bash
git add components/services-section.tsx
git commit -m "feat(ui): redesign services with 3-column card grid and capsule tags"
```

---

### Task 14: Technologies redesign

**Files:**
- Modify: `components/technologies-section.tsx` (full rewrite)

- [ ] **Step 1: Rewrite per spec §4.5**

Key structure:
- Receives `technologies: Technology[]` prop (already passed from page.tsx)
- Eyebrow `— 03 / Technologies`
- Title `t.technologies.title` (gradient) + lead
- Capsule cloud: `flex flex-wrap gap-2.5` of all technologies. Each tech rendered as:

```tsx
<Capsule key={tech.id} dot={false} icon={<span>{tech.icon}</span>}>
  {tech.name}
</Capsule>
```

- Categories preserved in data but NOT shown in cloud (admin uses them for grouping)
- Wrap cloud in `ScrollReveal`

- [ ] **Step 2: Verify**

Technologies section renders all techs as capsules. Icon (emoji) + name visible.

- [ ] **Step 3: Commit**

```bash
git add components/technologies-section.tsx
git commit -m "feat(ui): redesign technologies as capsule cloud"
```

---

### Task 15: Team redesign (consumes Supabase `team_members`)

**Files:**
- Modify: `components/team-section.tsx` (full rewrite, replace the Task 9 stub)
- Modify: `app/page.tsx` (pass `teamMembers` prop)

- [ ] **Step 1: Update `app/page.tsx`**

```tsx
const { projects, technologies, reviews, contactInfo, teamMembers } = await getHomePageData();
// ...
<TeamSection teamMembers={teamMembers} />
```

- [ ] **Step 2: Rewrite `components/team-section.tsx`** per spec §4.6

```tsx
"use client";
import { useLanguage } from "@/hooks/use-language";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { TeamMember } from "@/lib/data-context";

interface TeamSectionProps { teamMembers: TeamMember[] }

export function TeamSection({ teamMembers }: TeamSectionProps) {
  const { t, language } = useLanguage();

  const cofounders = teamMembers.filter((m) => m.type === "cofounder");
  const developers = teamMembers.filter((m) => m.type === "developer");

  const tr = (m: TeamMember) => m.translations[language] ?? m.translations.en;

  return (
    <section id="team" className="py-[90px] px-8 lg:px-12 border-t border-[color:var(--ink-line)]">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="— 04 / Team"
          title={<>{t.team.title.firstPart} <em className="not-italic text-brand-grad">{t.team.title.secondPart}</em></>}
          lead={t.team.subtitle}
        />

        <div className="mt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mb-4">— {t.team.coFoundersTitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cofounders.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 0.08}>
                <MemberCard name={m.name} role={tr(m).role} description={tr(m).description} avatarUrl={m.avatar_url} />
              </ScrollReveal>
            ))}
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)] mt-9 mb-4">— {t.team.developersTitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {developers.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 0.08}>
                <MemberCard name={m.name} role={tr(m).role} description={tr(m).description} avatarUrl={m.avatar_url} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberCard({ name, role, description, avatarUrl }: { name: string; role: string; description: string; avatarUrl: string | null }) {
  return (
    <div className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6">
      <div className="flex items-center gap-3.5 mb-3.5">
        <div className="size-[52px] rounded-full shrink-0 bg-gradient-to-br from-[oklch(0.4_0.15_180)] to-[oklch(0.5_0.18_155)] shadow-[0_0_16px_oklch(0.5_0.15_180_/_0.3)] overflow-hidden">
          {avatarUrl && <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />}
        </div>
        <div>
          <h5 className="text-[15px] font-semibold leading-tight">{name}</h5>
          <span className="font-mono text-[10px] text-[color:var(--brand-cyan)] tracking-[0.04em]">{role}</span>
        </div>
      </div>
      <p className="text-[12.5px] text-[color:var(--ink-muted)] leading-[1.55]">{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Homepage `/` should render Team section with 2 cofounders + 3 developers from Supabase. Switching language updates role/description.

- [ ] **Step 4: Commit**

```bash
git add components/team-section.tsx app/page.tsx
git commit -m "feat(ui): redesign team section, consume team_members from Supabase"
```

---

### Task 16: Projects redesign (bento + carousel)

**Files:**
- Modify: `components/projects-section.tsx`
- Modify: `components/projects-carousel.tsx`

- [ ] **Step 1: Rewrite per spec §4.7**

- Eyebrow `— 05 / Projects`, title (gradient last word), lead from `t.projects.*`
- Filter `projects.filter(p => p.published)`
- Layout: desktop `grid-cols-[1.5fr_1fr_1fr] grid-rows-2`, mobile carousel via embla (existing dep)
- Featured project: `featured === true` → `row-span-2` and shows description
- Each project card:
  - Background image (`project.image`) with `bg-cover bg-center`, fallback to radial-gradient when no image
  - Bottom overlay (linear-gradient transparent → near-black)
  - Bottom-left: category Capsule (map `project.category` → `t.projects.categories.X`) + title + (featured only) short description from `getProjectContent(project, language)`
- On mobile: keep the existing embla carousel but restyle each slide with the new card look. Cards are full-width on mobile.

- [ ] **Step 2: Verify**

Projects section shows bento layout on desktop, carousel on mobile. Images render. Categories shown as capsules.

- [ ] **Step 3: Commit**

```bash
git add components/projects-section.tsx components/projects-carousel.tsx
git commit -m "feat(ui): redesign projects with bento grid (desktop) + carousel (mobile)"
```

---

### Task 17: Reviews redesign + uncomment in page.tsx

**Files:**
- Modify: `components/reviews-section.tsx`
- Modify: `components/reviews-carousel.tsx`
- Modify: `app/page.tsx` (uncomment `<ReviewsSection />`)

- [ ] **Step 1: Rewrite per spec §4.8**

`reviews-section.tsx`:
- Eyebrow `— 06 / Reviews`, centered SectionHeader using `t.reviews.title` (gradient last word) + lead
- Pass reviews to `<ReviewsCarousel reviews={reviews} />`

`reviews-carousel.tsx`:
- Single visible review at a time, max-w `760px`, centered
- Review card: `bg-[radial-gradient(ellipse_at_top,oklch(0.4_0.18_180_/_0.2),transparent_60%),var(--ink-bg-2)] border border-[color:var(--brand-cyan)]/40 rounded-3xl p-11`
- Large `"` mark in JetBrains Mono 60px, top-left absolute, cyan/40
- Stars: 5 `★` icons, filled per `review.rating` in amber `text-[color:oklch(0.85_0.16_90)]`
- Quote: 18px italic, centered, max-w 580px (use existing `getReviewContent` for translation)
- Author block: 44px avatar + name + JetBrains Mono `position · company` row
- Controls below: prev/next round buttons + active-dot indicator
- Preserve all existing logic: auto-play 5s, `isSupabaseConfigured` early return, empty/error states (restyled with the new dark theme)

`app/page.tsx`:
- Uncomment the import line
- Uncomment `<ReviewsSection reviews={reviews} />` between Projects and Contact

- [ ] **Step 2: Verify**

Reviews section appears between Projects and Contact. Auto-plays through reviews. Stars + quote + author render.

- [ ] **Step 3: Commit**

```bash
git add components/reviews-section.tsx components/reviews-carousel.tsx app/page.tsx
git commit -m "feat(ui): redesign reviews and reactivate on homepage"
```

---

### Task 18: Contact redesign

**Files:**
- Modify: `components/contact-section.tsx`

- [ ] **Step 1: Rewrite per spec §4.9**

- Eyebrow `— 07 / Contact`, title from `t.contact.title` (gradient last word), lead
- Card: 2-col grid `[1fr_1.2fr]`, `bg-[radial-gradient(ellipse_at_top_right,oklch(0.4_0.18_180_/_0.25),transparent_60%),var(--ink-bg-2)] border border-[color:var(--brand-cyan)]/40 rounded-3xl p-9`
- Left: heading + description from `t.contact.info.description`, then rows for email / phone / location / hours from `contactInfo` prop (admin-managed); each row has JetBrains Mono cyan label (80px width) + value, separated by `border-t border-[color:var(--ink-line)]`
- Right: form (preserve existing react-hook-form + zod + Resend logic), restyled:
  - Inputs: `bg-[color:oklch(0.06_0_0)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm`
  - Labels: `font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5`
  - Submit: `brand-grad` rounded-full pill bottom-right, wrap in `<Magnetic>`
- Preserve toast on success/error (sonner)

- [ ] **Step 2: Verify**

Contact card renders with info on left, form on right. Submit a test message — should still hit the API + Resend successfully.

- [ ] **Step 3: Commit**

```bash
git add components/contact-section.tsx
git commit -m "feat(ui): redesign contact section with split card and form restyle"
```

---

### Task 19: Footer redesign

**Files:**
- Modify: `components/footer.tsx` (full rewrite)

- [ ] **Step 1: Rewrite per spec §4.10**

4-column grid: Brand+tagline | Quick Links | Legal | Follow Us. Column headers JetBrains Mono cyan eyebrow style. Border-top bottom row with copyright + `t.footer.quote`. Theme toggle next to copyright (use `useTheme` from next-themes; toggle button shows sun/moon icon).

- [ ] **Step 2: Verify**

Footer renders with 4 columns + bottom bar. Theme toggle works → switching to light triggers Phase 0 light tokens; switching back to dark restores.

- [ ] **Step 3: Commit**

```bash
git add components/footer.tsx
git commit -m "feat(ui): redesign footer with 4-col grid and theme toggle"
```

---

### Task 20: Mount AmbientCursorGlow + verify full homepage

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add `<AmbientCursorGlow />` near the root of body**

```tsx
import { AmbientCursorGlow } from "@/components/motion/ambient-cursor-glow";
// inside <body>:
<AmbientCursorGlow />
{children}
```

- [ ] **Step 2: Visual full-page sweep**

`npm run dev`. Scroll the entire homepage from top to bottom in dark mode. Check:
- Hero renders with constellation
- About has dragon orb
- Services 6-card grid
- Tech capsule cloud
- Team 2 cofounders + 3 devs (loaded from Supabase)
- Projects bento
- Reviews carousel
- Contact split card
- Footer 4-col
- Cursor glow blob follows mouse (dark mode only)
- Toggling to light mode — cursor glow disappears, atmospheric glows attenuate, capsules look right on light bg

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(ui): mount ambient cursor glow"
```

---

## Phase 3 — Admin Restructure (can run in parallel with Phase 2 after Phase 0+1)

### Task 21: New admin layout shell + auth gate + login restyle

**Files:**
- Modify: `app/admin/layout.tsx` (full rewrite, replace the current 340-byte file)
- Create: `components/admin/sidebar.tsx`
- Create: `components/admin/login-form.tsx`

- [ ] **Step 1: Create `components/admin/sidebar.tsx`** per spec §5.1

Sidebar component:
- Brand `capsule.admin` (JetBrains Mono with `.` in cyan)
- Nav items array: Overview (`/admin`), Projects (`/admin/projects`), Technologies (`/admin/technologies`), Team (`/admin/team`), Reviews (`/admin/reviews`), Contact Info (`/admin/contact-info`), Messages (`/admin/messages`)
- Each item: icon + label + optional count Capsule. Count fetched from `useSupabase()` context (for unread Messages: filter status === "unread")
- Active item: cyan-tinted bg + border based on `usePathname()`
- Bottom: user avatar + name + "admin" + logout button + theme toggle

- [ ] **Step 2: Create `components/admin/login-form.tsx`**

Move the existing login JSX from `app/admin/page.tsx` here, restyle:
- Centered card with the new contact-card aesthetic (radial glow + cyan border + dark bg)
- Inputs in new style (`bg-[color:oklch(0.06_0_0)]` etc.)
- Brand-grad submit button

Component uses `useAuth().signIn` directly. Receive `loginError` as a prop OR manage internally — keep self-contained.

- [ ] **Step 3: Rewrite `app/admin/layout.tsx`**

```tsx
"use client";
import { useAuth } from "@/hooks/use-auth";
import { SupabaseProvider } from "@/lib/supabase-context";
import { Sidebar } from "@/components/admin/sidebar";
import { LoginForm } from "@/components/admin/login-form";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-6 h-6 animate-spin text-[color:var(--brand-cyan)]" />
    </div>
  );

  if (!user || !isAdmin) return (
    <SupabaseProvider>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <LoginForm />
      </div>
    </SupabaseProvider>
  );

  return (
    <SupabaseProvider>
      <div className="min-h-screen grid grid-cols-[240px_1fr] bg-background">
        <Sidebar />
        <main className="overflow-x-auto">{children}</main>
      </div>
    </SupabaseProvider>
  );
}
```

- [ ] **Step 4: Verify**

Visit `/admin`. If not authenticated → see new LoginForm. After login → see Sidebar layout + (Task 22's overview, currently empty page).

- [ ] **Step 5: Commit**

```bash
git add app/admin/layout.tsx components/admin/sidebar.tsx components/admin/login-form.tsx
git commit -m "feat(admin): new shell layout with sidebar, auth gate, restyled login"
```

---

### Task 22: Admin overview page (`/admin`)

**Files:**
- Modify: `app/admin/page.tsx` (full rewrite, replacing the 81k file)
- Create: `components/admin/overview-card.tsx`

- [ ] **Step 1: Create `components/admin/overview-card.tsx`**

Card showing eyebrow label, title, one-line description, count Capsule + arrow icon. Renders as a Next.js `<Link>`. Hover: border shifts to cyan.

- [ ] **Step 2: Replace `app/admin/page.tsx`** entirely

```tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/lib/supabase-context";
import { OverviewCard } from "@/components/admin/overview-card";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { projects, technologies, reviews, contactMessages, teamMembers } = useSupabase();

  const unreadCount = contactMessages.filter((m) => m.status === "unread").length;
  const name = user?.email?.split("@")[0] ?? "admin";

  return (
    <div className="p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Hi, {name} 👋</h1>
        <p className="font-mono text-[11px] text-[color:var(--ink-muted)] mt-1">signed in as admin</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard href="/admin/projects"     eyebrow="— content"  title="Projects"     description="Manage published work, images and translations" count={projects.length} />
        <OverviewCard href="/admin/technologies" eyebrow="— content"  title="Technologies" description="Tools and stack featured on the homepage"        count={technologies.length} />
        <OverviewCard href="/admin/team"         eyebrow="— content"  title="Team"         description="Cofounders and developers shown on the home page"   count={teamMembers.length} />
        <OverviewCard href="/admin/reviews"      eyebrow="— content"  title="Reviews"      description="Client testimonials, multilingual, with ratings"  count={reviews.length} />
        <OverviewCard href="/admin/contact-info" eyebrow="— settings" title="Contact Info" description="Email, phone, location displayed on contact section" />
        <OverviewCard href="/admin/messages"     eyebrow="— inbox"    title="Messages"     description="Contact form submissions"                          count={unreadCount} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

`/admin` (after login) shows the 6 overview cards. Each one navigates correctly (cards lead to placeholder 404 for now — populated in Tasks 23-28).

- [ ] **Step 4: Commit**

```bash
git add app/admin/page.tsx components/admin/overview-card.tsx
git commit -m "feat(admin): replace 81k single-page admin with overview landing"
```

---

### Tasks 23–28: Admin sub-pages

Each sub-page extracts the relevant entity's CRUD logic from the **original** `app/admin/page.tsx` (preserved in git history) into its own page. The original `app/admin/page.tsx` is now the overview from Task 22; the old admin file's content lives in git for reference (use `git show HEAD~N:app/admin/page.tsx` if needed during extraction).

Shared admin pieces — create these once before starting:

- Create: `components/admin/topbar.tsx` — page title + subtitle + action area (search input + primary CTA)
- Create: `components/admin/list-row.tsx` — generic table row with thumb / primary col / capsule badge slots / action buttons
- Create: `components/admin/multilingual-tabs.tsx` — 3-language tab nav (EN/ES/IT) with completion-state Capsule indicator per tab

### Task 23: `app/admin/projects/page.tsx`

**Files:**
- Create: `app/admin/projects/page.tsx`
- Read: original `app/admin/page.tsx` from git history (`git show HEAD~1:app/admin/page.tsx | rg -A 300 "Projects.*Tab"`)

- [ ] **Step 1: Build the page**

Reuses `Topbar` + `list-row` for the project list (thumb from `project.image`, primary col with title/translations, category Capsule, status Capsule `published`/`draft`, action buttons). Dialog for new/edit with `MultilingualTabs` for the 3-language form fields.

Preserve ALL existing logic: `handleEditProject`, `handleSaveProject`, `handleDeleteProject`, image upload to Azure via `/api/admin/projects/[id]/images`, image deletion, primary-image fallback, `validateImageFiles` + `compressImages`.

Reuse Radix `<Dialog>` from shadcn — just restyle the inner content with the new design system.

- [ ] **Step 2: Verify**

Navigate to `/admin/projects`. List shows the same projects. Click `+ New Project` → dialog opens with multilingual form. Edit/delete still work. Image upload still hits Azure.

- [ ] **Step 3: Commit**

```bash
git add app/admin/projects components/admin/topbar.tsx components/admin/list-row.tsx components/admin/multilingual-tabs.tsx
git commit -m "feat(admin): extract Projects into its own page with restyled CRUD"
```

### Task 24: `app/admin/technologies/page.tsx`

**Files:**
- Create: `app/admin/technologies/page.tsx`

- [ ] **Step 1: Build the page**

Mirrors Projects pattern but simpler — no image upload, no multilingual content (technologies have a `translations` field but it's just `name` per language). List row: icon emoji + name + category Capsule + actions. Dialog for new/edit using existing `handleSaveTechnology` logic.

- [ ] **Step 2: Verify**

`/admin/technologies` shows existing technologies. Add, edit, delete still work.

- [ ] **Step 3: Commit**

```bash
git add app/admin/technologies
git commit -m "feat(admin): extract Technologies into its own page"
```

### Task 25: `app/admin/team/page.tsx` (NEW entity)

**Files:**
- Create: `app/admin/team/page.tsx`

- [ ] **Step 1: Build the page**

CRUD for team members. List row: avatar (or placeholder if `avatar_url` null) + name + role (from current-language translation) + type Capsule (`cofounder` / `developer`) + display_order + actions.

Dialog form fields:
- `type` select (cofounder/developer)
- `name` input
- `avatar_url` input (URL only — no upload for now; same as current reviews `avatar` field. Image upload is a Phase 5+ followup)
- `display_order` number input
- `MultilingualTabs` containing `role` and `description` for each of EN/ES/IT

Use `addTeamMember`, `updateTeamMember`, `deleteTeamMember` from `useSupabase()`.

- [ ] **Step 2: Verify**

`/admin/team` shows the 5 seeded members. Edit one's role description → save → public homepage `/team` reflects the change (after refresh).

- [ ] **Step 3: Commit**

```bash
git add app/admin/team
git commit -m "feat(admin): add Team management page (CRUD for team_members)"
```

### Task 26: `app/admin/reviews/page.tsx`

**Files:**
- Create: `app/admin/reviews/page.tsx`

- [ ] **Step 1: Build the page**

CRUD for reviews. List row: avatar (or fallback initial) + author + company + rating stars + actions.

Dialog form: existing logic preserved — `handleSaveReview`, `handleAvatarSelect`, avatar upload through `/api/admin/avatars` (if exists; otherwise URL-only). `MultilingualTabs` for the 4 multilingual fields (`text`, `author`, `company`, `position`).

- [ ] **Step 2: Verify**

`/admin/reviews` works for add/edit/delete with multilingual content. Stars editable 1-5.

- [ ] **Step 3: Commit**

```bash
git add app/admin/reviews
git commit -m "feat(admin): extract Reviews into its own page"
```

### Task 27: `app/admin/contact-info/page.tsx`

**Files:**
- Create: `app/admin/contact-info/page.tsx`

- [ ] **Step 1: Build the page**

Wrap the existing `<ContactInfoSettings />` component (currently in `components/admin/contact-info-settings.tsx`) with the new Topbar + section padding. Restyle the form inside `ContactInfoSettings` to match new input style (or leave for a quick visual pass — the component is already self-contained).

- [ ] **Step 2: Verify**

`/admin/contact-info` shows the existing settings form. Save updates info — reflected on public `/contact` section.

- [ ] **Step 3: Commit**

```bash
git add app/admin/contact-info
git commit -m "feat(admin): extract Contact Info into its own page"
```

### Task 28: `app/admin/messages/page.tsx`

**Files:**
- Create: `app/admin/messages/page.tsx`

- [ ] **Step 1: Build the page**

Wrap the existing `<ContactMessages />` component (`components/admin/contact-messages.tsx`) with Topbar. Stat cards row across the top: total messages, unread count, replied count, archived count. Below: list with status Capsules (`unread` info, `read` muted, `replied` success, `archived` warning).

- [ ] **Step 2: Verify**

`/admin/messages` shows existing messages with stats. Changing status updates the Capsule color.

- [ ] **Step 3: Commit**

```bash
git add app/admin/messages
git commit -m "feat(admin): extract Messages into its own page with status stats"
```

---

## Phase 4 — Polish & Validation

### Task 29: Light-mode visual sweep

**Files:** none (validation only — fixes inline as needed)

- [ ] **Step 1: Toggle light, walk every page**

`npm run dev`. Toggle to light mode via footer theme toggle. Walk:
- Homepage: hero, all sections, footer
- `/admin` overview
- `/admin/projects` list + dialog
- `/admin/team` list + dialog

Verify:
- Capsule reads cleanly on light bg (no over-glow, no missing border)
- Status capsules legible (published/draft/unread/read/replied/archived)
- Hero atmospheric glows attenuated (subtle, not garish)
- Section borders visible
- Form inputs readable

- [ ] **Step 2: Fix any contrast/legibility issue inline**

Most fixes will be in `globals.css` `.light { ... }` token block. If a specific component overrides poorly, fix in that component.

- [ ] **Step 3: Commit any fixes**

```bash
git add -p   # cherry-pick only fixes
git commit -m "fix(ui): light mode polish across pages"
```

If no fixes needed, no commit.

---

### Task 30: Mobile responsive sweep

**Files:** none (validation)

- [ ] **Step 1: Open dev tools mobile view (iPhone 12 viewport, 390x844)**

Walk the homepage. Confirm:
- Header: hamburger appears, full-page overlay menu works
- Hero: only 2 constellation capsules visible (not 6)
- Hero CTAs stacked vertically
- Services: 1-column grid
- Team: 1-column grid
- Projects: carousel works (swipe)
- Reviews: card fits, controls accessible
- Contact: form stacks below info

Walk `/admin` — sidebar collapses or shows hamburger (acceptable: sidebar hidden on mobile, page content fills screen, hamburger toggles sidebar overlay).

- [ ] **Step 2: Fix any layout breaks inline**

- [ ] **Step 3: Commit fixes**

```bash
git add -p
git commit -m "fix(ui): mobile responsive layout fixes"
```

---

### Task 31: `prefers-reduced-motion` + a11y sweep

**Files:** none (validation)

- [ ] **Step 1: Enable reduced motion in OS settings (or DevTools → rendering → emulate CSS media `prefers-reduced-motion: reduce`)**

Reload homepage. Confirm:
- Hero constellation does NOT drift
- Section reveals are instant (no fade-in)
- Cursor ambient glow does NOT track
- Hover capsule scales are gone

The globals.css rule from Task 2 handles most of this. Motion components should check `useReducedMotion()` from `motion/react` and disable mouse-driven effects if needed.

- [ ] **Step 2: Quick a11y check**

- Tab through hero CTAs — focus visible
- Tab through nav — focus visible
- Form inputs have labels
- Lighthouse a11y audit (Chrome DevTools) — should stay ≥ baseline (run before any change as comparison)

- [ ] **Step 3: Fix issues inline; commit**

```bash
git add -p
git commit -m "fix(a11y): reduced-motion handling and focus visibility"
```

---

### Task 32: Final cleanup

**Files:**
- Delete any stale/unused files left over from the redesign (e.g., old `simple-language-switcher.tsx` if it became unused, old keyframes that survived)

- [ ] **Step 1: Find unused exports**

```bash
rg -l "animate-float|animate-pulse-glow|code-flow-" /Users/facundo/Desktop/Projects/personal/capsule-codes-website
```

If no remaining references, ensure they're already removed from `globals.css` (Task 2 should have removed them). If any residual references, remove.

- [ ] **Step 2: Check for stale `simple-language-switcher.tsx` / `debug-language-switcher.tsx`**

```bash
rg -l "simple-language-switcher|debug-language-switcher" /Users/facundo/Desktop/Projects/personal/capsule-codes-website/{app,components}
```

If still in use → leave. If not → delete + commit.

- [ ] **Step 3: Phase audit**

```bash
git log --oneline main..HEAD
```

Expected: ~30 commits, all conventional, no `Co-Authored-By`.

- [ ] **Step 4: Final commit (if anything pending)**

```bash
git add -A
git commit -m "chore: cleanup stale files and unused animations" || echo "nothing to clean"
```

---

## Acceptance — Final Checklist

Tick off before declaring done:

- [ ] Homepage renders all sections in order: Hero → About → Services → Tech → Team → Projects → Reviews → Contact → Footer
- [ ] Reviews section is uncommented and renders when reviews exist
- [ ] Three languages (EN/ES/IT) all switchable, no missing keys, team translations from DB work
- [ ] All admin CRUD works: Projects (with Azure images), Technologies, Team (NEW), Reviews, Contact Info, Messages
- [ ] Admin shell is sidebar-based; `/admin` is overview hub, not stats dashboard
- [ ] Light mode is functional + visually intentional across all pages
- [ ] Mobile: 2 hero constellation capsules, sections stack, carousel works, hamburger menu works
- [ ] `prefers-reduced-motion` removes drift/reveals
- [ ] No regressions in contact form submission (test send and confirm Resend delivers)
- [ ] No regression in auth flow (login/logout still works)
- [ ] Lighthouse a11y ≥ baseline

---

## Followups (NOT part of this plan — see spec §10)

- Per-project case study pages (`app/projects/[id]`) restyled with new system in a follow-up
- Avatar upload for team members (currently URL-only)
- Activity feed in admin
- Editable Hero/About/Services/Footer copy from admin
