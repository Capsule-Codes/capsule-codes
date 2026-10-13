import { absoluteUrl } from "./site.ts";
import { LOCALES, alternateUrls, localePath, type Locale } from "./locale.ts";

export type PageKey = "home" | "projects" | "privacy" | "terms";

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  it: "it_IT",
};

const SITE_NAME = "Capsule Codes";
const OG_IMAGE_ALT: Record<Locale, string> = {
  en: "Capsule Codes — Mobile & Web Development for Startups",
  es: "Capsule Codes — Desarrollo móvil y web para startups",
  it: "Capsule Codes — Sviluppo mobile e web per startup",
};

const PAGE_PATH: Record<PageKey, string> = {
  home: "/",
  projects: "/projects",
  privacy: "/privacy",
  terms: "/terms",
};

interface PageCopy {
  title: string;
  description: string;
}

/** Search-result copy per page and locale. Visible page text lives in `lib/i18n.ts`. */
const PAGE_COPY: Record<Locale, Record<PageKey, PageCopy>> = {
  en: {
    home: {
      title: "Capsule Codes - Web & App Development",
      description:
        "React Native & Next.js development agency. We build production-ready mobile apps and web platforms for startups. 8+ projects across 6 countries. Direct access to senior developers.",
    },
    projects: {
      title: "Projects",
      description:
        "Selected web platforms and mobile apps built by Capsule Codes for startups and companies.",
    },
    privacy: {
      title: "Privacy Policy | Capsule Codes",
      description:
        "How Capsule Codes collects, uses and protects your personal information when you visit our website or use our services.",
    },
    terms: {
      title: "Terms of Service | Capsule Codes",
      description:
        "The terms that govern your access to and use of the Capsule Codes website and services.",
    },
  },
  es: {
    home: {
      title: "Capsule Codes - Desarrollo web y de apps",
      description:
        "Agencia de desarrollo con React Native y Next.js. Construimos apps móviles y plataformas web listas para producción para startups. Más de 8 proyectos en 6 países. Acceso directo a desarrolladores senior.",
    },
    projects: {
      title: "Proyectos",
      description:
        "Plataformas web y apps móviles seleccionadas que Capsule Codes construyó para startups y empresas.",
    },
    privacy: {
      title: "Política de Privacidad | Capsule Codes",
      description:
        "Cómo Capsule Codes recopila, usa y protege tu información personal cuando visitas nuestro sitio o usas nuestros servicios.",
    },
    terms: {
      title: "Términos de Servicio | Capsule Codes",
      description:
        "Los términos que regulan tu acceso y uso del sitio web y los servicios de Capsule Codes.",
    },
  },
  it: {
    home: {
      title: "Capsule Codes - Sviluppo web e app",
      description:
        "Agenzia di sviluppo React Native e Next.js. Realizziamo app mobile e piattaforme web pronte per la produzione per startup. Oltre 8 progetti in 6 paesi. Accesso diretto a sviluppatori senior.",
    },
    projects: {
      title: "Progetti",
      description:
        "Piattaforme web e app mobile selezionate realizzate da Capsule Codes per startup e aziende.",
    },
    privacy: {
      title: "Informativa sulla Privacy | Capsule Codes",
      description:
        "Come Capsule Codes raccoglie, utilizza e protegge i tuoi dati personali quando visiti il nostro sito o utilizzi i nostri servizi.",
    },
    terms: {
      title: "Termini di Servizio | Capsule Codes",
      description:
        "I termini che regolano l'accesso e l'utilizzo del sito web e dei servizi di Capsule Codes.",
    },
  },
};

export interface LocalizedMetadata {
  title: string;
  description: string;
  alternates: {
    canonical: string;
    languages: Record<Locale | "x-default", string>;
  };
  openGraph: {
    type: "website";
    siteName: string;
    title: string;
    description: string;
    url: string;
    locale: string;
    alternateLocale: string[];
    images: { url: string; alt: string }[];
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
}

/**
 * Metadata for one page in one locale: canonical for that locale, hreflang for
 * all of them, and Open Graph/Twitter cards in the same language.
 */
export function buildLocalizedMetadata(input: {
  locale: Locale;
  /** Unprefixed page path, e.g. "/projects/abc". */
  path: string;
  title: string;
  description: string;
  /** Social card image; defaults to the site card. */
  image?: string;
}): LocalizedMetadata {
  const { locale, path, title, description } = input;
  const canonical = absoluteUrl(localePath(locale, path));
  const image = input.image || absoluteUrl("/og-image.png");
  const imageAlt = input.image ? title : OG_IMAGE_ALT[locale];
  return {
    title,
    description,
    alternates: { canonical, languages: alternateUrls(path) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function buildPageMetadata(locale: Locale, page: PageKey): LocalizedMetadata {
  return buildLocalizedMetadata({ locale, path: PAGE_PATH[page], ...PAGE_COPY[locale][page] });
}
