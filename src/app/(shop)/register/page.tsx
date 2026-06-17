"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RetroStar from "@/components/shop/RetroStar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
      router.refresh();
    } catch {
      setError("Erreur serveur");
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--cream)] min-h-[85vh] py-16 md:py-24 px-4 relative overflow-hidden">
      <RetroStar points={8} className="absolute top-12 right-[10%] w-10 h-10 text-[var(--orange)] hidden sm:block" />
      <RetroStar points={10} className="absolute bottom-16 left-[12%] w-12 h-12 text-[var(--pink-dark)] hidden sm:block" />

      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <div className="text-center mb-9">
          <span className="inline-flex items-center gap-2 pill-rosa bg-[var(--pink)] text-[var(--black)] px-4 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide">
            Espace client
          </span>
          <h1 className="mt-5 font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
            Créez votre <span className="text-[var(--orange)]">compte</span>
          </h1>
        </div>

        {/* Card */}
        <div className="card-rosa bg-white px-6 sm:px-9 py-9 sm:py-10" style={{ boxShadow: "6px 6px 0 0 var(--black)" }}>
          <p className="text-[14px] text-[var(--black)]/60 font-semibold text-center mb-8 leading-relaxed">
            Pour commander, suivre vos achats et accéder à votre espace.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-2xl border-2 border-red-300 bg-red-50 text-red-700 text-[13px] font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field id="name" label="Nom complet" type="text" value={name} onChange={setName} autoComplete="name" placeholder="Prénom Nom" required />
            <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="vous@exemple.com" required />
            <Field id="password" label="Mot de passe" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="Au moins 8 caractères" required minLength={8} />
            <Field id="confirmPassword" label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" placeholder="••••••••" required minLength={8} />

            <button type="submit" disabled={loading} className="btn-rosa w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Création en cours…" : <>Créer mon compte <ArrowRight size={16} strokeWidth={2.5} /></>}
            </button>
          </form>

          <p className="mt-7 text-[12px] text-[var(--black)]/50 text-center leading-relaxed">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/pages/cgv" className="font-bold text-[var(--orange)] hover:opacity-70 transition">
              conditions d&apos;utilisation
            </Link>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-[var(--black)]/60 font-semibold">Déjà un compte&nbsp;?</p>
          <Link href="/login" className="inline-block mt-2 text-[14px] font-display font-extrabold text-[var(--orange)] hover:opacity-70 transition">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  placeholder,
  required,
  minLength,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 bg-[var(--cream)]/40 rounded-2xl border-2 border-[var(--black)]/20 text-[15px] text-[var(--black)] focus:border-[var(--black)] focus:ring-0 outline-none transition placeholder:text-[var(--black)]/30"
        placeholder={placeholder}
      />
    </div>
  );
}
