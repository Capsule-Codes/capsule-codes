import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjectHighlight } from "@/lib/server/data";
import { notFound } from "next/navigation";
import { ProjectHighlightDetailClient } from "./project-highlight-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectHighlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectHighlight = await getProjectHighlight(id);

  if (!projectHighlight) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProjectHighlightDetailClient projectHighlight={projectHighlight} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
