"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase-context";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Settings, Loader2 } from "lucide-react";
import type { ContactInfo } from "@/lib/types/contact";

export function ContactInfoSettings() {
  const { t } = useLanguage();
  const { contactInfo, updateContactInfo, refreshData } = useSupabase();
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
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContactInfo(formData);
      await refreshData();
      alert(t.admin.contactInfo.updated);
    } catch (error) {
      alert(`${t.admin.contactInfo.updateError}: ${error instanceof Error ? error.message : "Error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-3xl font-bold">
          {t.admin.contactInfo.title}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              {t.admin.contactInfo.contactDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">
                {t.admin.contactInfo.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hola@capsulecodes.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">
                {t.admin.contactInfo.phone}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">
                {t.admin.contactInfo.locationDefault}
              </Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Tech District"
                required
              />
            </div>

            <div>
              <Label>
                {t.admin.contactInfo.multilingualLocation}
              </Label>
              <Tabs defaultValue="en" className="w-full mt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">🇺🇸 English</TabsTrigger>
                  <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                  <TabsTrigger value="it">🇮🇹 Italiano</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="location-en">{t.admin.contactInfo.location} (English)</Label>
                    <Input
                      id="location-en"
                      value={formData.translations?.en?.location || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations!,
                            en: { location: e.target.value },
                          },
                        })
                      }
                      placeholder="Tech District, Future City"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="es" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="location-es">{t.admin.contactInfo.location} (Español)</Label>
                    <Input
                      id="location-es"
                      value={formData.translations?.es?.location || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations!,
                            es: { location: e.target.value },
                          },
                        })
                      }
                      placeholder="Distrito Tech, Ciudad del Futuro"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="it" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="location-it">{t.admin.contactInfo.location} (Italiano)</Label>
                    <Input
                      id="location-it"
                      value={formData.translations?.it?.location || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations!,
                            it: { location: e.target.value },
                          },
                        })
                      }
                      placeholder="Distretto Tech, Città del Futuro"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 cursor-pointer transition-all"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? t.admin.common.saving : t.admin.contactInfo.saveChanges}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
