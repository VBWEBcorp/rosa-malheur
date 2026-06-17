import Link from "next/link";
import SiteSettings from "@/models/SiteSettings";
import { connectDB } from "@/lib/db";
import { getContent } from "@/lib/content";
import RetroStar from "./RetroStar";

export default async function Footer() {
  let settings: {
    shopName?: string;
    social?: { facebook?: string; instagram?: string; tiktok?: string; youtube?: string };
  } | null = null;
  try {
    await connectDB();
    settings = await SiteSettings.findOne().lean();
  } catch {
    // ignore
  }

  const t = await getContent();
  const shopName = settings?.shopName || "Rosa Malheur";
  const year = new Date().getFullYear();

  const socials = [
    { href: settings?.social?.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings?.social?.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings?.social?.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: settings?.social?.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto bg-[var(--black)] text-[var(--cream)] relative overflow-hidden">
      {/* Étoiles décoratives */}
      <RetroStar points={8} className="absolute -top-6 right-10 w-20 h-20 text-[var(--orange)] opacity-90" />
      <RetroStar points={10} className="absolute top-24 left-6 w-12 h-12 text-[var(--pink)] opacity-80 hidden sm:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-12 relative">
        {/* Marque + accroche */}
        <div className="max-w-2xl">
          <p className="font-display font-extrabold text-4xl md:text-5xl leading-none">
            <span className="text-[var(--orange)]">Rosa</span> <span className="text-[var(--cream)]">Malheur</span>
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--cream)]/80 max-w-md">
            {t("footer_tagline")}
          </p>

          {socials.length > 0 && (
            <div className="mt-7 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full border-2 border-[var(--cream)]/40 text-[var(--cream)] flex items-center justify-center hover:bg-[var(--orange)] hover:border-[var(--orange)] hover:text-white transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Colonnes de liens */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-10 max-w-3xl">
          <FooterCol
            title={t("footer_col1_label")}
            links={[
              { href: "/produit", label: "La laisse" },
              { href: "/cartes-cadeaux", label: "Carte cadeau" },
              { href: "/track", label: "Suivre ma commande" },
            ]}
          />
          <FooterCol
            title={t("footer_col2_label")}
            links={[
              { href: "/blog", label: "Journal" },
              { href: "/pages/a-propos", label: "À propos" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title={t("footer_col3_label")}
            links={[
              { href: "/pages/mentions-legales", label: "Mentions légales" },
              { href: "/pages/cgv", label: "CGV" },
              { href: "/pages/politique-confidentialite", label: "Confidentialité" },
              { href: "/pages/politique-retour", label: "Retours" },
            ]}
          />
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-[var(--cream)]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[var(--cream)]/60">
            © {year} {shopName} · {t("footer_bottom_note")}
          </p>
          <div aria-label="Moyens de paiement acceptés" className="flex items-center gap-2">
            <PaymentBadge label="Visa"><VisaMark /></PaymentBadge>
            <PaymentBadge label="Mastercard"><MastercardMark /></PaymentBadge>
            <PaymentBadge label="Apple Pay"><ApplePayMark /></PaymentBadge>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-display font-extrabold text-[var(--pink)] text-sm uppercase tracking-wide mb-4">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[14px] text-[var(--cream)]/80 hover:text-[var(--orange)] transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaymentBadge({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-10 h-7 border border-[var(--cream)]/25 rounded bg-[var(--cream)] shrink-0"
    >
      {children}
    </span>
  );
}

/* ───────── Marques de paiement ───────── */
function VisaMark() {
  return (
    <svg viewBox="0 0 64 22" className="h-3 w-auto" aria-hidden="true">
      <text x="32" y="17" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="20" fill="#1A1F71">VISA</text>
    </svg>
  );
}
function MastercardMark() {
  return (
    <svg viewBox="0 0 36 22" className="h-4 w-auto" aria-hidden="true">
      <circle cx="14" cy="11" r="8" fill="#EB001B" />
      <circle cx="22" cy="11" r="8" fill="#F79E1B" />
      <path d="M18 5.4a8 8 0 0 1 0 11.2 8 8 0 0 1 0-11.2Z" fill="#FF5F00" />
    </svg>
  );
}
function ApplePayMark() {
  return (
    <svg viewBox="0 0 50 22" className="h-3.5 w-auto" aria-hidden="true">
      <path d="M11.6 6.4c-.6.7-1.5 1.2-2.4 1.2-.1-.9.3-1.8.9-2.4.6-.7 1.5-1.2 2.3-1.3.1.9-.3 1.8-.8 2.5Zm.8.9c-1.3 0-2.4.7-3 .7-.7 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.4 2.4-.4 6 1 7.9.7.9 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.6.6 2.6.6 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3.2 0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.8-1.5Z" fill="#000" />
      <text x="22" y="15" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="11" fill="#000">Pay</text>
    </svg>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
    </svg>
  );
}
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.74a4.85 4.85 0 0 1-1.84-.05Z" />
    </svg>
  );
}
function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}
