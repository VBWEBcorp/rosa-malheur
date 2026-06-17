"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { usePageTitle } from "@/lib/use-page-title";
import RetroStar from "@/components/shop/RetroStar";

function ResetPasswordContent() {
  usePageTitle("Nouveau mot de passe");
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setTokenStatus("valid");
          setEmail(data.email);
        } else {
          setTokenStatus("invalid");
        }
      })
      .catch(() => setTokenStatus("invalid"));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }

      if (data.email) {
        const result = await signIn("credentials", {
          email: data.email,
          password,
          redirect: false,
        });
        if (result?.ok) {
          router.push("/account");
          return;
        }
      }
      router.push("/login");
    } catch {
      setError("Erreur réseau, réessayez");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-4 py-3 bg-[var(--cream)]/40 rounded-2xl border-2 border-[var(--black)]/20 text-[15px] text-[var(--black)] focus:border-[var(--black)] focus:ring-0 outline-none transition placeholder:text-[var(--black)]/30";
  const labelCls = "block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2";

  return (
    <div className="bg-[var(--cream)] min-h-[85vh] py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <RetroStar points={8} className="absolute top-12 right-[10%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
        <RetroStar points={10} className="absolute bottom-16 left-[12%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-9">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
            Espace client
          </span>
          <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
            Nouveau <span className="text-[var(--orange)]">mot de passe</span>
          </h1>
        </div>

        <div className="card-rosa bg-white px-6 sm:px-9 py-9 sm:py-10" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
          {tokenStatus === "checking" && (
            <p className="text-center text-[var(--black)]/55 font-semibold text-[14px]">Vérification du lien…</p>
          )}

          {tokenStatus === "invalid" && (
            <div className="text-center">
              <p className="text-[15px] text-[var(--black)]/80 font-semibold leading-relaxed mb-7">
                Ce lien est invalide ou a expiré. Demandez un nouveau lien de réinitialisation.
              </p>
              <Link href="/mot-de-passe-oublie" className="btn-rosa">
                Demander un nouveau lien <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          )}

          {tokenStatus === "valid" && (
            <>
              {email && (
                <p className="text-[14px] text-[var(--black)]/65 font-semibold mb-7 leading-relaxed text-center">
                  Pour le compte <span className="text-[var(--black)] font-display font-extrabold">{email}</span>
                </p>
              )}

              {error && (
                <div className="mb-6 px-4 py-3 rounded-2xl border-2 border-red-300 bg-red-50 text-red-700 text-[13px] font-bold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className={labelCls}>Nouveau mot de passe</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} className={inputCls} placeholder="••••••••" />
                </div>
                <div>
                  <label htmlFor="confirm" className={labelCls}>Confirmer</label>
                  <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" minLength={8} className={inputCls} placeholder="••••••••" />
                </div>

                <button type="submit" disabled={loading} className="btn-rosa w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Enregistrement…" : <>Définir le mot de passe <ArrowRight size={16} strokeWidth={2.5} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[var(--cream)] min-h-[85vh] flex items-center justify-center">
          <p className="text-[var(--black)]/55 font-semibold">Chargement…</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
