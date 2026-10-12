import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjects } from "@/lib/server/data";
import { getPublishedProjects } from "@/lib/project-pages";
import { ProjectsIndexClient } from "./projects-index-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected web platforms and mobile apps built by Capsule Codes for startups and companies.",
  alternates: { canonical: "/projects" },
};

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
