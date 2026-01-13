import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PrivacyPolicyClient } from "./privacy-client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PrivacyPolicyClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
