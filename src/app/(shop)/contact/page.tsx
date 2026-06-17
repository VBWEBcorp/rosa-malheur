import { Mail, Clock, Sparkles } from "lucide-react";
import ContactFormClient from "./ContactFormClient";
import RetroStar from "@/components/shop/RetroStar";
import BrandLogo from "@/components/shop/BrandLogo";

export const metadata = {
  title: "Contact",
  description:
    "Une question sur nos laisses, une commande sur-mesure ? Écrivez à Rosa Malheur, on vous répond sous 48h.",
  alternates: { canonical: "/contact" },
};

const INFO = [
  {
    Icon: Mail,
    label: "Email",
    value: "fanny.rabu@hotmail.fr",
    href: "mailto:fanny.rabu@hotmail.fr",
  },
  { Icon: Clock, label: "Réponse", value: "Sous 48h en moyenne" },
  { Icon: Sparkles, label: "Sur-mesure", value: "Une envie particulière ? Parlons-en !" },
];

export default function ContactPage() {
  return (
    <div className="bg-[var(--cream)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-[2.5px] border-[var(--black)] py-14 md:py-20">
        <RetroStar points={8} className="absolute top-8 left-[8%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
        <RetroStar points={8} className="absolute bottom-8 right-[10%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-5 py-2 text-[12px] font-display font-extrabold uppercase tracking-wide">
            Nous contacter
          </span>
          <h1 className="mt-6 font-display font-extrabold text-5xl md:text-6xl text-[var(--black)] leading-[0.9]">
            Écrivez-<span className="text-[var(--orange)]">nous</span>
          </h1>
          <p className="mt-6 text-[16px] text-[var(--black)]/75 leading-relaxed max-w-xl mx-auto font-semibold">
            Une question sur nos laisses, une commande sur-mesure, une collab&nbsp;? On adore
            papoter chiens et cordes. Réponse sous 48h.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        {/* Colonne gauche — visuel de marque + infos */}
        <div className="md:col-span-5">
          <div className="card-rosa bg-[var(--pink)] p-10 mb-10 flex items-center justify-center aspect-[4/5]" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
            <BrandLogo className="w-full max-w-[260px] h-auto" />
          </div>

          <ul className="space-y-5">
            {INFO.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-full border-2 border-[var(--black)] text-[var(--black)] flex items-center justify-center shrink-0">
                  <Icon size={16} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wide font-display font-extrabold text-[var(--orange)] mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="text-[15px] font-semibold text-[var(--black)] hover:text-[var(--orange)] transition">
                      {value}
                    </a>
                  ) : (
                    <p className="text-[15px] font-semibold text-[var(--black)]">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite — formulaire */}
        <div className="md:col-span-7">
          <div className="card-rosa bg-white px-6 sm:px-8 py-8" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
            <h2 className="font-display font-extrabold text-3xl text-[var(--black)] leading-none mb-7">
              Votre message
            </h2>
            <ContactFormClient />
          </div>
        </div>
      </div>
    </div>
  );
}
