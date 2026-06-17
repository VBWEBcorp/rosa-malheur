"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
  PenSquare,
  Mail,
  Megaphone,
  Gift,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/reviews", label: "Avis", icon: Star },
  { href: "/admin/promos", label: "Codes promo", icon: Tag },
  { href: "/admin/gift-cards", label: "Cartes cadeaux", icon: Gift },
  { href: "/admin/blog", label: "Journal", icon: PenSquare },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/content", label: "Contenu du site", icon: FileText },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

/** Logo texte « Rosa Malheur » sur fond clair. */
function Wordmark({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return <span className="font-display font-extrabold text-2xl text-[var(--orange)]">RM</span>;
  }
  return (
    <span className="font-display font-extrabold text-xl leading-none">
      <span className="text-[var(--orange)]">Rosa</span>{" "}
      <span className="text-[var(--black)]">Malheur</span>
    </span>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A";

  function NavList({ isCollapsed }: { isCollapsed: boolean }) {
    return (
      <>
        {!isCollapsed && (
          <div className="px-4 pt-5 pb-2 text-[10px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/35">
            Administration
          </div>
        )}
        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-bold rounded-full transition-all duration-150",
                  isCollapsed && "justify-center px-2",
                  isActive
                    ? "bg-[var(--orange)] text-white border-2 border-[var(--black)] shadow-[2px_2px_0_0_var(--black)]"
                    : "text-[var(--black)]/70 hover:text-[var(--black)] hover:bg-[var(--cream)]"
                )}
              >
                <item.icon size={17} strokeWidth={2.2} className="shrink-0" />
                {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </>
    );
  }

  function BottomSection({ isCollapsed }: { isCollapsed: boolean }) {
    return (
      <div className="border-t-2 border-[var(--black)]/10 px-3 py-3 space-y-1">
        <Link
          href="/"
          title={isCollapsed ? "Voir la boutique" : undefined}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2 text-[13px] font-bold text-[var(--black)]/70 hover:text-[var(--orange)] hover:bg-[var(--cream)] rounded-full transition",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Store size={17} strokeWidth={2.2} className="shrink-0" />
          {!isCollapsed && <span className="truncate">Voir la boutique</span>}
        </Link>

        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-3 py-3 mt-1 border-t-2 border-[var(--black)]/10">
            <div className="w-9 h-9 rounded-full bg-[var(--orange)] text-white flex items-center justify-center text-[12px] font-display font-extrabold shrink-0 border-2 border-[var(--black)]">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[var(--black)] truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-[var(--black)]/45 truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Se déconnecter"
              className="p-1.5 text-[var(--black)]/45 hover:text-[var(--orange)] transition shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Se déconnecter"
            className="w-full flex items-center justify-center px-2 py-2 mt-1 text-[var(--black)]/45 hover:text-[var(--orange)] hover:bg-[var(--cream)] rounded-full transition"
          >
            <LogOut size={17} strokeWidth={2.2} />
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Barre supérieure mobile */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white border-b-[2.5px] border-[var(--black)] flex items-center justify-between px-4">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 -ml-2 text-[var(--black)]"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
        <Link href="/admin" aria-label="Rosa Malheur admin">
          <Wordmark />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[var(--orange)] text-white flex items-center justify-center text-[12px] font-display font-extrabold border-2 border-[var(--black)]">
          {userInitial}
        </div>
      </header>

      {/* Voile + tiroir mobile */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-[270px] max-w-[82vw] bg-white border-r-[2.5px] border-[var(--black)] flex flex-col transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-4 py-5 border-b-2 border-[var(--black)]/10 flex items-center justify-between gap-2">
          <Link href="/admin" aria-label="Rosa Malheur admin">
            <Wordmark />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
            className="p-1.5 text-[var(--black)]/55 hover:text-[var(--orange)] transition"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <NavList isCollapsed={false} />
        <BottomSection isCollapsed={false} />
      </aside>

      {/* Sidebar desktop */}
      <aside
        className={cn(
          "hidden lg:flex relative bg-white border-r-[2.5px] border-[var(--black)] min-h-screen shrink-0 flex-col sticky top-0 self-start h-screen transition-[width] duration-200 ease-out",
          collapsed ? "w-16" : "w-[240px]"
        )}
      >
        <div className="px-4 py-6 border-b-2 border-[var(--black)]/10 flex items-center justify-between gap-2">
          <Link href="/admin" title="Rosa Malheur" className="min-w-0">
            <Wordmark collapsed={collapsed} />
          </Link>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
            className={cn(
              "p-1.5 text-[var(--black)]/45 hover:text-[var(--orange)] transition shrink-0",
              collapsed &&
                "absolute -right-3 top-7 z-10 bg-white border-2 border-[var(--black)] rounded-full w-6 h-6 flex items-center justify-center"
            )}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>
        <NavList isCollapsed={collapsed} />
        <BottomSection isCollapsed={collapsed} />
      </aside>
    </>
  );
}
