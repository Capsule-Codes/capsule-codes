import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjects } from "@/lib/server/data";
import { getPublishedProjects } from "@/lib/project-pages";
import { isLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/page-metadata";
import { ProjectsIndexClient } from "./projects-index-client";

export const revalidate = 300;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildPageMetadata(locale, "projects") : {};
}

export default async function ProjectsPage() {
  const projects = getPublishedProjects(await getProjects());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-16 pt-28 lg:px-12">
        <ProjectsIndexClient projects={projects} />
      </main>
      <Footer />
    </div>
  );
}
