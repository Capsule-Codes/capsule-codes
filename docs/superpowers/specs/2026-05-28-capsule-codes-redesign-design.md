# Capsule Codes — Visual Redesign Spec

**Date:** 2026-05-28
**Status:** Design approved, pending implementation plan
**Scope:** Full visual redesign of the public site + admin panel, no business logic or data shape changes.

---

## 1. Context

The current site uses a "generic agency template" visual language: cyan-green gradients, light-mode default, floating circles in the hero, cards with soft shadows, and stacked sections with mild differentiation. It is visually flat and indistinguishable from hundreds of similar studio sites.

The goal is to give Capsule Codes a **distinctive visual identity** rooted in the studio's name — "capsule" — while staying within the technical/craft aesthetic the team operates in (not experimental/maximalist).

This redesign is **visual and structural only**. It does NOT change:

- Data shapes (`Project`, `Technology`, `Review`, `ContactInfo`, `ContactMessage`)
- Business logic (Supabase queries, Azure image upload, contact form submission, auth)
- i18n keys (`lib/i18n.ts` keys stay; only consumption changes)
- Routing, API routes, server-side data fetching

---

## 2. Concept

**"Capsules as modular floating objects."**

Three sub-ideas merged into one visual language:

- **Modular** — every UI element worth highlighting is a pill/capsule shape. Capsules encapsulate labels, tags, status, capabilities. They are the atomic visual unit.
- **Physical** — capsules have subtle depth: inset highlight on top, inset shadow on bottom, gradient fill (top→bottom). They look like tangible objects, not flat tokens.
- **Atmospheric** — capsules live inside a dark, glow-tinted space. The hero feels like an atmosphere with capsules orbiting; the rest of the page is a calmer continuous canvas with localized glow accents.

The brand colors (cyan from logo, green from logo) are preserved and used as a **vertical gradient** for emphasis and the capsule's status dot.

---

## 3. Design System Foundations

### 3.1 Color (OKLCH tokens)

Replace existing tokens in `app/globals.css`.

**Dark mode (default, primary experience):**

| Token | Value | Use |
|---|---|---|
| `--ink-bg` | `oklch(0.07 0.005 200)` | Page background |
| `--ink-bg-2` | `oklch(0.09 0.008 200)` | Card / section panel |
| `--ink-fg` | `oklch(0.96 0 0)` | Primary text |
| `--ink-muted` | `oklch(0.62 0.02 200)` | Secondary text |
| `--ink-line` | `oklch(1 0 0 / 0.08)` | Borders, dividers |
| `--brand-cyan` | `oklch(0.7 0.18 200)` | Brand primary, eyebrow labels |
| `--brand-green` | `oklch(0.75 0.18 155)` | Brand secondary, capsule status dot |
| `--brand-grad` | `linear-gradient(180deg, oklch(0.85 0.16 195), oklch(0.72 0.18 155))` | Gradient for headlines, CTAs, capsule icons |

**Light mode (supported but secondary):** retained for accessibility/user preference but acknowledged to lose atmospheric strength. The capsule's bevel and glow are dialed back; the page background becomes near-white with subtle cyan tint; cards become near-white with `--ink-line` at higher contrast. Detailed light tokens to be derived during implementation.

**Semantic status colors** (used on capsule-style badges in admin):

| Status | Background | Text | Border |
|---|---|---|---|
| `published` / `success` | `oklch(0.4 0.18 155 / 0.2)` | `oklch(0.85 0.18 155)` | `oklch(0.5 0.18 155 / 0.4)` |
| `draft` / `warning` | `oklch(0.35 0.05 80 / 0.2)` | `oklch(0.85 0.15 80)` | `oklch(0.5 0.15 80 / 0.4)` |
| `unread` / `info` | `oklch(0.4 0.18 200 / 0.25)` | `oklch(0.85 0.18 200)` | `oklch(0.5 0.18 200 / 0.4)` |

### 3.2 Typography

Replace `geist` with two Google Fonts loaded via `next/font/google`:

