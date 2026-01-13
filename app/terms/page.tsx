import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TermsOfServiceClient } from "./terms-client";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <TermsOfServiceClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
