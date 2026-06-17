"use client";

import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import RetroStar from "./RetroStar";

export default function CartDrawer() {
  const { items, total, itemCount, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-[var(--cream)] flex flex-col border-l-[2.5px] border-[var(--black)] transition-transform duration-400 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5 border-b-[2.5px] border-[var(--black)] flex items-center justify-between">
          <h2 className="font-display font-extrabold text-3xl text-[var(--black)] leading-none flex items-center gap-3">
            Panier
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-sm bg-[var(--orange)] text-white rounded-full border-2 border-[var(--black)]">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 -mr-2 text-[var(--black)] hover:text-[var(--orange)] transition"
            aria-label="Fermer"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
              <RetroStar points={10} className="absolute inset-0 w-full h-full text-[var(--pink)]" />
              <ShoppingBag size={40} strokeWidth={2} className="relative text-[var(--black)]" />
            </div>
            <p className="font-display font-extrabold text-2xl text-[var(--black)] mb-2">
              Panier vide
            </p>
            <p className="text-[14px] text-[var(--black)]/60 mb-8 leading-relaxed max-w-xs">
              Composez votre laisse en cordes d&apos;escalade recyclées.
            </p>
            <Link href="/produit" onClick={closeCart} className="btn-rosa">
              Voir la laisse
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 divide-y-2 divide-[var(--black)]/10">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4 py-5 first:pt-0">
                  <div className="w-20 h-24 card-rosa bg-[var(--pink)] overflow-hidden shrink-0">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--black)]/40">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display font-extrabold text-[16px] text-[var(--black)] leading-tight line-clamp-2">
                      {item.product.name}
                    </p>
                    {item.variant && (
                      <p className="mt-1 text-[11px] font-bold text-[var(--orange)] leading-snug">
                        {item.variant}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center pill-rosa bg-white">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-7 h-8 flex items-center justify-center text-[var(--black)] hover:text-[var(--orange)] transition"
                          aria-label="Diminuer"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-7 text-center text-[13px] font-display font-extrabold text-[var(--black)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-7 h-8 flex items-center justify-center text-[var(--black)] hover:text-[var(--orange)] transition"
                          aria-label="Augmenter"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                      <p className="font-display font-extrabold text-[15px] text-[var(--black)]">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="self-start p-1 text-[var(--black)]/40 hover:text-[var(--orange)] transition"
                    aria-label="Retirer"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t-[2.5px] border-[var(--black)] px-6 sm:px-8 py-6 space-y-5">
              <FreeShippingProgress total={total} />

              <div className="flex items-end justify-between">
                <span className="text-[12px] uppercase tracking-wide font-bold text-[var(--black)]/60">
                  Sous-total
                </span>
                <span className="font-display font-extrabold text-3xl text-[var(--black)]">
                  {formatPrice(total)}
                </span>
              </div>

              <p className="text-[12px] text-[var(--black)]/50 leading-relaxed">
                Livraison &amp; remises calculées à l&apos;étape suivante.
              </p>

              <Link href="/checkout" onClick={closeCart} className="btn-rosa w-full">
                Passer commande
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function FreeShippingProgress({ total }: { total: number }) {
  const threshold = 6000; // 60 € en centimes
  const progress = Math.min((total / threshold) * 100, 100);
  const remaining = threshold - total;

  if (total >= threshold) {
    return (
      <div className="text-center py-3 px-4 pill-rosa bg-[var(--pink)]">
        <p className="font-display font-extrabold text-[14px] text-[var(--black)]">
          ✦ Livraison offerte ✦
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[12px] font-semibold text-[var(--black)]/70 mb-2 text-center">
        Plus que <span className="text-[var(--orange)] font-extrabold">{formatPrice(remaining)}</span> pour la livraison offerte
      </p>
      <div className="w-full h-2 rounded-full bg-white border-2 border-[var(--black)] overflow-hidden">
        <div
          className="h-full bg-[var(--orange)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
