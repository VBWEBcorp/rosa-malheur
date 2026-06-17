import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Recycle, PawPrint, Hand } from "lucide-react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { formatPrice } from "@/lib/utils";
import { getContent } from "@/lib/content";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import HeroSection from "@/components/shop/HeroSection";
import RetroStar from "@/components/shop/RetroStar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rosa Malheur · Laisses pour chien artisanales",
  description:
    "Laisses pour chien faites main à partir de cordes d'escalade recyclées : simples ou multiposition, du 1,50 m au 5 m, corde et mousqueton au choix.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  let product: {
    slug: string;
    name: string;
    price: number;
    image?: string;
    shortDescription?: string;
    variants: { name: string; options: { value: string }[] }[];
  } | null = null;

  const t = await getContent();

  try {
    await connectDB();
    const p = await Product.findOne({ isActive: true }).sort({ isFeatured: -1, createdAt: 1 }).lean();
    if (p) {
      product = {
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.images?.[0]?.url,
        shortDescription: p.shortDescription,
        variants: (p.variants || []).map((v) => ({
          name: v.name,
          options: (v.options || []).map((o) => ({ value: o.value })),
        })),
      };
    }
  } catch {
    // ignore — affichage dégradé sans données produit
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/rosa-malheur.png`,
      description: SITE_DESCRIPTION,
      email: "contact@rosamalheur.fr",
      areaServed: "FR",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "fr-FR",
    },
  ];

  return (
    <div className="bg-[var(--cream)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />

      {/* ── VALEURS ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 border-t-[2.5px] border-[var(--black)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ValueCard
              bg="var(--pink)"
              Icon={Recycle}
              title={t("home_val1_title")}
              text={t("home_val1_text")}
            />
            <ValueCard
              bg="var(--cream)"
              Icon={PawPrint}
              title={t("home_val2_title")}
              text={t("home_val2_text")}
            />
            <ValueCard
              bg="var(--orange)"
              color="#fff"
              Icon={Hand}
              title={t("home_val3_title")}
              text={t("home_val3_text")}
            />
          </div>
        </div>
      </section>

      {/* ── PRODUIT EN VEDETTE ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[var(--black)] relative overflow-hidden">
        <RetroStar points={8} className="absolute top-10 right-[10%] w-16 h-16 text-[var(--orange)] opacity-90" />
        <RetroStar points={10} className="absolute bottom-10 left-[8%] w-10 h-10 text-[var(--pink)] opacity-80" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center relative">
          {/* Visuel */}
          <div className="order-1">
            <div className="blob bg-[var(--pink)] border-[2.5px] border-[var(--cream)] aspect-square relative overflow-hidden">
              {product?.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 90vw, 32rem" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <span className="font-display font-extrabold text-2xl text-[var(--black)]">
                    Photo de la laisse à venir
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Texte */}
          <div className="order-2 text-[var(--cream)]">
            <span className="inline-flex items-center gap-2 pill-rosa border-[var(--cream)]/40 px-4 py-1.5 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--cream)]">
              {t("home_produit_eyebrow")}
            </span>
            <h2 className="mt-5 font-display font-extrabold text-4xl md:text-5xl leading-[0.95]">
              {product?.name || "La laisse Rosa Malheur"}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--cream)]/80 max-w-md">
              {product?.shortDescription ||
                "Simple ou multiposition, du 1,50 m au 5 m, corde et mousqueton au choix."}
            </p>

            {/* Aperçu des options */}
            {product && product.variants.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {product.variants.map((v) => (
                  <li key={v.name} className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display font-extrabold text-[var(--pink)] text-sm uppercase tracking-wide">
                      {v.name} :
                    </span>
                    <span className="text-[14px] text-[var(--cream)]/85">
                      {v.options.map((o) => o.value).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/produit" className="btn-rosa text-[15px]">
                {t("home_produit_cta")}
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              {product && (
                <p className="font-display font-extrabold text-2xl text-[var(--cream)]">
                  dès {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── L'HISTOIRE / FABRICATION ────────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <RetroStar points={8} className="absolute top-12 left-[8%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
        <RetroStar points={8} className="absolute bottom-12 right-[10%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--orange)] text-white px-5 py-2 text-[12px] font-display font-extrabold uppercase tracking-wide">
            {t("home_matiere_eyebrow")}
          </span>
          <h2 className="mt-6 font-display font-extrabold text-4xl md:text-5xl leading-[0.95] text-[var(--black)]">
            {t("home_matiere_title")}{" "}
            <span className="text-[var(--orange)]">{t("home_matiere_title_accent")}</span>
          </h2>
          <p className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-[var(--black)]/80 whitespace-pre-line">
            {t("home_matiere_text")}
          </p>
          <div className="mt-10">
            <Link href="/pages/a-propos" className="btn-rosa-outline text-[15px]">
              {t("home_matiere_cta")}
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="bg-[var(--pink)] border-y-[2.5px] border-[var(--black)] py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--black)] leading-tight">
              {t("home_cta_title")}
            </h2>
            <p className="mt-2 text-[15px] font-semibold text-[var(--black)]/70">
              {t("home_cta_subtitle")}
            </p>
          </div>
          <Link href="/contact" className="btn-rosa text-[15px] shrink-0">
            {t("home_cta_button")}
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ValueCard({
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
      className="card-rosa p-7 text-center"
      style={{ background: bg, color, boxShadow: "5px 5px 0 0 var(--black)" }}
    >
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-full border-[2.5px] flex items-center justify-center"
        style={{ borderColor: color }}
        aria-hidden
      >
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="font-display font-extrabold text-xl mb-2">{title}</h3>
      <p className="text-[14px] leading-relaxed opacity-85">{text}</p>
    </div>
  );
}
