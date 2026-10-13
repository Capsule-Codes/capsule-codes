import type React from "react";
import type { Metadata } from "next";
import { AppDocument } from "@/components/app-document";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { AdminShell } from "./admin-shell";

export const metadata: Metadata = {
  title: "Admin | Capsule Codes",
  robots: { index: false, follow: false },
};

/** Root layout of the admin panel: English only, never indexed. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppDocument locale={DEFAULT_LOCALE}>
      <AdminShell>{children}</AdminShell>
    </AppDocument>
  );
}
