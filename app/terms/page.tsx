import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TermsOfServiceClient } from "./terms-client";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your access to and use of the Capsule Codes website and services.",
  alternates: { canonical: "/terms" },
  openGraph: { type: "website", title: "Terms of Service | Capsule Codes", url: "/terms" },
};

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
