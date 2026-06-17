"use client";

import { useEffect, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import MondialRelayWidget, { MondialRelayPoint } from "./MondialRelayWidget";

interface Props {
  brandCode: string;
  postCode?: string;
  value: MondialRelayPoint | null;
  onSelect: (point: MondialRelayPoint) => void;
}

/**
 * Sélecteur de point relais « comme les vrais sites » : on n'affiche pas le
 * widget brut (moche + déborde sur mobile). À la place :
 *  - un bouton clair quand rien n'est choisi,
 *  - une carte de confirmation lisible une fois le point sélectionné,
 *  - le widget Mondial Relay ouvert dans une modale (plein écran sur mobile).
 * Le widget n'est monté que quand la modale est ouverte (chargement à la demande).
 */
export default function MondialRelayPicker({
  brandCode,
  postCode,
  value,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

  // Verrouille le scroll de la page quand la modale est ouverte.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fermeture à la touche Échap.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div>
      {value ? (
        // ── État sélectionné : carte de confirmation lisible ──────────────
        <div className="flex items-start gap-4 px-4 sm:px-5 py-4 rounded-2xl border-2 border-[var(--black)] bg-[var(--pink)]/40">
          <span className="w-11 h-11 rounded-full border-2 border-[var(--black)] bg-[var(--pink)] text-[var(--black)] flex items-center justify-center shrink-0">
            <MapPin size={17} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0 text-[13px] leading-relaxed">
            <p className="font-display font-extrabold text-[15px] text-[var(--black)]">{value.Nom}</p>
            <p className="text-[var(--black)]/65 mt-0.5">
              {value.Adresse1}
              {value.Adresse2 ? `, ${value.Adresse2}` : ""}
            </p>
            <p className="text-[var(--black)]/65">
              {value.CP} {value.Ville}
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] hover:opacity-70 transition"
            >
              Changer de point relais
            </button>
          </div>
          <span className="w-6 h-6 rounded-full bg-[var(--orange)] border-2 border-[var(--black)] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check size={13} strokeWidth={3} />
          </span>
        </div>
      ) : (
        // ── État vide : bouton d'ouverture ────────────────────────────────
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--black)]/30 bg-[var(--cream)]/60 px-6 py-6 text-[13px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] hover:border-[var(--black)] hover:bg-[var(--cream)] transition"
        >
          <MapPin size={18} strokeWidth={2.5} className="text-[var(--orange)]" />
          Choisir un point relais
        </button>
      )}

      {/* ── Modale ──────────────────────────────────────────────────────── */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-[90] flex items-stretch sm:items-center justify-center sm:p-6 pointer-events-none">
            <div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:rounded-3xl sm:border-[2.5px] sm:border-[var(--black)] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="px-5 sm:px-7 pt-6 pb-5 border-b-[2.5px] border-[var(--black)] flex items-start justify-between shrink-0">
                <div>
                  <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1.5">
                    Retrait
                  </p>
                  <h2 className="font-display font-extrabold text-2xl text-[var(--black)] leading-none">
                    Choisissez votre point relais
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-white border-2 border-[var(--black)] text-[var(--black)] hover:bg-[var(--pink)] transition flex items-center justify-center shrink-0"
                  aria-label="Fermer"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4">
                <MondialRelayWidget
                  brandCode={brandCode}
                  postCode={postCode}
                  onSelect={(p) => {
                    onSelect(p);
                    setOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
