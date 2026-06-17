"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import ReviewSection from "./ReviewSection";

interface Variant {
  name: string;
  options: { value: string; priceModifier: number; stock: number }[];
}

interface ProductClientProps {
  productId: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  variants: Variant[];
}

/** Noms de couleurs → code hex, pour afficher des pastilles plutôt que du texte. */
const COLOR_MAP: Record<string, string> = {
  noir: "#1A1A1A",
  blanc: "#F4F1EA",
  gris: "#9AA0A6",
  beige: "#D8C3A5",
  marron: "#7B4B2A",
  rouge: "#C0392B",
  bordeaux: "#6E1423",
  orange: "#DC480F",
  jaune: "#E3B341",
  vert: "#3B7A57",
  bleu: "#2E5BBA",
  turquoise: "#2BB6A3",
  rose: "#E1798A",
  violet: "#7A5AA0",
  argent: "#C7CBD1",
  or: "#D4AF37",
  dore: "#D4AF37",
  bronze: "#B08D57",
  cuivre: "#B87333",
};

function colorHex(value: string): string | null {
  const key = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
  return COLOR_MAP[key] ?? null;
}

export default function ProductClientSection({
  productId,
  price,
  compareAtPrice,
  stock,
  variants,
}: ProductClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    variants.forEach((v) => {
      if (v.options.length > 0) defaults[v.name] = v.options[0].value;
    });
    return defaults;
  });

  const currentPrice =
    price +
    Object.entries(selectedVariants).reduce((acc, [variantName, optionValue]) => {
      const variant = variants.find((v) => v.name === variantName);
      const option = variant?.options.find((o) => o.value === optionValue);
      return acc + (option?.priceModifier || 0);
    }, 0);

  async function addToCart() {
    const variant = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    const success = await addItem(productId, variant || undefined, quantity);
    if (success) {
      toast.success("Produit ajouté au panier");
    } else {
      toast.error("Erreur lors de l'ajout au panier");
    }
  }

  return (
    <>
      {/* Prix */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <span className="font-display font-extrabold text-4xl text-[var(--black)]">{formatPrice(currentPrice)}</span>
        {compareAtPrice && compareAtPrice > currentPrice && (
          <span className="text-lg text-[var(--black)]/40 line-through">{formatPrice(compareAtPrice)}</span>
        )}
        {compareAtPrice && compareAtPrice > currentPrice && (
          <span className="font-display font-extrabold text-sm text-white bg-[var(--orange)] px-2.5 py-1 rounded-full border-2 border-[var(--black)]">
            -{Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Variantes */}
      {variants.map((variant) => {
        const isColor =
          /couleur/i.test(variant.name) && variant.options.every((o) => colorHex(o.value));
        return (
          <div key={variant.name} className="mt-7">
            <label className="block font-display font-extrabold text-sm uppercase tracking-wide text-[var(--black)] mb-3">
              {variant.name}{" "}
              <span className="text-[var(--orange)]">· {selectedVariants[variant.name]}</span>
            </label>

            {isColor ? (
              <div className="flex flex-wrap gap-3">
                {variant.options.map((option) => {
                  const selected = selectedVariants[variant.name] === option.value;
                  const oos = option.stock === 0;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      title={option.value}
                      aria-label={option.value}
                      disabled={oos}
                      onClick={() =>
                        setSelectedVariants((prev) => ({ ...prev, [variant.name]: option.value }))
                      }
                      className={`relative w-11 h-11 rounded-full border-2 border-[var(--black)] transition-transform ${
                        selected
                          ? "ring-[3px] ring-[var(--orange)] ring-offset-2 ring-offset-[var(--cream)] scale-110"
                          : "hover:scale-105"
                      } ${oos ? "opacity-30 cursor-not-allowed" : ""}`}
                      style={{ background: colorHex(option.value) || "#ccc" }}
                    >
                      {oos && (
                        <span className="absolute inset-0 flex items-center justify-center text-[var(--black)] font-bold">
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {variant.options.map((option) => {
                  const selected = selectedVariants[variant.name] === option.value;
                  const oos = option.stock === 0;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={oos}
                      onClick={() =>
                        setSelectedVariants((prev) => ({ ...prev, [variant.name]: option.value }))
                      }
                      className={`px-4 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                        selected
                          ? "border-[var(--black)] bg-[var(--orange)] text-white shadow-[2px_2px_0_0_var(--black)]"
                          : "border-[var(--black)]/20 bg-white text-[var(--black)] hover:border-[var(--black)]"
                      } ${oos ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                    >
                      {option.value}
                      {option.priceModifier > 0 && (
                        <span className={selected ? "text-white/80" : "text-[var(--black)]/45"}>
                          {" "}
                          +{formatPrice(option.priceModifier)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Quantité + ajout panier */}
      <div className="mt-8 flex items-center gap-3">
        <div className="flex items-center pill-rosa bg-white">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-[var(--black)] hover:text-[var(--orange)] transition" aria-label="Diminuer">
            <Minus size={16} strokeWidth={2.5} />
          </button>
          <span className="w-9 text-center font-display font-extrabold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-[var(--black)] hover:text-[var(--orange)] transition" aria-label="Augmenter">
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        <button
          onClick={addToCart}
          disabled={stock === 0}
          className="btn-rosa flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} strokeWidth={2.5} />
          {stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
        </button>
      </div>

      {/* Stock faible */}
      {stock > 0 && stock <= 5 && (
        <p className="mt-3 text-sm text-[var(--orange)] font-bold">
          Plus que {stock} en stock, foncez !
        </p>
      )}

      <ReviewSection productId={productId} />
    </>
  );
}
