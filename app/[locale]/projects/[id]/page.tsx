import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjects, getPublishedProject } from "@/lib/server/data";
import {
  buildProjectMetadata,
  getNextProject,
  getPublishedProjects,
  resolveProjectSubtitle,
} from "@/lib/project-pages";
import { getProjectCover } from "@/lib/project-media";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/locale";
import { ProjectDetailClient, type NextProjectSummary } from "./project-detail-client";

// Cached (ISR). Admin writes revalidate on demand; this is the safety net.
export const revalidate = 300;
// Projects created after the build render on first request, then are cached.
export const dynamicParams = true;

/** Published projects x locales are prerendered at build time. */
export async function generateStaticParams() {
  const projects = getPublishedProjects(await getProjects());
  return LOCALES.flatMap((locale) => projects.map((project) => ({ locale, id: project.id })));
}

type PageProps = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const project = await getPublishedProject(id);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return buildProjectMetadata(project, locale);
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const project = await getPublishedProject(id);

  if (!project) {
    notFound();
  }

  // Only the fields the "Next project" card needs, already localized.
  const next = getNextProject(await getProjects(), project.id);
  const nextProject: NextProjectSummary | null = next
    ? {
        id: next.id,
        title: next.translations?.[locale]?.title || next.translations?.en?.title || next.title,
        subtitle: resolveProjectSubtitle(next, locale) ?? null,
        image: getProjectCover(next),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-20 pt-28 lg:px-12">
        <ProjectDetailClient project={project} nextProject={nextProject} />
      </main>
      <Footer />
    </div>
  );
}
