import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { TechnologiesSection } from "@/components/technologies-section";
import { ProjectsSection } from "@/components/projects-section";
import { ReviewsSection } from "@/components/reviews-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { getHomePageData } from "@/lib/server/data";

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch data on the server
  const { projects, technologies, reviews, contactInfo } = await getHomePageData();

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TechnologiesSection technologies={technologies} />
      <ProjectsSection projects={projects} />
      <ReviewsSection reviews={reviews} />
      <ContactSection contactInfo={contactInfo} />
      <Footer />
    </main>
  );
}
