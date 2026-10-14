"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe } from "lucide-react"
import { SiteImage } from "@/components/site-image"
import { Capsule } from "@/components/ui/capsule"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { Markdown, InlineMarkdown } from "@/components/markdown"
import { BrowserFrame, PhoneFrame } from "@/components/projects-showcase/device-frame"
import { ProjectLightbox } from "@/components/project-lightbox"
import { getCategoryLabel, getProjectContent } from "@/components/projects-carousel"
import { useLanguage, useLocalePath } from "@/hooks/use-language"
import type { Project, ProjectImage } from "@/lib/data-context"
import { getCaseStudyLocale } from "@/lib/case-study"
import {
  desktopGalleryLayout,
  getProjectCover,
  getProjectScreenshots,
  isPortraitImage,
  type GalleryTile,
} from "@/lib/project-media"
import { cn } from "@/lib/utils"

export interface NextProjectSummary {
  id: string
  title: string
  subtitle: string | null
  image: string | null
}

interface ProjectDetailClientProps {
  project: Project
  nextProject: NextProjectSummary | null
}

/** Hero cover: full width on mobile, ~half the 1200px column on desktop. */
const COVER_SIZES = "(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw"
const PHONE_SIZES = "(min-width: 1024px) 220px, (min-width: 768px) 25vw, 62vw"
const DESKTOP_SIZES = "(min-width: 1280px) 590px, (min-width: 768px) 50vw, 85vw"

/** Desktop tiles on the lg 6-column grid (see `desktopGalleryLayout`). */
const TILE_CLASS: Record<GalleryTile, string> = {
  featured: "lg:col-span-4 lg:row-span-2",
  third: "lg:col-span-2",
  half: "lg:col-span-3",
  full: "lg:col-span-6",
}

/** Balanced phone columns on desktop: 8 -> 4+4 instead of 5+3, never fewer than 4. */
function phoneColumns(count: number): number {
  if (count <= 5) return Math.max(count, 4)
  return Math.max(4, Math.ceil(count / Math.ceil(count / 5)))
}

const pillBase =
  "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
const pillGhost = cn(
  pillBase,
  "border border-[color:var(--ink-line-strong)] bg-[color:var(--hover-bg)] text-[color:var(--ink-fg)] hover:bg-[color:var(--hover-bg-strong)]",
)
const pillPrimary = cn(pillBase, "brand-grad text-on-grad font-semibold")

function AppleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.02-2.07 1.69-3.06 1.77-3.11-.96-1.41-2.46-1.6-3-1.62-1.28-.13-2.5.75-3.15.75-.65 0-1.66-.73-2.73-.71-1.4.02-2.69.81-3.41 2.07-1.45 2.52-.37 6.25 1.04 8.29.69 1 1.51 2.12 2.58 2.08 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.6.67 2.69.65 1.11-.02 1.82-1.02 2.5-2.02.79-1.16 1.11-2.28 1.13-2.34-.03-.01-2.17-.83-2.19-3.29zM15 5.13c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-.99 1.58-.87 2.51.91.07 1.85-.46 2.42-1.14z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.27c-.2.21-.31.53-.31.95v17.56c0 .42.11.74.31.95l.06.05L13.5 12v-.02L3.66 2.22l-.06.05zM17.1 15.62l-3.6-3.6v-.04l3.6-3.6.08.05 4.27 2.42c1.22.69 1.22 1.83 0 2.53l-4.27 2.42-.08-.18zM13.5 12.02l3.6 3.6L5.9 21.96c-.4.23-.78.21-1.04 0l8.64-9.94zM4.86 2.04c.26-.21.64-.23 1.04 0l11.2 6.34-3.6 3.6L4.86 2.04z" />
    </svg>
  )
}

/** Title with the last word in the brand gradient, like the section headers. */
function GradientTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  const last = words.pop() ?? ""
  return (
    <>
      {words.length > 0 && `${words.join(" ")} `}
      <em className="not-italic text-brand-grad">{last}</em>
    </>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--brand-cyan)]">
      {children}
    </div>
  )
}

/** Editorial section: eyebrow + heading on the left, content on the right (desktop). */
function StorySection({
  index,
  title,
  children,
  wide = false,
}: {
  index: number
  title: string
  children: ReactNode
  wide?: boolean
}) {
  const number = String(index).padStart(2, "0")
  return (
    <section className="border-t border-[color:var(--ink-line)] py-14 lg:py-20">
      <ScrollReveal
        className={cn(
          "grid gap-6",
          !wide && "lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16",
        )}
      >
        <div>
          <Eyebrow>— {number}</Eyebrow>
          <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] lg:text-[32px]">
            {title}
          </h2>
        </div>
        <div className="min-w-0">{children}</div>
      </ScrollReveal>
    </section>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--ink-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium leading-snug text-[color:var(--ink-fg)]">{value}</dd>
    </div>
  )
}

