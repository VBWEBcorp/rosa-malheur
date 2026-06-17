"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Package, MapPin, User, LogOut } from "lucide-react";

const menuItems = [
  { href: "/account", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Mes commandes", icon: Package },
  { href: "/account/addresses", label: "Mes adresses", icon: MapPin },
  { href: "/account/profile", label: "Mes informations", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initial = session?.user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="bg-[var(--cream)] min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Nav mobile */}
        <div className="lg:hidden mb-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1">
                Espace client
              </p>
              <h1 className="font-display font-extrabold text-2xl text-[var(--black)] leading-tight">
                {session?.user?.name || "Mon compte"}
              </h1>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-[12px] font-bold text-[var(--orange)] hover:opacity-70 transition"
            >
              Déconnexion
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {menuItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 text-[12px] font-display font-extrabold uppercase tracking-wide rounded-full border-2 whitespace-nowrap transition ${
                    isActive
                      ? "bg-[var(--orange)] text-white border-[var(--black)]"
                      : "bg-white border-[var(--black)]/20 text-[var(--black)] hover:border-[var(--black)]"
                  }`}
                >
                  <item.icon size={14} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 card-rosa bg-white p-6" style={{ boxShadow: "5px 5px 0 0 var(--black)" }}>
              <div className="text-center pb-6 border-b-2 border-[var(--black)]/10">
                <div className="w-16 h-16 rounded-full bg-[var(--orange)] text-white flex items-center justify-center mx-auto mb-3 font-display font-extrabold text-2xl border-2 border-[var(--black)]">
                  {initial}
                </div>
                <p className="font-display font-extrabold text-lg text-[var(--black)] leading-tight truncate">
                  {session?.user?.name}
                </p>
                <p className="text-[12px] text-[var(--black)]/50 mt-0.5 truncate">
                  {session?.user?.email}
                </p>
              </div>

              <nav className="py-5 space-y-1">
                {menuItems.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition ${
                        isActive
                          ? "bg-[var(--pink)] text-[var(--black)]"
                          : "text-[var(--black)]/70 hover:text-[var(--orange)] hover:bg-[var(--cream)]"
                      }`}
                    >
                      <item.icon size={16} strokeWidth={2} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t-2 border-[var(--black)]/10">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-[var(--black)]/50 hover:text-[var(--orange)] transition w-full"
                >
                  <LogOut size={16} strokeWidth={2} />
                  Déconnexion
                </button>
              </div>
            </div>
          </aside>

          {/* Contenu */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
