"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ContactInfo } from "@/lib/types/contact";

type FormStatus = "idle" | "loading" | "success" | "error";

interface ContactSectionProps {
  contactInfo: ContactInfo | null;
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus("loading");

    try {
      // Validate with Zod
      const validatedData = contactFormSchema.parse(formData);

      // Save to Supabase via API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");

      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as any;
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        zodError.errors?.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }

      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this field when user types
    if (errors[e.target.name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const contactInfoItems = contactInfo ? [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: t.contact.info.email,
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
    },
    {
      icon: <Phone className="w-6 h-6 text-secondary" />,
      title: t.contact.info.phone,
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: t.contact.info.location,
      value: contactInfo.location,
      link: "#",
    },
  ] : null;

  return (
    <section id="contact" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.contact.title.split(" ")[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.contact.title.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">{t.contact.subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 ${contactInfoItems ? 'lg:grid-cols-2' : ''} gap-12`}>
          {/* Contact Form */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">{t.contact.form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {t.contact.form.successMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {status === "error" && !Object.keys(errors).length && (
                  <Alert className="bg-red-50 border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {t.contact.form.errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t.contact.form.name} *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.contact.form.namePlaceholder}
                      disabled={status === "loading"}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t.contact.form.email} *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.contact.form.emailPlaceholder}
                      disabled={status === "loading"}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {t.contact.form.company}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t.contact.form.companyPlaceholder}
                    disabled={status === "loading"}
                    className={errors.company ? "border-red-500" : ""}
                  />
                  {errors.company && (
                    <p className="text-sm text-red-600 mt-1">{errors.company}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t.contact.form.message} *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    rows={5}
                    disabled={status === "loading"}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.contact.form.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t.contact.form.send}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {contactInfoItems && (
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">{t.contact.info.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfoItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="mt-1">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
