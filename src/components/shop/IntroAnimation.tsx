"use client";

import { useEffect, useState } from "react";
import RetroStar from "./RetroStar";
import BrandLogo from "./BrandLogo";

/**
 * Animation de lancement (splash) : un voile crème couvre l'écran au chargement,
 * le logo Rosa Malheur « pop » avec un rebond sticker, des étoiles rétro éclatent
 * autour, le slogan apparaît, puis le voile remonte et s'efface pour révéler le site.
 *
 * Se joue à CHAQUE ouverture / actualisation de la boutique (mais pas lors des
 * navigations internes : le layout (shop) ne se remonte pas). Désactivée si
 * l'utilisateur préfère réduire les animations.
 */
export default function IntroAnimation() {
  // "playing" → "exiting" → "gone". On démarre visible pour éviter tout flash
  // de la page d'accueil avant le splash (le voile est rendu côté serveur).
  const [phase, setPhase] = useState<"playing" | "exiting" | "gone">("playing");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Respect de l'accessibilité : pas d'animation si l'utilisateur la réduit.
    if (prefersReduced) {
      setPhase("gone");
      return;
    }

    // L'intro se joue à CHAQUE ouverture / actualisation de la boutique.
    // Le layout (shop) ne se remonte pas lors d'une navigation interne (clic
    // d'une page à l'autre) → ça ne rejoue donc QUE sur un vrai chargement de
    // page (ouverture, F5, lien externe), pas en naviguant dans le site.
    document.body.style.overflow = "hidden";

    const toExit = window.setTimeout(() => setPhase("exiting"), 1900);
    const toGone = window.setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = "";
    }, 2550);

    return () => {
      window.clearTimeout(toExit);
      window.clearTimeout(toGone);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  // Étoiles disposées autour du logo, éclatant en cascade (--i).
  const stars = [
    { className: "top-[14%] left-[16%] w-12 h-12 sm:w-16 sm:h-16 text-[var(--orange)]", points: 8, i: 0 },
    { className: "top-[20%] right-[15%] w-9 h-9 sm:w-12 sm:h-12 text-[var(--black)]", points: 8, i: 1 },
    { className: "bottom-[22%] left-[20%] w-8 h-8 sm:w-11 sm:h-11 text-[var(--pink-dark)]", points: 10, i: 2 },
    { className: "bottom-[16%] right-[18%] w-12 h-12 sm:w-14 sm:h-14 text-[var(--black)]", points: 8, i: 3 },
    { className: "top-[42%] left-[8%] w-7 h-7 sm:w-9 sm:h-9 text-[var(--pink-dark)] hidden sm:block", points: 8, i: 1 },
    { className: "top-[40%] right-[9%] w-7 h-7 sm:w-10 sm:h-10 text-[var(--orange)] hidden sm:block", points: 10, i: 2 },
  ];

  return (
    <div
      id="rm-intro"
      role="presentation"
      aria-hidden
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--cream)] overflow-hidden ${
        phase === "exiting" ? "intro-veil-out" : ""
      }`}
    >
      {/* Étoiles décoratives en éclat */}
      {stars.map((s, idx) => (
        <RetroStar
          key={idx}
          points={s.points}
          style={{ "--i": s.i } as React.CSSProperties}
          className={`absolute intro-star-burst ${s.className}`}
        />
      ))}

      {/* Logo */}
      <BrandLogo
        priority
        className="intro-logo-pop w-auto h-32 sm:h-44 md:h-52 drop-shadow-[3px_5px_0_rgba(14,13,13,0.14)]"
      />

      {/* Slogan */}
      <p className="intro-tagline-in mt-6 px-6 text-center font-display font-extrabold uppercase tracking-wide text-[13px] sm:text-[15px] text-[var(--black)]/80">
        Une seconde vie au bout de la laisse
      </p>

      {/* Sécurité : si JavaScript est désactivé, le voile ne doit pas rester. */}
      <noscript>
        <style>{`#rm-intro{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