- **Inter** (400, 500, 600, 700) — all UI text, headlines, body, form labels
- **JetBrains Mono** (400, 500, 600) — capsule labels, eyebrow section labels, technical accents, admin metadata, code-flavored copy

CSS variables: `--font-sans` (Inter), `--font-mono` (JetBrains Mono). Expose them in `@theme inline {}` per Tailwind v4.

**Type scale** (display sizes scaled down on mobile via `clamp()`):

| Role | Size | Weight | Letter-spacing | Font |
|---|---|---|---|---|
| Hero h1 | 60–64px | 600 | -0.045em | Inter |
| Section title | 38px | 600 | -0.035em | Inter |
| Section lead | 16px | 400 | 0 | Inter |
| Card title | 15–18px | 600 | -0.02em | Inter |
| Body | 13–15px | 400 | 0 | Inter |
| Eyebrow / label | 11px uppercase | 500 | 0.08em | JetBrains Mono |
| Capsule label | 10–14px | 500 | 0.01em | JetBrains Mono |

**Gradient text:** the gradient (`--brand-grad`) is applied to ONE emphasized word per heading using `background-clip: text`. Used in: hero keywords (3 of them), section titles (one word), select hero badge text.

### 3.3 The Capsule Component (atom)

New file: `components/ui/capsule.tsx`.

```tsx
type CapsuleProps = {
  size?: "sm" | "md" | "lg"          // default md
  variant?: "default" | "success" | "warning" | "info"  // for status capsules
  dot?: boolean                       // default true (green by default; semantic if variant)
  icon?: ReactNode                    // optional emoji/icon on the left
  children: ReactNode
}
```

**Visual spec:**
- Border-radius: `9999px` (full pill)
- Background: `linear-gradient(180deg, oklch(0.26 0.04 200), oklch(0.16 0.03 170))` for default; semantic for variants
- Border: `1px solid oklch(0.5 0.12 180 / 0.55)` (semantic for variants)
- Box-shadow stack:
  - `0 1px 0 oklch(1 0 0 / 0.1) inset` (highlight)
  - `0 -1px 0 oklch(0 0 0 / 0.3) inset` (depth)
  - `0 6px 16px oklch(0 0 0 / 0.4)` (drop shadow)
  - `0 0 24px oklch(0.55 0.15 180 / 0.2)` (atmospheric glow)
- Padding: sm `5px 12px`, md `8px 16px`, lg `12px 22px`
- Font: JetBrains Mono, 500 weight, size per size variant
- Dot (when `dot=true`): 6px circle, `--brand-green` (default) or semantic color, with matching `box-shadow` glow

Implemented with `class-variance-authority` for variant management.

### 3.4 Motion principles (level: "considered")

Approved level: middle-ground between subtle and maximalist. Implemented with **`motion`** library (formerly `framer-motion`).

| Element | Animation |
|---|---|
| Hero constellation capsules | Slow drift on mount (transform translate ±8px on each axis, 6–10s ease-in-out infinite, alternating); parallax on mousemove (max ±12px) |
| Section content | Scroll-triggered fade-in + translateY(8px), staggered by direct child, threshold 20% in viewport, once-only |
| Capsules on hover | `scale(1.02)` + glow intensity +20%, 200ms ease-out |
| Primary CTA buttons | Magnetic effect — translate toward cursor by max 6px when cursor within 120px |
| Ambient cursor glow | Radial blob (200px, `--brand-cyan` at 0.1 opacity, `blur(80px)`) follows cursor, throttled to ~60fps |
| Section dividers | Fade-in border-top using `inview` |

All animations respect `prefers-reduced-motion` and degrade to opacity-only / instant.

### 3.5 Layout architecture

**Page architecture:** "Hybrid" — hero is its own atmospheric world; remaining sections live on a continuous calmer canvas.

- Hero: dark canvas with two large radial-gradient glows (cyan top-center, green bottom-left), constellation of capsules positioned absolutely, subtle dot grain overlay.
- Sections below: solid `--ink-bg` background, separated by `border-top: 1px solid --ink-line` (no distinct backgrounds per section). Localized glow accents inside individual cards/elements only.

