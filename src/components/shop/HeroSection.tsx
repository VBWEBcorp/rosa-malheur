import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RetroStar from "./RetroStar";
import Reassurance from "./Reassurance";
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
      {/* Étoiles décoratives (calque arrière-plan, derrière le texte) — scintillent */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <RetroStar points={8} style={{ "--i": 0 } as React.CSSProperties} className="star-twinkle absolute top-10 left-[5%] w-10 h-10 md:w-14 md:h-14 text-[var(--black)]" />
        <RetroStar points={8} style={{ "--i": 1 } as React.CSSProperties} className="star-twinkle absolute top-20 right-[7%] w-8 h-8 md:w-12 md:h-12 text-[var(--orange)]" />
        <RetroStar points={10} style={{ "--i": 2 } as React.CSSProperties} className="star-twinkle absolute bottom-20 left-[10%] w-9 h-9 text-[var(--pink-dark)] hidden sm:block" />
        <RetroStar points={8} style={{ "--i": 3 } as React.CSSProperties} className="star-twinkle absolute bottom-28 right-[12%] w-6 h-6 text-[var(--black)] hidden sm:block" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-20 md:pb-24 text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--cream)] text-[var(--black)] px-5 py-2 text-[12px] md:text-[13px] font-display font-extrabold uppercase tracking-wide">
          <RetroStar points={8} className="w-3.5 h-3.5 text-[var(--orange)]" />
          {t("home_hero_eyebrow")}
        </span>

        {/* Titre principal — police funky 70s, proche du lettrage du logo */}
        <h1 className="mt-7 font-fun text-[2.75rem] leading-[0.92] sm:text-6xl md:text-7xl text-[var(--black)]">
          {t("home_hero_title")}
          <span className="block text-[var(--orange)]">{t("home_hero_title_accent")}</span>
        </h1>

        {/* Logo Rosa Malheur (le chat) : flotte et se balance tout seul */}
        <div className="mt-8 w-fit mx-auto hero-logo-float">
          <BrandLogo
            priority
            className="hero-logo-wiggle w-auto h-28 sm:h-36 md:h-44 drop-shadow-[3px_4px_0_rgba(14,13,13,0.12)]"
          />
        </div>

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
        <Reassurance className="mt-12" />
      </div>
    </section>
  );
}
