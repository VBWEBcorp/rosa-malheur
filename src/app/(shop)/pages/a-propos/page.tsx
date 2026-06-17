import Link from "next/link";
import { ArrowRight, Recycle, ShieldCheck, Hand } from "lucide-react";
import type { Metadata } from "next";
import RetroStar from "@/components/shop/RetroStar";
import BrandLogo from "@/components/shop/BrandLogo";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Rosa Malheur, ce sont des laisses pour chien faites main à partir de cordes d'escalade recyclées. Découvrez l'idée, la matière et les engagements derrière la marque.",
  alternates: { canonical: "/pages/a-propos" },
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--cream)]">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-[2.5px] border-[var(--black)] py-16 md:py-24">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <RetroStar points={8} className="absolute top-10 left-[8%] w-12 h-12 text-[var(--orange)] hidden sm:block" />
          <RetroStar points={10} className="absolute bottom-12 right-[10%] w-14 h-14 text-[var(--pink-dark)] hidden sm:block" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-5 py-2 text-[12px] font-display font-extrabold uppercase tracking-wide">
            L&apos;histoire
          </span>
          <h1 className="mt-6 font-display font-extrabold text-5xl md:text-6xl text-[var(--black)] leading-[0.9]">
            Notre <span className="text-[var(--orange)]">histoire</span>
          </h1>
          <p className="mt-6 text-[16px] md:text-[18px] text-[var(--black)]/80 leading-relaxed font-semibold">
            Rosa Malheur, ce sont des laisses pour chien nées d&apos;une conviction simple : une
            corde d&apos;escalade a mille vies.
          </p>
        </div>
      </section>

      {/* ── L'IDÉE : visuel + texte ───────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-block pill-rosa bg-[var(--orange)] text-white px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
              L&apos;idée
            </span>
            <h2 className="mt-5 font-display font-extrabold text-3xl md:text-4xl text-[var(--black)] leading-[1.05]">
              Tout commence au bout d&apos;une corde
            </h2>
            <div className="mt-6 space-y-5 text-[15px] md:text-[16px] text-[var(--black)]/80 leading-relaxed">
              <p>
                En escalade, une corde se retire bien avant d&apos;être usée : par sécurité, après
                quelques années ou une grosse chute, elle quitte la falaise. Elle reste pourtant
                solide, souple et pleine de caractère.
              </p>
              <p>
                Plutôt que de la voir finir à la benne, on la récupère et on la transforme, à la
                main, en laisses pour chien. Chaque modèle garde les couleurs et la personnalité de
                sa corde d&apos;origine : il n&apos;y en a pas deux exactement pareilles.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div
              className="card-rosa bg-[var(--pink)] aspect-[4/5] flex items-center justify-center p-10"
              style={{ boxShadow: "8px 8px 0 0 var(--black)" }}
            >
              <BrandLogo className="w-full max-w-[280px] h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CITATION ──────────────────────────────────────────── */}
      <section className="bg-[var(--black)] py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <RetroStar points={8} className="absolute top-8 right-[12%] w-12 h-12 text-[var(--orange)] opacity-90" />
          <RetroStar points={10} className="absolute bottom-8 left-[10%] w-10 h-10 text-[var(--pink)] opacity-80 hidden sm:block" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-display font-extrabold text-2xl md:text-4xl text-[var(--cream)] leading-[1.2]">
            Une corde qui a assuré des grimpeurs en falaise mérite mieux que la benne.{" "}
            <span className="text-[var(--orange)]">Elle devient la laisse qui accompagne votre chien.</span>
          </p>
        </div>
      </section>

      {/* ── ENGAGEMENTS ───────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-14">
            <span className="inline-block pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
              Nos engagements
            </span>
            <h2 className="mt-5 font-display font-extrabold text-3xl md:text-5xl text-[var(--black)] leading-[1.05]">
              Trois convictions, <span className="text-[var(--orange)]">une seule laisse</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Pillar
              bg="var(--pink)"
              Icon={Recycle}
              title="Recyclage"
              text="Des cordes d'escalade récupérées et revalorisées : moins de déchets, autant de solidité."
            />
            <Pillar
              bg="var(--cream)"
              Icon={ShieldCheck}
              title="Solidité"
              text="Une matière conçue pour retenir un grimpeur. Votre chien est entre de très bonnes mains."
            />
            <Pillar
              bg="var(--orange)"
              color="#fff"
              Icon={Hand}
              title="Fait main"
              text="Chaque laisse est nouée à la main en France, en petite série, avec soin."
            />
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="bg-[var(--pink)] border-y-[2.5px] border-[var(--black)] py-14 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--black)] leading-tight">
            Prêt à offrir une seconde vie à une corde&nbsp;?
          </h2>
          <p className="mt-3 text-[15px] font-semibold text-[var(--black)]/70">
            Composez la laisse de votre chien : type, longueur, couleurs.
          </p>
          <div className="mt-8">
            <Link href="/produit" className="btn-rosa text-[15px]">
              Configurer ma laisse
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Pillar({
  bg,
  color = "var(--black)",
  Icon,
  title,
  text,
}: {
  bg: string;
  color?: string;
  Icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div
      className="card-rosa p-8 text-center"
      style={{ background: bg, color, boxShadow: "5px 5px 0 0 var(--black)" }}
    >
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-full border-[2.5px] flex items-center justify-center"
        style={{ borderColor: color }}
      >
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="font-display font-extrabold text-xl mb-2">{title}</h3>
      <p className="text-[14px] leading-relaxed opacity-85">{text}</p>
    </div>
  );
}
