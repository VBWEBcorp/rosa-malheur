"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { usePageTitle } from "@/lib/use-page-title";
import RetroStar from "@/components/shop/RetroStar";

export default function LoginPage() {
  usePageTitle("Connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(loginEmail: string, loginPassword: string) {
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (!result || result.error) {
        setLoading(false);
        setError(result?.error || "Email ou mot de passe incorrect");
        return;
      }

      // Polling /api/auth/session pour récupérer le rôle (et router admin/client)
      let destination = "/";
      for (let i = 0; i < 5; i++) {
        try {
          const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
          const session = await sessionRes.json();
          if (session?.user?.role) {
            destination = session.user.role === "admin" ? "/admin" : "/account";
            break;
          }
        } catch {
          // ignore, retry
        }
        await new Promise((r) => setTimeout(r, 200));
      }

      setLoading(false);
      window.location.href = destination;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    void handleLogin(email, password);
    return false;
  }

  return (
    <div className="bg-[var(--cream)] min-h-[85vh] py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <RetroStar points={8} className="absolute top-12 left-[10%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
        <RetroStar points={10} className="absolute bottom-16 right-[12%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <div className="text-center mb-9">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
            Espace client
          </span>
          <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
            Content de vous <span className="text-[var(--orange)]">revoir</span>
          </h1>
        </div>

        {/* Card */}
        <div className="card-rosa bg-white px-6 sm:px-9 py-9 sm:py-10" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
          {error && (
            <div className="mb-6 px-4 py-3 rounded-2xl border-2 border-red-300 bg-red-50 text-red-700 text-[13px] font-bold text-center">
              {error}
            </div>
          )}

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

            <div>
              <label htmlFor="password" className="block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[var(--cream)]/40 rounded-2xl border-2 border-[var(--black)]/20 text-[15px] text-[var(--black)] focus:border-[var(--black)] focus:ring-0 outline-none transition placeholder:text-[var(--black)]/30"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-rosa w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Connexion en cours…" : <>Se connecter <ArrowRight size={16} strokeWidth={2.5} /></>}
            </button>

            <div className="text-center pt-1">
              <Link href="/mot-de-passe-oublie" className="text-[13px] font-bold text-[var(--orange)] hover:opacity-70 transition">
                Mot de passe oublié&nbsp;?
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[13px] text-[var(--black)]/60 font-semibold leading-relaxed">
            Pas encore de compte&nbsp;? Il sera créé automatiquement lors de votre première commande,
            avec un email pour choisir votre mot de passe.
          </p>
        </div>
      </div>
    </div>
  );
}
