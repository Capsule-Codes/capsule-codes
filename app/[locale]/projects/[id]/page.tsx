import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjects, getPublishedProject } from "@/lib/server/data";
import { getPublishedProjects } from "@/lib/project-pages";
import { buildProjectMetadata } from "@/lib/project-pages";
import { LOCALES, isLocale } from "@/lib/locale";
import { ProjectDetailClient } from "./project-detail-client";

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
  const { id } = await params;
  const project = await getPublishedProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProjectDetailClient project={project} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
