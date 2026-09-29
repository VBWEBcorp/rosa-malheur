import Link from "next/link";

import Footer from "@/components/shop/Footer";
import Header from "@/components/shop/Header";

/**
 * Page 404.
 *
 * Le clin d'œil vient du produit : une laisse, un chien, et une page qui a
 * filé. Le header et le footer sont repris ici parce qu'ils vivent dans le
 * layout de (shop) : une adresse inconnue n'y passe pas.
 */

const sorties = [
  { href: "/produit", label: "La laisse" },
  { href: "/cartes-cadeaux", label: "Carte cadeau" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink/50">
            Erreur 404
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Cette page a filé
            <span className="block text-[var(--orange)]">sans sa laisse</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-pretty text-[17px] leading-relaxed text-ink/70">
            Elle n&apos;existe pas, ou elle a changé d&apos;adresse. Nos laisses
            tiennent mieux que nos pages, c&apos;est promis.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-[0.95rem] font-medium text-[var(--cream)] transition-transform hover:-translate-y-0.5"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/produit"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink/25 px-7 text-[0.95rem] font-medium text-ink transition-colors hover:bg-ink hover:text-[var(--cream)]"
            >
              Voir la laisse
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {sorties.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="text-sm text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
