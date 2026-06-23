"use client";

import { useEffect, useState } from "react";
import { Check, MapPin, X, Pencil, Keyboard } from "lucide-react";
import MondialRelayWidget, { MondialRelayPoint } from "./MondialRelayWidget";

interface Props {
  brandCode: string;
  postCode?: string;
  value: MondialRelayPoint | null;
  onSelect: (point: MondialRelayPoint) => void;
}

/**
 * Sélection du point relais : la **carte Mondial Relay** d'abord (le client
 * clique son point relais dans une modale), avec une **saisie manuelle en
 * secours** si la carte ne se charge pas (AdBlock, pare-feu) ou si le client
 * préfère taper. Les deux modes produisent le même objet `MondialRelayPoint`,
 * donc l'enregistrement de la commande est identique dans les deux cas.
 *
 * Note : la carte officielle utilise un Code Enseigne de démonstration tant que
 * la boutique n'a pas de compte pro Mondial Relay. La saisie manuelle reste, elle,
 * 100% fiable sans aucun compte.
 */
export default function RelayPicker({ brandCode, postCode, value, onSelect }: Props) {
  const [mapOpen, setMapOpen] = useState(false);
  const [manual, setManual] = useState(false);

  // Champs de la saisie manuelle.
  const [nom, setNom] = useState(value?.Nom ?? "");
  const [adresse, setAdresse] = useState(value?.Adresse1 ?? "");
  const [cp, setCp] = useState(value?.CP ?? postCode ?? "");
  const [ville, setVille] = useState(value?.Ville ?? "");
  const [error, setError] = useState<string | null>(null);

  // Verrouille le scroll + fermeture Échap quand la modale carte est ouverte.
  useEffect(() => {
    document.body.style.overflow = mapOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mapOpen]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMapOpen(false);
    }
    if (mapOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mapOpen]);

  function openManual() {
    setNom(value?.Nom ?? "");
    setAdresse(value?.Adresse1 ?? "");
    setCp(value?.CP ?? postCode ?? "");
    setVille(value?.Ville ?? "");
    setError(null);
    setManual(true);
  }

  function validerManuel() {
    if (!nom.trim() || !adresse.trim() || !cp.trim() || !ville.trim()) {
      setError("Merci de renseigner le nom, l'adresse, le code postal et la ville du point relais.");
      return;
    }
    setError(null);
    onSelect({
      ID: `MANUEL-${cp.trim()}`,
      Nom: nom.trim(),
      Adresse1: adresse.trim(),
      CP: cp.trim(),
      Ville: ville.trim(),
      Pays: "FR",
    });
    setManual(false);
  }

  return (
    <div>
      {/* ── État sélectionné (et pas en édition manuelle) ─────────────────── */}
      {value && !manual && (
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
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="inline-flex items-center gap-1.5 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] hover:opacity-70 transition"
              >
                <MapPin size={13} strokeWidth={2.5} />
                Changer sur la carte
              </button>
              <button
                type="button"
                onClick={openManual}
                className="inline-flex items-center gap-1.5 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/55 hover:text-[var(--black)] transition"
              >
                <Pencil size={13} strokeWidth={2.5} />
                Modifier à la main
              </button>
            </div>
          </div>
          <span className="w-6 h-6 rounded-full bg-[var(--orange)] border-2 border-[var(--black)] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check size={13} strokeWidth={3} />
          </span>
        </div>
      )}

      {/* ── État choix (rien de sélectionné) ─────────────────────────────── */}
      {!value && !manual && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--black)]/30 bg-[var(--cream)]/60 px-6 py-6 text-[13px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] hover:border-[var(--black)] hover:bg-[var(--cream)] transition"
          >
            <MapPin size={18} strokeWidth={2.5} className="text-[var(--orange)]" />
            Choisir un point relais sur la carte
          </button>
          <button
            type="button"
            onClick={openManual}
            className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--black)]/55 hover:text-[var(--black)] transition"
          >
            <Keyboard size={14} strokeWidth={2} />
            La carte ne s'affiche pas ? Saisir mon point relais à la main
          </button>
        </div>
      )}

      {/* ── Saisie manuelle (secours) ─────────────────────────────────────── */}
      {manual && (
        <div className="space-y-3 rounded-2xl border-2 border-[var(--black)]/15 bg-[var(--cream)]/40 p-4 sm:p-5">
          <p className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/70">
            Saisie de votre point relais
          </p>
          <RelayField label="Nom du point relais" value={nom} onChange={setNom} placeholder="Ex. Tabac Presse du Centre" />
          <RelayField label="Adresse" value={adresse} onChange={setAdresse} placeholder="Ex. 12 rue de la Paix" />
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <RelayField label="Code postal" value={cp} onChange={setCp} placeholder="35000" />
            </div>
            <div className="col-span-2">
              <RelayField label="Ville" value={ville} onChange={setVille} placeholder="Rennes" />
            </div>
          </div>
          {error && <p className="text-[12px] font-bold text-[var(--orange)]">{error}</p>}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="button" onClick={validerManuel} className="btn-rosa text-[14px]">
              <Check size={16} strokeWidth={2.5} />
              Valider
            </button>
            <button
              type="button"
              onClick={() => {
                setManual(false);
                setMapOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] hover:opacity-70 transition"
            >
              <MapPin size={13} strokeWidth={2.5} />
              Revenir à la carte
            </button>
          </div>
        </div>
      )}

      {/* ── Modale carte Mondial Relay ────────────────────────────────────── */}
      {mapOpen && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
            onClick={() => setMapOpen(false)}
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
                  onClick={() => setMapOpen(false)}
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
                    setMapOpen(false);
                    setManual(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMapOpen(false);
                    openManual();
                  }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--black)]/55 hover:text-[var(--black)] transition"
                >
                  <Keyboard size={14} strokeWidth={2} />
                  La carte ne s'affiche pas ? Saisir à la main
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RelayField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-[var(--black)]/55 mb-1.5">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm rounded-2xl border-2 border-[var(--black)]/15 bg-white placeholder:text-[var(--black)]/30 focus:border-[var(--orange)] focus:ring-0 outline-none transition"
      />
    </label>
  );
}
