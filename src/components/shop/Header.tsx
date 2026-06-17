"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/contexts/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/produit", label: "La laisse" },
  { href: "/cartes-cadeaux", label: "Carte cadeau" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

/** Logo mot — « Rosa » orange / « Malheur » noir, esprit affiche. */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold leading-[0.82] tracking-tight ${className}`}>
      <span className="text-[var(--orange)]">Rosa</span>{" "}
      <span className="text-[var(--black)]">Malheur</span>
    </span>
  );
}

export default function Header() {
  const { data: session } = useSession();
  const { itemCount, toggleCart } = useCart();
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--cream)] border-b-[2.5px] border-[var(--black)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[var(--black)]"
            aria-label="Ouvrir le menu"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            aria-label="Rosa Malheur — accueil"
          >
            <Wordmark className="text-2xl sm:text-[26px]" />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-extrabold uppercase tracking-wide font-display transition-colors ${
                    active
                      ? "text-[var(--orange)]"
                      : "text-[var(--black)] hover:text-[var(--orange)]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-4 right-4 -bottom-0.5 h-[3px] rounded-full bg-[var(--orange)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href={session ? "/account" : "/login"}
              className="relative w-10 h-10 flex items-center justify-center text-[var(--black)] hover:text-[var(--orange)] transition"
              aria-label={session ? "Mon compte" : "Se connecter"}
            >
              <User size={20} strokeWidth={2} />
              {session && (
                <span className="absolute bottom-1.5 right-1.5 block w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />
              )}
            </Link>

            <button
              onClick={toggleCart}
              className="relative w-10 h-10 flex items-center justify-center text-[var(--black)] hover:text-[var(--orange)] transition"
              aria-label="Panier"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[var(--orange)] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[var(--cream)]">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {session?.user.role === "admin" && (
              <Link
                href="/admin"
                className="hidden lg:inline-flex ml-1 text-[11px] uppercase tracking-wide font-extrabold font-display bg-[var(--black)] text-[var(--cream)] rounded-full px-4 py-2 hover:bg-[var(--orange)] transition"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        session={session}
        pathname={pathname}
      />
    </header>
  );
}

function MobileDrawer({
  open,
  onClose,
  session,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  session: ReturnType<typeof useSession>["data"];
  pathname: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`lg:hidden fixed left-0 top-0 z-[70] h-full w-full max-w-sm bg-[var(--cream)] flex flex-col border-r-[2.5px] border-[var(--black)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pt-7 pb-5 border-b-[2.5px] border-[var(--black)] flex items-center justify-between">
          <Link href="/" onClick={onClose}>
            <Wordmark className="text-2xl" />
          </Link>
          <button onClick={onClose} className="p-2 -mr-2 text-[var(--black)]" aria-label="Fermer">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group flex items-center justify-between py-3 font-display font-extrabold text-2xl transition ${
                  active ? "text-[var(--orange)]" : "text-[var(--black)] hover:text-[var(--orange)]"
                }`}
              >
                {link.label}
                <ArrowRight
                  size={20}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--orange)]"
                />
              </Link>
            );
          })}
        </nav>

        <div className="border-t-[2.5px] border-[var(--black)] px-6 py-6 space-y-3">
          <Link href={session ? "/account" : "/login"} onClick={onClose} className="btn-rosa w-full">
            {session ? "Mon compte" : "Se connecter"}
            <ArrowRight size={16} />
          </Link>
          {session?.user.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className="btn-rosa-outline w-full"
            >
              Espace admin
            </Link>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}
