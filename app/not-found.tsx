import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_35%,oklch(0.45_0.2_185_/_0.28),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_25%_85%,oklch(0.4_0.18_155_/_0.18),transparent_70%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(oklch(1_0_0_/_0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <section className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="relative z-[2] mb-6 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--cap-border)] bg-[image:var(--cap-bg)] px-3 py-[5px] font-mono text-[10px] font-medium tracking-[0.01em] text-[color:var(--cap-fg)] shadow-[var(--cap-shadow)]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[color:var(--brand-green)] shadow-[0_0_8px_var(--brand-green)]"
            />
            404 · Page not found
          </span>

          <p
            aria-hidden="true"
            className="font-mono text-[clamp(6rem,24vw,13rem)] font-semibold leading-none tracking-[-0.08em] text-brand-grad opacity-90"
          >
            404
          </p>

          <h1 className="-mt-2 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
            Oops! This page doesn&apos;t exist.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[color:var(--ink-muted)] sm:text-lg">
            Looks like you took a wrong turn — but no worries.
          </p>

          <Link
            href="/"
            className="brand-grad mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-on-grad shadow-[0_6px_22px_oklch(0.5_0.16_180_/_0.35)]"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
