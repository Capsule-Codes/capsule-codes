import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjectHighlights } from "@/lib/server/data";
import { ProjectHighlightsClient } from "./project-highlights-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectHighlightsPage() {
  const projectHighlights = await getProjectHighlights();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProjectHighlightsClient projectHighlights={projectHighlights} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
