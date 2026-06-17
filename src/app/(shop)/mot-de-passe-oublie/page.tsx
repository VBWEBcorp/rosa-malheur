"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { usePageTitle } from "@/lib/use-page-title";
import RetroStar from "@/components/shop/RetroStar";

export default function ForgotPasswordPage() {
  usePageTitle("Mot de passe oublié");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }

      setDone(true);
      setLoading(false);
    } catch {
      setError("Erreur réseau, réessayez");
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--cream)] min-h-[85vh] py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <RetroStar points={8} className="absolute top-12 left-[10%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
        <RetroStar points={10} className="absolute bottom-16 right-[12%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-9">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
            Espace client
          </span>
          <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
            Mot de passe <span className="text-[var(--orange)]">oublié</span>
          </h1>
        </div>

        <div className="card-rosa bg-white px-6 sm:px-9 py-9 sm:py-10" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-[var(--black)] bg-[var(--pink)] text-[var(--black)] flex items-center justify-center mx-auto mb-6">
                <Check size={22} strokeWidth={2.5} />
              </div>
              <p className="text-[15px] text-[var(--black)]/80 font-semibold leading-relaxed">
                Si un compte existe pour cette adresse, vous recevrez un email avec un lien de
                réinitialisation dans quelques instants.
              </p>
              <Link href="/login" className="inline-block mt-8 text-[14px] font-display font-extrabold text-[var(--orange)] hover:opacity-70 transition">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 px-4 py-3 rounded-2xl border-2 border-red-300 bg-red-50 text-red-700 text-[13px] font-bold text-center">
                  {error}
                </div>
              )}

              <p className="text-[14px] text-[var(--black)]/65 font-semibold mb-7 leading-relaxed">
                Indiquez l&apos;adresse email de votre compte&nbsp;: on vous envoie un lien pour choisir un nouveau mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-[var(--cream)]/40 rounded-2xl border-2 border-[var(--black)]/20 text-[15px] text-[var(--black)] focus:border-[var(--black)] focus:ring-0 outline-none transition placeholder:text-[var(--black)]/30"
                    placeholder="vous@exemple.com"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-rosa w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Envoi en cours…" : <>Envoyer le lien <ArrowRight size={16} strokeWidth={2.5} /></>}
                </button>
              </form>
            </>
          )}
        </div>

        {!done && (
          <div className="mt-8 text-center">
            <Link href="/login" className="text-[14px] text-[var(--black)]/60 font-semibold hover:text-[var(--orange)] transition">
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
