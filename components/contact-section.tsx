"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Magnetic } from "@/components/motion/magnetic";
import { SectionHeader } from "@/components/ui/section-header";
import { useLanguage } from "@/hooks/use-language";
import { Send, Loader2 } from "lucide-react";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/lib/validations/contact";
import type { ContactInfo } from "@/lib/types/contact";

interface ContactSectionProps {
  contactInfo: ContactInfo | null;
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const { t } = useLanguage();
  const titleWords = t.contact.title.split(" ");
  const lastWord = titleWords.pop() ?? "";
  const leading = titleWords.join(" ");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      toast.success(t.contact.form.successMessage);
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t.contact.form.errorMessage
      );
    }
  };

  const emailValue = contactInfo?.email ?? "—";
  const phoneValue = contactInfo?.phone ?? "—";
  const locationValue = contactInfo?.location ?? "—";
  const hoursValue = t.contact.hours.weekdays;

  const labelClass =
    "font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--brand-cyan)] w-[80px] shrink-0";
  const rowClass =
    "flex items-center gap-3 py-3 border-t border-[color:var(--ink-line)] text-[13px]";

  const formLabelClass =
    "font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block";
  const inputClass =
    "w-full bg-[color:var(--input-bg)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50";
  const errorClass = "text-[11px] text-[color:oklch(0.65_0.2_25)] mt-1";

  return (
    <section
      id="contact"
      className="py-[90px] px-4 lg:px-12 border-t border-[color:var(--ink-line)]"
    >
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="— 07 / Contact"
          align="center"
          title={
            <>
              {leading} <em className="not-italic text-brand-grad">{lastWord}</em>
            </>
          }
          lead={t.contact.subtitle}
        />

        <div
          className="mt-12 lg:mt-14 border border-[color:oklch(0.5_0.18_180_/_0.4)] rounded-3xl p-9 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-9"
          style={{
            background:
              "radial-gradient(ellipse at top right, oklch(0.4 0.18 180 / 0.25), transparent 60%), var(--ink-bg-2)",
          }}
        >
          {/* Left column — info */}
          <div>
            <h4 className="text-base font-semibold mb-2">
              {t.contact.info.title}
            </h4>
            <p className="text-[13px] leading-[1.5] text-[color:var(--ink-muted)] mb-6">
              {t.contact.info.description}
            </p>

            <div className={rowClass}>
              <span className={labelClass}>{t.contact.info.email}</span>
              <span className="truncate">{emailValue}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.contact.info.phone}</span>
              <span>{phoneValue}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.contact.info.location}</span>
              <span>{locationValue}</span>
            </div>
            <div className={rowClass}>
              <span className={labelClass}>{t.contact.hours.title}</span>
              <span>{hoursValue}</span>
            </div>
          </div>

          {/* Right column — form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="name" className={formLabelClass}>
                  {t.contact.form.name}
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t.contact.form.namePlaceholder}
                  disabled={isSubmitting}
                  className={inputClass}
                  {...register("name")}
                />
                {errors.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className={formLabelClass}>
                  {t.contact.form.email}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.contact.form.emailPlaceholder}
                  disabled={isSubmitting}
                  className={inputClass}
                  {...register("email")}
                />
                {errors.email && (
                  <p className={errorClass}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="company" className={formLabelClass}>
                {t.contact.form.company}
              </label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                placeholder={t.contact.form.companyPlaceholder}
                disabled={isSubmitting}
                className={inputClass}
                {...register("company")}
              />
              {errors.company && (
                <p className={errorClass}>{errors.company.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="message" className={formLabelClass}>
                {t.contact.form.message}
              </label>
              <textarea
                id="message"
                placeholder={t.contact.form.messagePlaceholder}
                disabled={isSubmitting}
                className={`${inputClass} min-h-[120px] resize-y`}
                {...register("message")}
              />
              {errors.message && (
                <p className={errorClass}>{errors.message.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Magnetic>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="brand-grad text-on-grad rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.contact.form.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.contact.form.send}
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