**Spacing:** generous vertical padding `py-[90px]` on sections, `py-[100px-120px]` on hero. Container max-width ~1200px with `px-8` (32px) on desktop, `px-4` on mobile.

---

## 4. Page Sections (homepage)

Sections stay in the **same order** as today, with one change: `ReviewsSection` is uncommented in `app/page.tsx`.

### 4.1 Header / Nav

Component: `components/header.tsx` (rewrite).

- Sticky, `backdrop-filter: blur(20px)` over `--ink-bg` at 70% opacity
- Layout: brand left | nav links (pill container) center | CTA right
- Brand: `capsule.codes` in JetBrains Mono 600, with the `.` in `--brand-cyan`
- Nav links: wrapped in a pill container with `oklch(1 0 0 / 0.04)` background. Active link gets `oklch(1 0 0 / 0.06)` bg. Smooth transition on hover.
- CTA "Contact" in gradient pill (`--brand-grad`)
- Behavior: hide on scroll-down past 200px, show on scroll-up
- Mobile: hamburger menu opens a full-page panel (overlay) with same pill nav styling

### 4.2 Hero

Component: `components/hero-section.tsx` (rewrite).

Layout (top to bottom, centered):
1. Constellation: 6 capsules positioned absolutely around the hero (`web platforms`, `mobile apps`, `fintech`, `edtech`, `react native`, `next.js` — labels static, NOT from admin). 2 high-opacity, 2 medium, 2 low (background depth). Subtle drift + mouse parallax.
2. Top capsule with ⚡ icon + `t.hero.badge` text
3. h1 with the 3 keywords (`t.hero.title.firstKeyword`, `.secondKeyword`, `.thirdKeyword`) wrapped in `<em>` to receive the gradient. Other text (`firstCommonText`, etc.) is plain `--ink-fg`.
4. Sub paragraph (`t.hero.subtitle`)
5. Stats pill bar — single horizontal pill containing 3 stat items separated by 1px dividers: `10+ Completed Projects · 8 Countries Served · 2 Apps in Stores`. Hardcoded numbers, labels from `t.hero.stats.*`.
6. Two CTAs (`t.hero.cta.viewProjects`, `.contact`): primary in gradient pill, ghost in subtle outline pill.

Background: two radial-gradient glows + 24px dot grain overlay (`background-image: radial-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px)`).

### 4.3 About

Component: `components/about-section.tsx` (rewrite).

- Eyebrow: `— 01 / About`
- Title: `t.about.title` with the last word(s) in gradient `<em>`
- Lead: `t.about.subtitle`
- **Mission row** (grid `1.2fr 1fr`):
  - Left: h3 `t.about.mission.title` (Who We Are) + 3 paragraphs from `t.about.mission.paragraph1/2/3`
  - Right: visual orb — `aspect-ratio: 1` panel with rotating `conic-gradient` ring + central circular orb containing `🐉` (preserved from current dragon, modernized). The "code flowing" animation is removed; replaced with the rotating ring (20s linear).
- **Values grid** (4 columns desktop, 2 columns tablet, 1 column mobile): each value card has:
  - Icon container (40x40 rounded square with gradient + glow)
  - Title (`t.about.values.X.title`)
  - Description (`t.about.values.X.description`)
  - Background: `oklch(0.1 0.008 200)`, border `--ink-line`, radial glow blur in top-right corner

### 4.4 Services

Component: `components/services-section.tsx` (rewrite).

- Eyebrow: `— 02 / Services`
- Title: `t.services.title` with last word in gradient
- Lead: `t.services.subtitle`
- Grid: 3 columns desktop, 2 tablet, 1 mobile. 6–7 service cards consuming the existing service translations (`web`, `mobile`, `backend`, `cloud`, `design`, `consulting`, `maintenance`).
- Each card: icon, title, description, `<Capsule>` tags from `features` array
- Hover: card border lifts to `--brand-cyan / 0.4`, subtle translateY(-2px)

