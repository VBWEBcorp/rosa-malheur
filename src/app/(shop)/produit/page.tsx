import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductClientSection from "@/components/shop/ProductClientSection";
import RetroStar from "@/components/shop/RetroStar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "La laisse — corde d'escalade recyclée",
  description:
    "Configurez votre laisse Rosa Malheur : simple ou multiposition, longueur 1,50 / 2 / 3 / 5 m, couleur de la corde et du mousqueton. Faite main en cordes d'escalade recyclées.",
};

export default async function ProduitPage() {
  await connectDB();
  const p = await Product.findOne({ isActive: true })
    .sort({ isFeatured: -1, createdAt: 1 })
    .lean();

  if (!p) {
    return (
      <div className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-3xl text-[var(--black)]">
            Produit indisponible
          </h1>
          <p className="mt-3 text-[var(--black)]/70">La laisse arrive très bientôt.</p>
          <Link href="/" className="btn-rosa mt-6">Retour à l&apos;accueil</Link>
        </div>
      </div>
    );
  }

  const images = (p.images || []).filter((img) => img?.url);
  const mainImage = images[0]?.url;

  const variants = (p.variants || []).map((v) => ({
    name: v.name,
    options: (v.options || []).map((o) => ({
      value: o.value,
      priceModifier: o.priceModifier || 0,
      stock: o.stock ?? 0,
    })),
  }));

  return (
    <div className="bg-[var(--cream)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Fil d'ariane */}
        <nav className="text-[12px] font-bold uppercase tracking-wide text-[var(--black)]/50 mb-8">
          <Link href="/" className="hover:text-[var(--orange)]">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--black)]">La laisse</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
          {/* Galerie */}
          <div className="md:sticky md:top-28">
            <div className="card-rosa relative aspect-square overflow-hidden bg-[var(--pink)]" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
              <RetroStar points={8} className="absolute top-4 right-4 w-10 h-10 text-[var(--orange)] z-10" />
              {mainImage ? (
                <Image src={mainImage} alt={p.name} fill className="object-cover" sizes="(max-width:768px) 90vw, 32rem" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <span className="font-display font-extrabold text-xl text-[var(--black)]/70">
                    Photos à venir
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-square card-rosa overflow-hidden bg-[var(--cream)]">
                    <Image src={img.url} alt={img.alt || p.name} fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos + configurateur */}
          <div>
            <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
              ♻️ Corde d&apos;escalade recyclée
            </span>
            <h1 className="mt-4 font-display font-extrabold text-4xl md:text-5xl leading-[0.95] text-[var(--black)]">
              {p.name}
            </h1>
            {p.shortDescription && (
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--black)]/80">
                {p.shortDescription}
              </p>
            )}

            <ProductClientSection
              productId={String(p._id)}
              price={p.price}
              compareAtPrice={p.compareAtPrice}
              stock={p.stock}
              variants={variants}
            />

            {p.description && (
              <div
                className="prose prose-sm max-w-none mt-10 pt-8 border-t-2 border-[var(--black)]/10 text-[var(--black)]/85"
                dangerouslySetInnerHTML={{ __html: p.description }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
