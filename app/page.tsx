import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { TechnologiesSection } from "@/components/technologies-section";
import { ProjectsSection } from "@/components/projects-section";
import { ReviewsSection } from "@/components/reviews-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TechnologiesSection />
      <ProjectsSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
