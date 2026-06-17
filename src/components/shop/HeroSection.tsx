import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RetroStar from "./RetroStar";
import BrandLogo from "./BrandLogo";
import { getContent } from "@/lib/content";

/**
 * Hero façon affiche sérigraphiée : le logo (chat + lettrage) en pièce maîtresse,
 * sur fond crème, ponctué d'étoiles rétro, avec slogan et CTA.
 * Textes pilotés depuis l'admin « Contenu du site › Page d'accueil ».
 */
export default async function HeroSection() {
  const t = await getContent();

  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      {/* Étoiles décoratives */}
      <RetroStar points={8} className="absolute top-10 left-[5%] w-10 h-10 md:w-14 md:h-14 text-[var(--black)]" />
      <RetroStar points={8} className="absolute top-20 right-[7%] w-8 h-8 md:w-12 md:h-12 text-[var(--orange)]" />
      <RetroStar points={10} className="absolute bottom-20 left-[10%] w-9 h-9 text-[var(--pink-dark)] hidden sm:block" />
      <RetroStar points={8} className="absolute bottom-28 right-[12%] w-6 h-6 text-[var(--black)] hidden sm:block" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-20 md:pb-24 text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--cream)] text-[var(--black)] px-5 py-2 text-[12px] md:text-[13px] font-display font-extrabold uppercase tracking-wide">
          <RetroStar points={8} className="w-3.5 h-3.5 text-[var(--orange)]" />
          {t("home_hero_eyebrow")}
        </span>

        {/* Logo centerpiece (h1) */}
        <h1 className="mt-8 flex justify-center">
          <BrandLogo priority className="w-full max-w-[440px] md:max-w-[520px] h-auto" />
        </h1>

        {/* Slogan */}
        <p className="mt-8 max-w-xl mx-auto text-[16px] md:text-[18px] text-[var(--black)]/80 leading-relaxed font-semibold">
          {t("home_hero_tagline")}
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/produit" className="btn-rosa text-[15px]">
            {t("home_hero_cta_primary")}
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <Link href="/pages/a-propos" className="btn-rosa-outline text-[15px]">
            {t("home_hero_cta_secondary")}
          </Link>
        </div>

        {/* Réassurance */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-bold text-[var(--black)]/70">
          <span className="inline-flex items-center gap-2">♻️ Cordes recyclées</span>
          <span className="inline-flex items-center gap-2">🐕 Bien-être animal</span>
          <span className="inline-flex items-center gap-2">🇫🇷 Fait main en France</span>
        </div>
      </div>
    </section>
  );
}