### 4.5 Technologies (admin-driven)

Component: `components/technologies-section.tsx` (rewrite).

- Eyebrow: `— 03 / Technologies`
- Title + lead from `t.technologies.*`
- Display: capsule cloud (flex-wrap) of all technologies. Each tech rendered as a `<Capsule>` with the emoji icon (from `tech.icon` field) + name. No category grouping in the main display (categories preserved in admin only).
- Data: existing `technologies` prop from `getHomePageData()` — no shape change.

### 4.6 Team

Component: `components/team-section.tsx` (rewrite).

- Eyebrow: `— 04 / Team`
- Title from `t.team.title.firstPart` + `t.team.title.secondPart` (gradient on second part)
- Lead: `t.team.subtitle`
- **Co-Founders row** (label `— Co-Founders` in JetBrains Mono): 2 cards (Miguel, Facundo) with avatar circle + name + role + description
- **Developers row** (label `— Developers`): 3 cards (Marco, Lucas, Juan)
- Card: 52px avatar with brand gradient, name 15px/600, role in JetBrains Mono cyan, description 12.5px muted
- Data from `t.team.coFounders.*` and `t.team.developers.*` (no admin yet for team)

### 4.7 Projects (admin-driven)

Component: `components/projects-section.tsx` + `components/projects-carousel.tsx` (rewrite carousel).

- Eyebrow: `— 05 / Projects`
- Title + lead from `t.projects.*`
- Layout: bento-style grid (`grid-template-columns: 1.5fr 1fr 1fr`):
  - One featured project takes 2 rows (left, large)
  - Remaining projects fill the smaller cells
- Each project card:
  - Full-bleed background image from `project.image` (Azure) OR fallback to radial-gradient glow if no image
  - Bottom overlay (linear-gradient transparent → near-black)
  - Bottom-left content: category capsule (from `t.projects.categories.*` mapped from `project.category`), title (from translations), short description (featured card only)
- Featured: from `project.featured` flag (already in data shape)
- Published filter: only `project.published === true` rendered
- Carousel: replace embla-carousel for desktop with the bento grid above; keep carousel for mobile (horizontal swipe)

### 4.8 Reviews (admin-driven, NEW on homepage)

**Reactivate** by uncommenting in `app/page.tsx`. Component: `components/reviews-section.tsx` + `components/reviews-carousel.tsx` (rewrite).

- Eyebrow: `— 06 / Reviews`
- Centered head: title from `t.reviews.title` (gradient on last word), lead from `t.reviews.subtitle`
- Single visible review card at a time, centered, max-width ~760px:
  - Background: radial glow top + `--ink-bg-2`, rounded 24px, border with cyan tint
  - Large `"` mark in JetBrains Mono 60px, top-left, cyan at 0.4 opacity
  - Stars row (1–5 from `review.rating`) in amber
  - Quote text: 18px italic, centered, multi-language via `getReviewContent(review)` (existing logic)
  - Author block: 44px avatar (from `review.avatar` or initial fallback) + name + `position · company · location` in JetBrains Mono
- Controls below: prev/next round buttons + active-dot indicator
- Auto-play every 5s (preserve existing logic)
- Edge cases preserved:
  - No Supabase configured → render nothing
  - Empty reviews → render empty state (rewritten with new visual)
  - Error → render error state (rewritten with new visual)

### 4.9 Contact

Component: `components/contact-section.tsx` (rewrite).

- Eyebrow: `— 07 / Contact`
- Title + lead from `t.contact.*`
- Card: 2-column grid (`1fr 1.2fr`), radial glow top-right, cyan-tinted border
  - **Left:** info block. Heading + description from `t.contact.info.description`. Rows: email, phone, location, hours. Each row has JetBrains Mono cyan label (80px width) + value. Data from the `contactInfo` prop (admin-managed) — current behavior preserved.
  - **Right:** form (existing React Hook Form + zod logic preserved):
    - Row 1: Name + Email (2 columns)
    - Row 2: Company (full width, optional)
    - Row 3: Message (textarea, full width, min-height 120px)
    - Submit button (gradient pill) bottom-right
