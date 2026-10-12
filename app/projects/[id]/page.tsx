import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getPublishedProject } from "@/lib/server/data";
import { buildProjectMetadata } from "@/lib/project-pages";
import { ProjectDetailClient } from "./project-detail-client";

// Projects are edited from the admin panel: always render fresh data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getPublishedProject(id);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return buildProjectMetadata(project);
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
