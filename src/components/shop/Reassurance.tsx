import { Recycle, PawPrint, Hand } from "lucide-react";

/**
 * Bandeau de réassurance : 3 atouts présentés avec une icône cerclée
 * (style sticker de la charte) plutôt qu'avec des emojis.
 * Réutilisé par le hero d'accueil et la page coming soon.
 */
const ITEMS = [
  { Icon: Recycle, label: "Cordes recyclées" },
  { Icon: PawPrint, label: "Bien-être animal" },
  { Icon: Hand, label: "Fait main en France" },
];

export default function Reassurance({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-7 gap-y-4 ${className}`}>
      {ITEMS.map(({ Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2.5 text-[13px] font-bold text-[var(--black)]/75"
        >
          <span className="w-9 h-9 rounded-full bg-white border-2 border-[var(--black)] flex items-center justify-center text-[var(--black)] shrink-0">
            <Icon size={16} strokeWidth={2} />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}