- Form labels: JetBrains Mono uppercase tracking, 10px
- Inputs: `oklch(0.06 0 0)` bg, `--ink-line` border, 10px radius
- Toast on submit success/error preserved (`sonner`)

### 4.10 Footer

Component: `components/footer.tsx` (rewrite).

- 4-column grid: Brand+tagline | Quick Links | Legal | Follow Us
- Column headers in JetBrains Mono cyan eyebrow style
- Links in muted text
- Bottom row: copyright left, `t.footer.quote` right (JetBrains Mono)
- Border-top separator

---

## 5. Admin Panel Redesign

Current state: `app/admin/page.tsx` is a single 81k file using `<Tabs>` from shadcn. We **preserve all business logic and state management** — only the visual shell and components change.

### 5.1 New shell layout

Replace the `<Tabs>` with a sidebar layout:

```
+-------------+--------------------------------+
| Sidebar     | Main content                   |
| (240px)     | (fluid)                        |
| - brand     | - topbar (title + actions)     |
| - nav       | - stats (optional per page)    |
| - user      | - content (table / form)       |
+-------------+--------------------------------+
```

**Sidebar** (`bg: oklch(0.05 0.005 200)`, border-right `--ink-line`):
- Top: brand `capsule.admin` (JetBrains Mono 600, cyan dot)
- Nav items (icon + label + optional count badge):
  - Dashboard
  - Projects (count from data)
  - Technologies (count)
  - Reviews (count)
  - Contact Info (no count)
  - Messages (count of unread)
- Active item: cyan-tinted background + border
- Bottom: user pill (avatar + name + "admin" label in mono) + logout

**Topbar** (per page):
- Left: page title (24px/600) + JetBrains Mono subtitle describing the page
- Right: search input (oklch dark) + primary action button (e.g., "+ New Project")

### 5.2 Page content patterns

**Dashboard view** (NEW, replaces login-only entry):
- 4 stat cards across the top: counts of Projects, Technologies, Reviews, Messages
- Each stat: JetBrains Mono uppercase label + large 26px value + trend microcopy in `--brand-green`
- Quick links to manage each entity
- Recent activity feed (optional, later iteration)

**List view** (Projects / Technologies / Reviews / Messages):
- Stats row (4 cards) showing relevant counts
- Table-style list inside a rounded card:
  - Header row: JetBrains Mono uppercase labels
  - Each row: thumbnail (where applicable) + primary text + JetBrains Mono sub-text + capsule badges for category/status + action buttons (edit/delete) on the right
- Hover: row highlights `oklch(1 0 0 / 0.03)`
- Status badges: use semantic capsule variants (published=success, draft=warning, unread=info)

**Form view** (edit/new dialog):
- Replace shadcn `<Dialog>` with the same modal but restyled to match the contact card aesthetic (radial glow + cyan border + dark bg)
- Form fields use the same input/label style as the public contact form
- Multilingual fields: tabbed mini-nav (`EN / ES / IT`) with capsule indicators showing translation completion (filled = complete, empty dot = missing)
- Image upload (Projects): grid of current images with delete-on-hover; drop-zone for new uploads with progress states
- Save/Cancel buttons: gradient primary + ghost ghost

### 5.3 What stays unchanged

- All state management (`useState`, `useSupabase`, `useAuth`, `useLanguage`)
- All CRUD handlers (`handleSaveProject`, `handleSaveTechnology`, etc.)
- Image compression + Azure upload flow
- Validation logic
- API routes (`/api/admin/*`)
- Auth flow (login form restyled but logic untouched)

### 5.4 Recommended split

The current 81k single file should be split into:

