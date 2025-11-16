export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  created_at: string;
  updated_at: string;
}

export interface ContactInfoTranslations {
  location: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  location: string;
  translations: {
    en: ContactInfoTranslations;
    es: ContactInfoTranslations;
    it: ContactInfoTranslations;
  };
  created_at: string;
  updated_at: string;
}
