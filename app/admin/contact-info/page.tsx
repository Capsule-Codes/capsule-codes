"use client";
import { Topbar } from "@/components/admin/topbar";
import { ContactInfoSettings } from "@/components/admin/contact-info-settings";

export default function AdminContactInfoPage() {
  return (
    <div className="p-8 lg:p-12 max-w-4xl">
      <Topbar
        title="Contact Info"
        subtitle="public contact details shown on the website"
      />
      <ContactInfoSettings />
    </div>
  );
}
