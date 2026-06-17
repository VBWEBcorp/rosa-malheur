"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import RetroStar from "./RetroStar";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_NAME = "cookie_consent";

function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setConsent(consent: ConsentState) {
  localStorage.setItem(COOKIE_NAME, JSON.stringify(consent));
}

export function useCookieConsent() {
  const [consent, setConsentState] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsentState(getConsent());
  }, []);

  return consent;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    setConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  }

  function rejectAll() {
    setConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  }

  function savePreferences() {
    setConsent({ necessary: true, analytics, marketing });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="max-w-2xl mx-auto card-rosa bg-[var(--cream)] overflow-hidden"
        style={{ boxShadow: "6px 6px 0 0 var(--black)" }}
      >
        {/* En-tête avec logo */}
        <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b-[2.5px] border-[var(--black)] text-center">
          <button
            onClick={rejectAll}
            aria-label="Fermer (refuser tout)"
            className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-[var(--black)] text-[var(--black)] hover:bg-[var(--pink)] transition"
          >
            <X size={15} strokeWidth={2.5} />
          </button>

          {/* Logo en petit */}
          <BrandLogo className="h-11 sm:h-12 w-auto object-contain mx-auto mb-4" />

          <p className="inline-flex items-center gap-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1.5">
            <RetroStar points={8} className="w-3 h-3 text-[var(--orange)]" />
            Vie privée
          </p>
          <h3 className="font-display font-extrabold text-2xl text-[var(--black)] leading-tight">
            On respecte votre choix
          </h3>
        </div>

        {/* Corps */}
        <div className="px-6 sm:px-8 pt-6 pb-7 bg-white">
          <p className="text-[13px] md:text-[14px] font-semibold text-[var(--black)]/70 leading-relaxed text-center mb-6 max-w-md mx-auto">
            Ce site utilise quelques cookies pour assurer le panier, votre connexion et,
            si vous l&apos;acceptez, mesurer la fréquentation de manière anonyme.
          </p>

          {showDetails && (
            <div className="space-y-3 mb-6">
              <ConsentRow
                label="Nécessaires"
                description="Panier, connexion, sécurité — toujours actifs."
                checked
                disabled
              />
              <ConsentRow
                label="Mesure d'audience"
                description="Statistiques anonymes pour améliorer le site."
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentRow
                label="Marketing"
                description="Personnalisation et publicités ciblées."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <button onClick={acceptAll} className="btn-rosa flex-1">
              Tout accepter
            </button>
            {showDetails ? (
              <button onClick={savePreferences} className="btn-rosa-outline flex-1">
                Enregistrer
              </button>
            ) : (
              <button onClick={() => setShowDetails(true)} className="btn-rosa-outline flex-1">
                Personnaliser
              </button>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-[12px] font-bold">
            <button
              onClick={rejectAll}
              className="text-[var(--black)]/55 hover:text-[var(--orange)] transition"
            >
              Refuser tout
            </button>
            <span className="text-[var(--black)]/25">·</span>
            <Link
              href="/pages/politique-confidentialite"
              className="text-[var(--black)]/55 hover:text-[var(--orange)] transition"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border-2 transition ${
        disabled
          ? "bg-[var(--cream)]/60 border-[var(--black)]/10 cursor-not-allowed"
          : "border-[var(--black)]/15 cursor-pointer hover:border-[var(--black)]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]">
          {label}
        </p>
        <p className="text-[12px] font-semibold text-[var(--black)]/55 mt-0.5">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 accent-[var(--orange)] shrink-0"
      />
    </label>
  );
}
