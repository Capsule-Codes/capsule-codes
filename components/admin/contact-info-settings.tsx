"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase-context";
import { useLanguage } from "@/hooks/use-language";
import { MultilingualTabs, type LangCode } from "@/components/admin/multilingual-tabs";
import { Save, Loader2 } from "lucide-react";
import type { ContactInfo } from "@/lib/types/contact";

const inputClass =
  "w-full bg-[color:var(--input-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50";

const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block";

const primaryBtn =
  "brand-grad text-on-grad rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error) || "Unknown error";
}

export function ContactInfoSettings() {
  const { t } = useLanguage();
  const { contactInfo, updateContactInfo } = useSupabase();
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    email: "",
    phone: "",
    location: "",
    translations: {
      en: { location: "" },
      es: { location: "" },
      it: { location: "" },
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    } else {
      setFormData({
        email: "",
        phone: "",
        location: "",
        translations: {
          en: { location: "" },
          es: { location: "" },
          it: { location: "" },
        },
      });
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContactInfo(formData);
      alert(t.admin.contactInfo.updated);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Error updating contact info:", error);
      alert(`${t.admin.contactInfo.updateError}: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const completion: Record<LangCode, boolean> = {
    en: Boolean(formData.translations?.en?.location?.trim()),
    es: Boolean(formData.translations?.es?.location?.trim()),
    it: Boolean(formData.translations?.it?.location?.trim()),
  };

  const placeholders: Record<LangCode, string> = {
    en: "Tech District, Future City",
    es: "Distrito Tech, Ciudad del Futuro",
    it: "Distretto Tech, Città del Futuro",
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[color:var(--ink-bg-2)] border border-[color:var(--ink-line)] rounded-2xl p-6 space-y-6">
      <div>
        <label htmlFor="email" className={labelClass}>
          {t.admin.contactInfo.email}
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="hola@capsulecodes.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          {t.admin.contactInfo.phone}
        </label>
        <input
          id="phone"
          type="tel"
          className={inputClass}
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          {t.admin.contactInfo.locationDefault}
        </label>
        <input
          id="location"
          className={inputClass}
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Tech District"
          required
        />
      </div>

      <div>
        <span className={labelClass}>
          {t.admin.contactInfo.multilingualLocation}
        </span>
        <MultilingualTabs completion={completion}>
          {(lang) => (
            <div>
              <label htmlFor={`location-${lang}`} className={labelClass}>
                {t.admin.contactInfo.location} ({lang.toUpperCase()})
              </label>
              <input
                id={`location-${lang}`}
                className={inputClass}
                value={formData.translations?.[lang]?.location || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations!,
                      [lang]: { location: e.target.value },
                    },
                  })
                }
                placeholder={placeholders[lang]}
              />
            </div>
          )}
        </MultilingualTabs>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSaving} className={primaryBtn}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? t.admin.common.saving : t.admin.contactInfo.saveChanges}
        </button>
      </div>
    </form>
  );
}
