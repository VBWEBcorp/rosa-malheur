"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getMarketing, type MarketingData } from "@/lib/marketingCache";
import RetroStar from "./RetroStar";

type PopupData = NonNullable<MarketingData["popup"]>;

const DISMISSED_KEY = "promo_popup_dismissed";

export default function PromoPopup() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ne pas afficher si déjà fermé dans cette session
    if (typeof window !== "undefined" && sessionStorage.getItem(DISMISSED_KEY)) return;

    getMarketing().then((data) => {
      if (data.popup?.isActive && data.popup?.title) {
        setPopup(data.popup);
        setTimeout(() => setVisible(true), (data.popup!.delay || 5) * 1000);
      }
    });
  }, []);

  function close() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!popup || !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-[var(--black)]/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={close}
      />

      {/* Pop-up */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div
          className="card-rosa bg-[var(--cream)] overflow-hidden max-w-md w-full relative transform transition-all duration-300 scale-100"
          style={{ boxShadow: "8px 8px 0 0 var(--black)" }}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Fermer"
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white border-2 border-[var(--black)] rounded-full flex items-center justify-center text-[var(--black)] hover:bg-[var(--pink)] transition"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Image */}
          {popup.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={popup.image}
              alt={popup.title}
              className="w-full h-52 object-cover border-b-[2.5px] border-[var(--black)]"
            />
          )}

          {/* Contenu */}
          <div className="p-7 text-center relative">
            {!popup.image && (
              <RetroStar
                points={8}
                className="w-12 h-12 text-[var(--orange)] mx-auto mb-4"
              />
            )}
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[var(--black)] leading-tight mb-2">
              {popup.title}
            </h2>
            {popup.description && (
              <p className="text-[14px] text-[var(--black)]/70 leading-relaxed mb-6 font-semibold">
                {popup.description}
              </p>
            )}
            <a
              href={popup.buttonUrl || "/produit"}
              onClick={close}
              className="btn-rosa w-full"
            >
              {popup.buttonText || "En profiter"}
            </a>
            <button
              onClick={close}
              className="mt-3 block mx-auto text-[13px] font-bold text-[var(--black)]/45 hover:text-[var(--black)] transition"
            >
              Non merci
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
