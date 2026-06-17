import Link from "next/link";

/**
 * Kit d'UI partagé pour l'administration — charte Rosa Malheur
 * (crème, noir, orange, rose, Baloo + contours nets arrondis).
 * Réutilisé sur toutes les pages admin pour une cohérence totale.
 */

/** En-tête de page : surtitre orange + titre display + actions à droite. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-extrabold text-[28px] sm:text-4xl text-[var(--black)] leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[var(--black)]/55 mt-2">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">{children}</div>
      )}
    </div>
  );
}

/** Bouton CTA principal — pilule orange à contour noir. Rendu <button> ou <Link>. */
export function GoldButton({
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  children,
}: {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 bg-[var(--orange)] text-white text-[12px] font-display font-extrabold uppercase tracking-wide px-4 py-2.5 rounded-full border-2 border-[var(--black)] hover:bg-[var(--pink)] hover:text-[var(--black)] transition disabled:opacity-50 disabled:pointer-events-none " +
    className;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

/** Bouton secondaire (contour noir). */
export function GhostButton({
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  children,
}: {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 border-2 border-[var(--black)]/25 text-[var(--black)] text-[12px] font-display font-extrabold uppercase tracking-wide px-4 py-2.5 rounded-full hover:border-[var(--black)] hover:bg-[var(--black)] hover:text-[var(--cream)] transition disabled:opacity-50 " +
    className;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

type Tone = "gold" | "green" | "amber" | "red" | "gray" | "blue";

const toneStyles: Record<Tone, string> = {
  gold: "border-[var(--black)] text-[var(--black)] bg-[var(--pink)]",
  green: "border-emerald-300 text-emerald-800 bg-emerald-100",
  amber: "border-amber-300 text-amber-800 bg-amber-100",
  red: "border-red-300 text-red-700 bg-red-100",
  gray: "border-[var(--black)]/20 text-[var(--black)]/60 bg-[var(--cream)]",
  blue: "border-blue-300 text-blue-800 bg-blue-100",
};

/** Pastille de statut — pilule à petites capitales. */
export function Badge({
  tone = "gray",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full border-2 ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

/** Carte / surface standard de l'admin (arrondie, contour noir discret). */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border-2 border-[var(--black)]/12 ${className}`}>
      {children}
    </div>
  );
}

/** État vide centré (icône cerclée + texte + CTA optionnel). */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-full border-2 border-[var(--black)] bg-[var(--pink)] text-[var(--black)] flex items-center justify-center mx-auto mb-5">
        {icon}
      </div>
      <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--black)] mb-2">{title}</p>
      {description && <p className="text-[13px] text-[var(--black)]/55">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