export function ProjectDetailClient({ project, nextProject }: ProjectDetailClientProps) {
  const { t, language } = useLanguage()
  const localePath = useLocalePath()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const content = getProjectContent(project, language)
  const story = getCaseStudyLocale(project.caseStudy, language)
  const meta = project.caseStudy?.meta ?? null
  const cs = t.caseStudy

  const cover = getProjectCover(project)
  const screenshots = getProjectScreenshots(project)
  // Phone shots (portrait) go in device frames in a strip; everything else is
  // treated as a desktop/landscape shot and shown larger in a browser frame.
  const phones = screenshots.filter((img) => isPortraitImage(img))
  const desktops = screenshots.filter((img) => !isPortraitImage(img))
  const desktopTiles = desktopGalleryLayout(desktops.length)
  // Lightbox order = render order: phones first, then desktop shots.
  const galleryImages: ProjectImage[] = [...phones, ...desktops]
  const lightboxImages = galleryImages.map((img, i) => ({
    src: img.blobKey,
    alt: `${content.title} — ${i + 1}`,
  }))

  const links = {
    web: meta?.links?.web ?? project.liveUrl,
    appStore: meta?.links?.appStore ?? project.appStoreUrl,
    googlePlay: meta?.links?.googlePlay ?? project.playStoreUrl,
  }
  const summary = story?.summary ?? content.description

  // Number only the sections that actually render.
  let sectionIndex = 0
  const nextIndex = () => ++sectionIndex

  const metaItems = meta
    ? [
        { label: cs.client, value: meta.client },
        { label: cs.industry, value: meta.industry },
        { label: cs.year, value: String(meta.year) },
        { label: cs.countries, value: meta.countries.join(", ") },
        { label: cs.platforms, value: meta.platforms.join(" · ") },
        { label: cs.role, value: meta.role },
      ].filter((item) => item.value)
    : []

  return (
    <article className="mx-auto w-full max-w-[1200px]">
      {/* Back link */}
      <Link
        href={localePath("/projects")}
        className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        {t.projects.backToProjects}
      </Link>

      {/* Hero */}
      <header className="grid items-center gap-10 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pb-20">
        <div className="min-w-0">
          <Capsule size="sm">{getCategoryLabel(project.category, t)}</Capsule>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]">
            <GradientTitle text={content.title} />
          </h1>
          {content.subtitle && (
            <p className="mt-4 text-lg font-medium leading-snug text-[color:var(--ink-fg)]/90 lg:text-xl">
              {content.subtitle}
            </p>
          )}
          {summary && (
            <p className="mt-4 max-w-[60ch] text-base leading-[1.65] text-[color:var(--ink-muted)]">
              {summary}
            </p>
          )}

          {metaItems.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[color:var(--ink-line)] pt-6 sm:grid-cols-3">
              {metaItems.map((item) => (
                <MetaItem key={item.label} {...item} />
              ))}
            </dl>
          )}

          {(links.web || links.appStore || links.googlePlay) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.web && (
                <a href={links.web} target="_blank" rel="noopener noreferrer" className={pillPrimary}>
                  <Globe className="size-4" />
                  {cs.website}
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              {links.appStore && (
                <a href={links.appStore} target="_blank" rel="noopener noreferrer" className={pillGhost}>
                  <AppleIcon />
                  App Store
                </a>
              )}
              {links.googlePlay && (
                <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" className={pillGhost}>
                  <PlayIcon />
                  Google Play
                </a>
              )}
            </div>
          )}
        </div>

        {cover && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[color:var(--ink-line-strong)] bg-[color:var(--ink-bg-2)] shadow-[0_28px_70px_rgba(0,0,0,0.45)]">
            <SiteImage
              src={cover}
              alt={content.title}
              fill
              priority
              sizes={COVER_SIZES}
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* Story */}
      {story && (
        <>
          <StorySection index={nextIndex()} title={cs.challenge}>
            <Markdown
              source={story.challenge}
              className="max-w-[68ch] text-[17px] leading-[1.7] text-[color:var(--ink-muted)]"
            />
          </StorySection>

          <StorySection index={nextIndex()} title={cs.solution}>
            <Markdown
              source={story.solution}
              className="max-w-[68ch] text-[17px] leading-[1.7] text-[color:var(--ink-muted)]"
            />
          </StorySection>

          {story.highlights.length > 0 && (
            <StorySection index={nextIndex()} title={cs.decisions} wide>
              <ol
                className={cn(
                  "mt-4 grid list-none gap-4 p-0 md:grid-cols-2",
                  story.highlights.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3",
                )}
              >
                {story.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-3 rounded-2xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] p-6 transition-colors hover:border-[color:var(--ink-line-strong)]"
                  >
                    <span className="font-mono text-xs text-[color:var(--brand-green)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em]">{h.title}</h3>
                    <p className="text-sm leading-[1.65] text-[color:var(--ink-muted)]">
                      <InlineMarkdown source={h.body} />
                    </p>
                  </li>
                ))}
              </ol>
            </StorySection>
          )}

          <StorySection index={nextIndex()} title={cs.results}>
            <div className="max-w-[68ch] border-l-2 border-[color:var(--brand-green)] pl-6">
              <Markdown
                source={story.results}
                className="text-[17px] leading-[1.7] text-[color:var(--ink-fg)]/85"
              />
            </div>
          </StorySection>
        </>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <StorySection index={nextIndex()} title={cs.gallery} wide>
          {phones.length > 0 && (
            <ul
              style={{ "--cols": phoneColumns(phones.length) } as CSSProperties}
              className={cn(
                "-mx-4 mt-4 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4",
                "md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:pb-0",
                "md:max-w-[calc(var(--cols)*236px)] md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:gap-5",
              )}
            >
              {phones.map((img, i) => (
                <li key={img.blobKey} className="w-[62%] shrink-0 snap-center sm:w-[40%] md:w-auto">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`${cs.openImage} ${i + 1}`}
                    className="block aspect-[9/19.5] w-full cursor-zoom-in rounded-[30px] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    <PhoneFrame className="shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                      <SiteImage
                        src={img.blobKey}
                        alt={img.alt || `${content.title} — ${i + 1}`}
                        fill
                        sizes={PHONE_SIZES}
                        className="object-cover"
                      />
                    </PhoneFrame>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {desktops.length > 0 && (
            <ul
              className={cn(
                "-mx-4 mt-6 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4",
                "md:mx-0 md:grid md:snap-none md:gap-5 md:overflow-visible md:px-0 md:pb-0",
                desktops.length > 1 && "md:grid-cols-2 lg:grid-cols-6",
              )}
            >
              {desktops.map((img, i) => {
                const index = phones.length + i
                const tile = desktopTiles[i]
                const featured = tile === "featured" || tile === "full"
                return (
                  <li
                    key={img.blobKey}
                    className={cn(
                      "min-w-0 snap-center",
                      desktops.length > 1 ? "w-[85%] shrink-0 md:w-auto" : "w-full",
                      TILE_CLASS[tile],
                      // md is 2 columns: a wide first tile only when it leaves even pairs.
                      featured && desktops.length % 2 === 1 && "md:col-span-2",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`${cs.openImage} ${index + 1}`}
                      className="block aspect-[16/10] w-full cursor-zoom-in rounded-2xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      <BrowserFrame className="shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                        <SiteImage
                          src={img.blobKey}
                          alt={img.alt || `${content.title} — ${index + 1}`}
                          fill
                          sizes={
                            desktops.length === 1 || featured
                              ? "(min-width: 1280px) 800px, (min-width: 768px) 100vw, 85vw"
                              : DESKTOP_SIZES
                          }
                          className="object-contain"
                        />
                      </BrowserFrame>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </StorySection>
      )}

      {/* Stack */}
      {project.technologies.length > 0 && (
        <StorySection index={nextIndex()} title={cs.stack}>
          <ul className="flex list-none flex-wrap gap-2 p-0">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <Capsule size="md" dot={false}>
                  {tech}
                </Capsule>
              </li>
            ))}
          </ul>
        </StorySection>
      )}

      {/* CTA + next project */}
      <section className="grid gap-5 border-t border-[color:var(--ink-line)] pt-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:pt-20">
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--ink-line-strong)] bg-[color:var(--ink-bg-2)] p-8 lg:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "linear-gradient(180deg, var(--brand-grad-from), var(--brand-grad-to))" }}
          />
          <div className="relative">
            <Eyebrow>— {cs.ctaEyebrow}</Eyebrow>
            <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] lg:text-[38px]">
              <GradientTitle text={cs.ctaTitle} />
            </h2>
            <p className="mt-4 max-w-[46ch] text-base leading-[1.6] text-[color:var(--ink-muted)]">
              {cs.ctaBody}
            </p>
            <Link href={localePath("/#contact")} className={cn(pillPrimary, "mt-7 px-5 py-3")}>
              {cs.ctaButton}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {nextProject && (
          <Link
            href={localePath(`/projects/${nextProject.id}`)}
            className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] transition-colors hover:border-[color:var(--brand-cyan)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
          >
            {nextProject.image && (
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[color:var(--ink-line)]">
                <SiteImage
                  src={nextProject.image}
                  alt={nextProject.title}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div className="flex flex-1 items-end justify-between gap-4 p-6">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--ink-muted)]">
                  {cs.nextProject}
                </div>
                <div className="mt-1.5 text-xl font-semibold tracking-[-0.02em]">{nextProject.title}</div>
                {nextProject.subtitle && (
                  <div className="mt-1 line-clamp-2 text-sm text-[color:var(--ink-muted)]">
                    {nextProject.subtitle}
                  </div>
                )}
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[color:var(--ink-line-strong)] transition-colors group-hover:border-[color:var(--brand-cyan)] group-hover:text-[color:var(--brand-cyan)]">
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        )}
      </section>

      {lightboxImages.length > 0 && (
        <ProjectLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </article>
  )
}
