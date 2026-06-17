"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

export default function ContactFormClient() {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          _gotcha: data.get("_gotcha"),
          formType: "contact",
        }),
      });

      if (res.ok) {
        toast.success("Message envoyé. Réponse sous 48h.");
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        toast.error(json?.error || "Erreur lors de l'envoi");
      }
    } catch {
      toast.error("Impossible d'envoyer le message");
    }

    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field name="name" label="Nom" required />
        <Field name="email" label="Email" type="email" required />
      </div>
      <Field name="subject" label="Sujet" required />
      <div>
        <label htmlFor="message" className="block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2">
          Message <span className="text-[var(--orange)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full px-4 py-3 bg-[var(--cream)]/40 rounded-2xl border-2 border-[var(--black)]/20 text-[15px] text-[var(--black)] focus:border-[var(--black)] focus:ring-0 outline-none transition resize-none placeholder:text-[var(--black)]/30"
          placeholder="Votre message…"
        />
      </div>

      {/* Honeypot anti-spam */}
      <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <button type="submit" disabled={busy} className="btn-rosa disabled:opacity-60">
        {busy ? "Envoi en cours…" : <>Envoyer le message <ArrowRight size={16} strokeWidth={2.5} /></>}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--black)] mb-2">
        {label}
        {required && <span className="text-[var(--orange)] ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 bg-[var(--cream)]/40 rounded-2xl border-2 border-[var(--black)]/20 text-[15px] text-[var(--black)] focus:border-[var(--black)] focus:ring-0 outline-none transition placeholder:text-[var(--black)]/30"
      />
    </div>
  );
}