- `app/admin/layout.tsx` — sidebar shell, user, nav
- `app/admin/page.tsx` — dashboard (was the Tabs container)
- `app/admin/projects/page.tsx` — projects list + form
- `app/admin/technologies/page.tsx` — technologies list + form
- `app/admin/reviews/page.tsx` — reviews list + form
- `app/admin/contact-info/page.tsx` — contact info form
- `app/admin/messages/page.tsx` — messages inbox
- `components/admin/sidebar.tsx`, `components/admin/topbar.tsx`, `components/admin/stat-card.tsx`, `components/admin/list-row.tsx`, `components/admin/multilingual-tabs.tsx` — shared

The auth check (`useAuth` + redirect-to-login if not `isAdmin`) moves up into `app/admin/layout.tsx` so all sub-pages are gated at the layout level instead of repeating the check in each page. The login form itself stays as a fallback inside the layout when `!user`, restyled with the new system.

This split is part of this redesign because the current file is too large to maintain visually-consistent treatment in a single pass.

---

## 6. Technical Approach

### 6.1 What we keep

- Next.js 14 App Router
- Tailwind v4 (already on `4.1.9`)
- shadcn/ui Radix primitives (Dialog, Tabs, Select, etc.) — restyled via globals.css and the new tokens
- Supabase for data
- Resend for contact form
- Azure for project images
- next-themes for theme switching
- React Hook Form + zod for validation
- `sonner` for toasts

### 6.2 What we add

- `next/font/google` import of Inter + JetBrains Mono (replaces `geist` package)
- `motion` (formerly `framer-motion`) for animations
- `class-variance-authority` already present — used for the new Capsule component
- New utility classes / animations in `globals.css`

### 6.3 What we remove

- `geist` font package (replaced)
- Existing `@keyframes float`, `code-flow-*` keyframes in `globals.css` (replaced with new motion patterns)
- Dragon code-flow animations (replaced with conic-gradient ring orb)
- Light-mode-first defaults in next-themes (switch `defaultTheme="dark"`)

### 6.4 Files affected (estimated)

| Type | Count | Files |
|---|---|---|
| Modify | ~12 | All section components, header, footer, page.tsx, layout.tsx, globals.css, tailwind config |
| New | ~10 | Capsule component, admin layout pieces, motion utilities, new admin sub-pages |
| Delete | 0 | Nothing deleted; admin/page.tsx is split into multiple files but content preserved |

Full file inventory will be in the implementation plan.

---

## 7. Out of Scope

- Copy / content changes — the redesign uses existing `lib/i18n.ts` text verbatim
- Adding new translations (other than admin nav items if needed)
- Adding new sections, removing existing sections, or reordering
- Changing data models or migrations
- Changing the auth provider or admin permission model
- SEO content / metadata changes
- Mobile-app-style transitions or scroll-jacking
- WebGL / canvas-based visuals
- A separate "case study" page per project (current `app/projects/[id]/page.tsx` will be restyled with the new system as part of implementation, but no functional changes)

---

## 8. Acceptance Criteria

The redesign is complete when:

1. The public homepage renders all 8 sections (Hero → About → Services → Technologies → Team → Projects → Reviews → Contact → Footer) with the new visual language
2. The Reviews section is uncommented in `app/page.tsx` and renders correctly when Supabase data is present
3. All existing i18n strings render correctly in EN, ES, IT
4. All admin CRUD operations (Projects, Technologies, Reviews, Contact Info, Messages) continue to work without modification to business logic
5. Admin shell uses the new sidebar layout with the design system applied
6. Light mode still works (degraded but functional and accessible)
7. `prefers-reduced-motion` is respected
8. Lighthouse a11y score stays at or above current baseline
9. No regressions in contact form submission, image upload, auth flow

---

## 9. Open Questions / Followups

- Should the Team section become admin-editable as a follow-up? (Currently hardcoded in i18n.ts.) — Out of scope for this redesign, flag for next iteration.
- Light mode polish: dial of cyan tint in light backgrounds — to be decided during implementation when seen in context.
- Mobile constellation behavior: should the floating capsules be hidden on small screens to avoid clutter, or kept with reduced count? — Default: hide background-depth capsules (low opacity), keep 2 visible. Confirm during implementation.
- Should we add a Dashboard activity feed in admin? — Deferred to a follow-up; not blocking.
