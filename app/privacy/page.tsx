import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PrivacyPolicyClient } from "./privacy-client";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Capsule Codes collects, uses and protects your personal information when you visit our website or use our services.",
  alternates: { canonical: "/privacy" },
  openGraph: { type: "website", title: "Privacy Policy | Capsule Codes", url: "/privacy" },
};

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
