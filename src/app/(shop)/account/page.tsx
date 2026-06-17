"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, MapPin, Truck, ArrowRight, Wallet, User } from "lucide-react";
import Link from "next/link";
import { usePageTitle } from "@/lib/use-page-title";
import RetroStar from "@/components/shop/RetroStar";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  tracking?: { trackingUrl?: string };
  createdAt: string;
  items: { name: string; quantity: number }[];
}

interface AccountStats {
  totalOrders: number;
  totalSpent: number;
}

export default function AccountDashboard() {
  usePageTitle("Mon espace client");
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AccountStats>({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?limit=5&scope=user")
      .then((r) => r.json())
      .then((orderData) => {
        const orderList = orderData.orders || [];
        setOrders(orderList);
        const totalSpent = orderList
          .filter((o: Order) => o.paymentStatus === "paid")
          .reduce((sum: number, o: Order) => sum + o.total, 0);
        setStats({
          totalOrders: orderData.pagination?.total || orderList.length,
          totalSpent,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    paid: "Payée",
    failed: "Échouée",
    refunded: "Remboursée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-12 w-64 bg-white rounded-2xl border-2 border-[var(--black)]/10 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 card-rosa bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] || "Client";
  const activeOrders = orders.filter((o) => ["processing", "shipped"].includes(o.fulfillmentStatus));

  return (
    <div>
      {/* Bienvenue */}
      <div className="mb-10 md:mb-12">
        <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-2">
          Tableau de bord
        </p>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--black)] leading-[0.95]">
          Bonjour, <span className="text-[var(--orange)]">{firstName}</span>
        </h1>
        <p className="mt-4 text-[15px] text-[var(--black)]/60 font-semibold max-w-md">
          Retrouvez vos commandes et vos informations en un coup d&apos;œil.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <StatCard href="/account/orders" icon={<Package size={18} strokeWidth={2} />} label="Commandes" value={String(stats.totalOrders)} hint={stats.totalOrders > 1 ? "passées" : "passée"} />
        <StatCard icon={<Wallet size={18} strokeWidth={2} />} label="Total dépensé" value={formatPrice(stats.totalSpent)} hint="depuis l'ouverture du compte" />
      </div>

      {/* Commandes en cours */}
      {activeOrders.length > 0 && (
        <section className="mb-12">
          <SectionHeader title="En cours" />
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="group flex items-center gap-4 card-rosa bg-white px-5 py-4 hover:bg-[var(--cream)]/50 transition"
              >
                <div className="w-11 h-11 rounded-full bg-[var(--pink)] border-2 border-[var(--black)] text-[var(--black)] flex items-center justify-center shrink-0">
                  <Truck size={17} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-0.5 flex-wrap">
                    <span className="font-display font-extrabold text-[16px] text-[var(--black)]">{order.orderNumber}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--orange)]">
                      {statusLabels[order.fulfillmentStatus] || order.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--black)]/55 truncate">
                    {order.items.map((i) => i.name).join(" · ")}
                  </p>
                </div>
                <span className="font-display font-extrabold text-[16px] text-[var(--black)] shrink-0 hidden sm:block">
                  {formatPrice(order.total)}
                </span>
                <ArrowRight size={16} className="text-[var(--orange)] group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Dernières commandes */}
      <section>
        <SectionHeader
          title="Dernières commandes"
          right={stats.totalOrders > 5 ? (
            <Link href="/account/orders" className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] hover:opacity-70 transition">
              Tout voir
            </Link>
          ) : undefined}
        />

        {orders.length === 0 ? (
          <div className="card-rosa bg-white px-6 py-14 text-center">
            <RetroStar points={8} className="w-14 h-14 text-[var(--pink)] mx-auto mb-5" />
            <p className="font-display font-extrabold text-2xl text-[var(--black)] mb-2">
              Pas encore de commande
            </p>
            <p className="text-[14px] text-[var(--black)]/55 mb-7 max-w-xs mx-auto leading-relaxed">
              Votre historique apparaîtra ici dès votre première commande.
            </p>
            <Link href="/produit" className="btn-rosa">
              Voir la laisse <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        ) : (
          <div className="card-rosa bg-white divide-y-2 divide-[var(--black)]/8 overflow-hidden">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="group flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-[var(--cream)]/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-0.5">
                    <span className="font-display font-extrabold text-[16px] text-[var(--black)]">{order.orderNumber}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--orange)]">
                      {statusLabels[order.paymentStatus] || order.paymentStatus}
                    </span>
                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--black)]/30" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--black)]/40">
                      {statusLabels[order.fulfillmentStatus] || order.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--black)]/50 font-semibold">{formatDate(order.createdAt)}</p>
                </div>
                <span className="font-display font-extrabold text-[16px] text-[var(--black)] shrink-0">
                  {formatPrice(order.total)}
                </span>
                <ArrowRight size={16} className="text-[var(--orange)] group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Raccourcis */}
      <section className="mt-12">
        <SectionHeader title="Mon espace" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink href="/account/addresses" icon={<MapPin size={16} strokeWidth={2} />} label="Mes adresses" hint="Livraison & facturation" />
          <QuickLink href="/account/profile" icon={<User size={16} strokeWidth={2} />} label="Mes informations" hint="Nom, email, téléphone" />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  href,
  icon,
  label,
  value,
  hint,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-full bg-[var(--pink)] border-2 border-[var(--black)] text-[var(--black)] flex items-center justify-center">
          {icon}
        </div>
        {href && <ArrowRight size={16} className="text-[var(--orange)] group-hover:translate-x-1 transition-transform" />}
      </div>
      <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/50 mb-1">{label}</p>
      <p className="font-display font-extrabold text-3xl text-[var(--black)] leading-none">{value}</p>
      <p className="text-[12px] text-[var(--black)]/50 font-semibold mt-2">{hint}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group card-rosa bg-white px-6 py-6 hover:bg-[var(--cream)]/50 transition" style={{ boxShadow: "4px 4px 0 0 var(--black)" }}>
        {inner}
      </Link>
    );
  }
  return (
    <div className="card-rosa bg-white px-6 py-6" style={{ boxShadow: "4px 4px 0 0 var(--black)" }}>
      {inner}
    </div>
  );
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <h2 className="font-display font-extrabold text-2xl text-[var(--black)] leading-none">{title}</h2>
      {right}
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link href={href} className="group flex items-center gap-4 card-rosa bg-white px-5 py-4 hover:bg-[var(--cream)]/50 transition">
      <div className="w-11 h-11 rounded-full bg-[var(--pink)] border-2 border-[var(--black)] text-[var(--black)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-extrabold text-[14px] uppercase tracking-wide text-[var(--black)]">{label}</p>
        <p className="text-[12px] text-[var(--black)]/50 font-semibold mt-0.5">{hint}</p>
      </div>
      <ArrowRight size={16} className="text-[var(--orange)] group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
