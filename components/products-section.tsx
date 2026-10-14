"use client";

import { ArrowUpRight } from "lucide-react";
import { Capsule } from "@/components/ui/capsule";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SiteImage } from "@/components/site-image";
import { useLanguage } from "@/hooks/use-language";
import { PRODUCTS, getProductCopy } from "@/lib/products";

const CARD_SIZES = "(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw";

export function ProductsSection() {
  const { t, language } = useLanguage();
  const titleWords = t.products.title.split(" ");
  const lastWord = titleWords.pop() ?? "";
  const leading = titleWords.join(" ");

  return (
    <section
      id="products"
      className="border-t border-[color:var(--ink-line)] px-4 py-[90px] lg:px-12"
    >
      <SectionHeader
        eyebrow={`— 05 / ${t.nav.products}`}
        title={
          <>
            {leading} <em className="not-italic text-brand-grad">{lastWord}</em>
          </>
        }
        lead={t.products.subtitle}
      />

      <ul className="mt-12 grid list-none gap-6 p-0 md:grid-cols-3 lg:mt-14">
        {PRODUCTS.map((product, index) => {
          const copy = getProductCopy(product, language);
          const status =
            product.status === "live" ? t.products.statusLive : t.products.statusWebsiteLive;

          return (
            <li key={product.id} className="min-w-0">
              <ScrollReveal delay={index * 0.08} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[color:var(--ink-line)] bg-[color:var(--ink-bg-2)] transition-colors duration-200 hover:border-[color:var(--brand-cyan)]">
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--ink-line)]">
                    <SiteImage
                      src={product.image}
                      alt={product.imageAlt[language]}
                      fill
                      sizes={CARD_SIZES}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5 lg:p-6">
                    <div>
                      <Capsule size="sm" variant="success">
                        {status}
                      </Capsule>
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">{product.name}</h3>
                    <p className="text-sm font-medium leading-[1.5]">{copy.tagline}</p>
                    <p className="text-sm leading-[1.6] text-[color:var(--ink-muted)]">
                      {copy.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Capsule key={tag} size="sm" dot={false}>
                          {tag}
                        </Capsule>
                      ))}
                    </div>
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-[color:var(--brand-cyan)] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      {t.products.visit} {product.name}
                      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
