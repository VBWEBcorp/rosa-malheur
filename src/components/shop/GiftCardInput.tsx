"use client";

import { useState } from "react";
import { Gift, X, Check, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface AppliedGiftCard {
  code: string;
  balance: number; // centimes
}

/**
 * Saisie/application d'une carte cadeau au checkout. Vérifie le solde via
 * /api/gift-cards/check-balance, puis remonte la carte au parent qui calcule
 * la déduction (le serveur reste l'autorité finale lors du checkout).
 */
export default function GiftCardInput({
  appliedCard,
  onApply,
  onRemove,
  disabled,
}: {
  appliedCard: AppliedGiftCard | null;
  onApply: (card: AppliedGiftCard) => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || checking || disabled) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/gift-cards/check-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Code invalide");
        return;
      }
      onApply({ code: data.code, balance: data.balance });
      setValue("");
    } catch {
      setError("Erreur de vérification");
    } finally {
      setChecking(false);
    }
  }

  if (appliedCard) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border-2 border-[var(--black)]/15 bg-[var(--pink)]/30">
        <div className="flex items-center gap-2 min-w-0">
          <Check size={14} className="text-[var(--orange)] shrink-0" strokeWidth={2.5} />
          <div className="min-w-0">
            <p className="font-mono text-[12px] font-bold text-[var(--black)] truncate">{appliedCard.code}</p>
            <p className="text-[11px] font-semibold text-[var(--black)]/55">Solde : {formatPrice(appliedCard.balance)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="p-1 text-[var(--black)]/40 hover:text-[var(--orange)] disabled:opacity-50"
          aria-label="Retirer la carte cadeau"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Gift size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--black)]/40" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value.toUpperCase());
              if (error) setError(null);
            }}
            placeholder="Carte cadeau (GC-XXXX-XXXX)"
            disabled={disabled || checking}
            className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 bg-white font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-[var(--black)]/30 focus:border-[var(--orange)] focus:ring-0 outline-none transition ${
              error ? "border-[var(--orange)]" : "border-[var(--black)]/15"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || checking || disabled}
          className="px-4 py-2.5 text-[12px] font-display font-extrabold uppercase tracking-wide rounded-full bg-[var(--orange)] text-white border-2 border-[var(--black)] hover:bg-[var(--pink)] hover:text-[var(--black)] disabled:opacity-50 transition flex items-center"
        >
          {checking ? <Loader2 size={14} className="animate-spin" /> : "OK"}
        </button>
      </div>
      {error && <p className="text-[12px] font-bold text-[var(--orange)]">{error}</p>}
    </form>
  );
}
