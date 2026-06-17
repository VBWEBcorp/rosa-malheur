"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, ArrowRight, Wallet } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { PageHeader, GoldButton, Card } from "@/components/admin/ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  previousRevenue: number;
  revenueChange: number;
  orderCount: number;
  previousOrderCount: number;
  newCustomers: number;
  previousNewCustomers: number;
  aov: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    total: number;
    paymentStatus: string;
    fulfillmentStatus: string;
    createdAt: string;
    user?: { name: string };
  }[];
  chartData: { date: string; revenue: number; orders: number }[];
  topProducts: { _id: string; revenue: number; quantity: number }[];
  ordersByStatus: Record<string, number>;
}

const periods = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
  { value: "12m", label: "12 mois" },
];

const statusLabels: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  failed: "Échouée",
  refunded: "Remboursée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats/dashboard?period=${period}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <div className="h-3 w-32 bg-[var(--black)]/10 rounded-full animate-pulse" />
          <div className="h-10 w-64 bg-[var(--black)]/10 rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border-2 border-[var(--black)]/10 h-[140px] animate-pulse"
            />
          ))}
        </div>
        <div className="bg-white rounded-2xl border-2 border-[var(--black)]/10 h-[350px] animate-pulse" />
      </div>
    );
  }

  const cards = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(stats?.totalRevenue || 0),
      change: stats?.revenueChange || 0,
      icon: <TrendingUp size={18} strokeWidth={2} />,
    },
    {
      label: "Commandes",
      value: String(stats?.orderCount || 0),
      change: stats?.previousOrderCount
        ? Math.round(
            ((stats.orderCount - stats.previousOrderCount) / stats.previousOrderCount) * 100
          )
        : 0,
      icon: <ShoppingCart size={18} strokeWidth={2} />,
    },
    {
      label: "Panier moyen",
      value: formatPrice(stats?.aov || 0),
      icon: <Wallet size={18} strokeWidth={2} />,
    },
    {
      label: "Nouveaux clients",
      value: String(stats?.newCustomers || 0),
      change: stats?.previousNewCustomers
        ? Math.round(
            ((stats.newCustomers - stats.previousNewCustomers) / stats.previousNewCustomers) * 100
          )
        : 0,
      icon: <Users size={18} strokeWidth={2} />,
    },
  ];

  return (
    <div>
      {/* En-tête */}
      <PageHeader eyebrow="Administration" title="Tableau de bord">
        {/* Sélecteur de période */}
        <div className="flex gap-1 bg-white border-2 border-[var(--black)]/12 rounded-full p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3.5 py-1.5 text-[11px] font-display font-extrabold uppercase tracking-wide rounded-full transition ${
                period === p.value
                  ? "bg-[var(--orange)] text-white"
                  : "text-[var(--black)]/55 hover:text-[var(--black)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <GoldButton href="/admin/products/new">
          Ajouter un produit
          <ArrowRight size={13} strokeWidth={2.5} />
        </GoldButton>
      </PageHeader>

      {/* Cartes de stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Card key={card.label} className="px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-full bg-[var(--pink)] border-2 border-[var(--black)] text-[var(--black)] flex items-center justify-center">
                {card.icon}
              </div>
              {"change" in card && card.change !== undefined && card.change !== 0 && (
                <span
                  className={`text-[12px] font-display font-extrabold ${
                    card.change > 0 ? "text-[var(--orange)]" : "text-[var(--black)]/40"
                  }`}
                >
                  {card.change > 0 ? "+" : ""}
                  {card.change}%
                </span>
              )}
            </div>
            <p className="text-[11px] font-display font-extrabold uppercase tracking-wide text-[var(--black)]/50 mb-1.5">
              {card.label}
            </p>
            <p className="font-display font-extrabold text-3xl text-[var(--black)] leading-none">
              {card.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Chiffre d'affaires + Top produits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Card className="lg:col-span-2 px-6 py-7">
          <div className="mb-6">
            <p className="text-[10px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1.5">
              Évolution
            </p>
            <h2 className="font-display font-extrabold text-2xl text-[var(--black)]">
              Chiffre d&apos;affaires
            </h2>
          </div>
          <div className="h-[280px]">
            {stats?.chartData && stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC480F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC480F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,13,13,0.08)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "rgba(14,13,13,0.45)" }}
                    tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "rgba(14,13,13,0.45)" }}
                    tickFormatter={(v) => `${(v / 100).toFixed(0)} €`}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "2px solid #0E0D0D",
                      borderRadius: "14px",
                      fontSize: "13px",
                      fontFamily: "var(--font-nunito)",
                      fontWeight: 600,
                    }}
                    formatter={(value) => [formatPrice(value as number), "CA"]}
                    labelFormatter={(label) => {
                      const d = new Date(label);
                      return d.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                      });
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#DC480F"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-semibold text-[var(--black)]/40 text-sm">
                Pas de donnée pour cette période
              </div>
            )}
          </div>
        </Card>

        {/* Top produits */}
        <Card className="px-6 py-7">
          <div className="mb-6">
            <p className="text-[10px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1.5">
              Classement
            </p>
            <h2 className="font-display font-extrabold text-2xl text-[var(--black)]">Top produits</h2>
          </div>
          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="divide-y-2 divide-[var(--black)]/8">
              {stats.topProducts.map((product, i) => (
                <div key={product._id} className="flex items-center gap-3 py-3 first:pt-0">
                  <span className="font-display font-extrabold text-[var(--orange)] text-lg w-6 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-extrabold text-[14px] text-[var(--black)] truncate leading-tight">
                      {product._id}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--black)]/40 mt-1">
                      {product.quantity} vendus
                    </p>
                  </div>
                  <span className="font-display font-extrabold text-[14px] text-[var(--black)] shrink-0">
                    {formatPrice(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-semibold text-sm text-[var(--black)]/40 text-center py-8">
              Aucune vente
            </p>
          )}
        </Card>
      </div>

      {/* Commandes récentes */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b-2 border-[var(--black)]/8">
          <div>
            <p className="text-[10px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] mb-1">
              Activité
            </p>
            <h2 className="font-display font-extrabold text-xl text-[var(--black)]">
              Commandes récentes
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-[12px] font-display font-extrabold uppercase tracking-wide text-[var(--orange)] hover:opacity-70 transition"
          >
            Tout voir
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="divide-y-2 divide-[var(--black)]/8">
            {stats.recentOrders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-[var(--cream)]/60 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <span className="font-display font-extrabold text-[16px] text-[var(--black)]">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--orange)]">
                      {statusLabels[order.paymentStatus] || order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-[var(--black)]/50">
                    {order.user?.name && <span>{order.user.name} · </span>}
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className="font-display font-extrabold text-[16px] text-[var(--black)] shrink-0">
                  {formatPrice(order.total)}
                </span>
                <ArrowRight
                  size={15}
                  className="text-[var(--orange)] group-hover:translate-x-1 transition-transform shrink-0"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-full border-2 border-[var(--black)] bg-[var(--pink)] text-[var(--black)] flex items-center justify-center mx-auto mb-5">
              <ShoppingCart size={18} strokeWidth={2} />
            </div>
            <p className="font-display font-extrabold text-2xl text-[var(--black)] mb-2">
              Aucune commande pour le moment
            </p>
            <p className="text-[13px] font-semibold text-[var(--black)]/50">
              Les commandes apparaîtront ici dès le premier achat.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
