import BrandLogo from "@/components/shop/BrandLogo";
import RetroStar from "@/components/shop/RetroStar";
import Reassurance from "@/components/shop/Reassurance";

export const metadata = {
  title: "Bientôt en ligne · Rosa Malheur",
  description:
    "Rosa Malheur arrive bientôt : des laisses pour chien faites main à partir de cordes d'escalade recyclées.",
};

export default function ComingSoonPage() {
  const year = new Date().getFullYear();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--cream)] flex flex-col items-center justify-center text-center px-5 py-16">
      {/* Étoiles décoratives */}
      <RetroStar points={8} className="absolute top-10 left-[6%] w-12 h-12 md:w-16 md:h-16 text-[var(--black)]" />
      <RetroStar points={8} className="absolute top-16 right-[8%] w-9 h-9 md:w-14 md:h-14 text-[var(--orange)]" />
      <RetroStar points={10} className="absolute bottom-24 left-[12%] w-10 h-10 text-[var(--pink-dark)] hidden sm:block" />
      <RetroStar points={8} className="absolute bottom-16 right-[14%] w-7 h-7 md:w-10 md:h-10 text-[var(--black)] hidden sm:block" />

      <div className="relative max-w-2xl w-full">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 pill-rosa bg-white text-[var(--black)] px-5 py-2 text-[12px] md:text-[13px] font-display font-extrabold uppercase tracking-wide">
          <RetroStar points={8} className="w-3.5 h-3.5 text-[var(--orange)]" />
          Ouverture prochaine
        </span>

        {/* Logo */}
        <div className="mt-9 flex justify-center">
          <BrandLogo priority className="w-full max-w-[340px] md:max-w-[420px] h-auto" />
        </div>

        {/* Titre */}
        <h1 className="mt-9 font-display font-extrabold text-[2.75rem] leading-[0.9] sm:text-6xl md:text-7xl text-[var(--black)]">
          Bientôt <span className="text-[var(--orange)]">en ligne</span>
        </h1>

        {/* Sous-titre */}
        <p className="mt-7 max-w-md mx-auto text-[16px] md:text-[18px] text-[var(--black)]/80 leading-relaxed font-semibold">
          Des laisses pour chien faites main à partir de{" "}
          <span className="text-[var(--orange)] font-extrabold">cordes d&apos;escalade recyclées</span>.
          On prépare tout ça avec soin. Revenez très vite&nbsp;!
        </p>

        {/* Contact */}
        <div className="mt-9">
          <a href="mailto:fanny.rabu@hotmail.fr" className="btn-rosa text-[15px]">
            Nous écrire
          </a>
        </div>

        {/* Réassurance */}
        <Reassurance className="mt-12" />

        <p className="mt-14 text-[12px] font-semibold text-[var(--black)]/45">
          © {year} Rosa Malheur · Fait main en France
        </p>
      </div>
    </main>
  );
}
