import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProject } from "@/lib/server/data"
import { notFound } from "next/navigation"
import { ProjectDetailClient } from "./project-detail-client"

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const project = await getProject(id);

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
  )
}