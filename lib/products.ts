import type { Language } from "./i18n.ts";

export type ProductStatus = "live" | "websiteLive";

export interface ProductCopy {
  tagline: string;
  description: string;
}

export interface Product {
  id: "stagionaly" | "orbys" | "elevate";
  name: string;
  href: string;
  /** Static cover (1600x1000) served by next/image from /public. */
  image: string;
  imageAlt: Record<Language, string>;
  status: ProductStatus;
  tags: string[];
  copy: Record<Language, ProductCopy>;
}

/**
 * The company's own products. Static on purpose (no DB). The factual one-liners
 * mirror facundopascale.dev so both sites say the same thing.
 */
export const PRODUCTS: Product[] = [
  {
    id: "stagionaly",
    name: "Stagionaly",
    href: "https://stagionaly.com",
    image: "/images/products/stagionaly.webp",
    imageAlt: {
      en: "Stagionaly, the job board for Italian seasonal hospitality",
      es: "Stagionaly, la bolsa de trabajo para la hotelería estacional italiana",
      it: "Stagionaly, la bacheca di lavoro per l'ospitalità stagionale italiana",
    },
    status: "live",
    tags: ["Next.js", "Expo", "Supabase"],
    copy: {
      en: {
        tagline: "The job board for Italian seasonal hospitality",
        description:
          "Connects hotels, restaurants and beach clubs with seasonal workers in Italy. Co-built with Miguel, a co-founder with years of hotel experience.",
      },
      es: {
        tagline: "La bolsa de trabajo para la hotelería estacional italiana",
        description:
          "Conecta hoteles, restaurantes y beach clubs con trabajadores de temporada en Italia. Construido junto a Miguel, cofundador con años de experiencia en hotelería.",
      },
      it: {
        tagline: "La bacheca di lavoro per l'ospitalità stagionale italiana",
        description:
          "Mette in contatto hotel, ristoranti e beach club con lavoratori stagionali in Italia. Sviluppato insieme a Miguel, cofondatore con anni di esperienza nel settore alberghiero.",
      },
    },
  },
  {
    id: "orbys",
    name: "Orbys",
    href: "https://www.getorbys.com",
    image: "/images/products/orbys.webp",
    imageAlt: {
      en: "Orbys, the agency management suite",
      es: "Orbys, la suite de gestión para agencias",
      it: "Orbys, la suite di gestione per agenzie",
    },
    status: "live",
    tags: ["Next.js", "Supabase", "MCP"],
    copy: {
      en: {
        tagline: "An agency management suite that your AI assistant can operate",
        description:
          "Multi-tenant SaaS for agencies: clients, projects, time tracking with approvals, billing and partner splits, with a remote MCP server built in. Capsule Codes runs on it.",
      },
      es: {
        tagline: "Una suite de gestión para agencias que tu asistente de IA puede operar",
        description:
          "SaaS multi-tenant para agencias: clientes, proyectos, control de horas con aprobaciones, facturación y reparto entre socios, con un servidor MCP remoto integrado. Capsule Codes funciona sobre él.",
      },
      it: {
        tagline: "Una suite di gestione per agenzie che il tuo assistente IA può usare",
        description:
          "SaaS multi-tenant per agenzie: clienti, progetti, rilevazione delle ore con approvazioni, fatturazione e ripartizione tra soci, con un server MCP remoto integrato. Capsule Codes lavora con Orbys.",
      },
    },
  },
  {
    id: "elevate",
    name: "Elevate",
    href: "https://byelevate.app",
    image: "/images/products/elevate.webp",
    imageAlt: {
      en: "Elevate, the offline-first coaching suite",
      es: "Elevate, la suite de coaching offline-first",
      it: "Elevate, la suite di coaching offline-first",
    },
    status: "websiteLive",
    tags: ["Coach", "Nutri", "Gym"],
    copy: {
      en: {
        tagline: "An offline-first coaching suite for trainers, nutritionists and gyms",
        description:
          "Three products, Coach, Nutri and Gym, each with a mobile and a desktop app. The website is live; the mobile apps are not in the stores yet and the desktop builds are pre-release.",
      },
      es: {
        tagline: "Suite de coaching offline-first para entrenadores, nutricionistas y gimnasios",
        description:
          "Tres productos, Coach, Nutri y Gym, cada uno con app mobile y app desktop. El sitio web está activo; las apps mobile todavía no están en las tiendas y las versiones desktop están en pre-lanzamiento.",
      },
      it: {
        tagline: "Suite di coaching offline-first per trainer, nutrizionisti e palestre",
        description:
          "Tre prodotti, Coach, Nutri e Gym, ciascuno con app mobile e app desktop. Il sito web è attivo; le app mobile non sono ancora negli store e le versioni desktop sono in pre-rilascio.",
      },
    },
  },
];

export function getProductCopy(product: Product, language: Language): ProductCopy {
  return product.copy[language] ?? product.copy.en;
}
