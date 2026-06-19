import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { TechnologiesSection } from "@/components/technologies-section";
import { TeamSection } from "@/components/team-section";
import { ProjectsShowcaseSection } from "@/components/projects-showcase/projects-showcase-section";
import { ReviewsSection } from "@/components/reviews-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { getHomePageData } from "@/lib/server/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { projects, technologies, reviews, contactInfo, teamMembers } =
    await getHomePageData();

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TechnologiesSection technologies={technologies} />
      <TeamSection teamMembers={teamMembers} />
      <ProjectsShowcaseSection projects={projects} />
      <ReviewsSection reviews={reviews} />
      <ContactSection contactInfo={contactInfo} />
      <Footer />
    </main>
  );
}
