import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Euro,
  BarChart3,
  Clock,
  CheckCircle2,
  Truck,
  Globe,
} from "lucide-react";
import { getDashboardStats, getSalesChartData } from "@/lib/actions/sales";
import { getTopProducts, getLowStockProducts } from "@/lib/actions/products";
import { getOrderStats } from "@/lib/actions/orders";
import { formatCurrency } from "@/lib/utils";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { LowStockWidget } from "@/components/dashboard/LowStockWidget";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, chartData, topProducts, lowStock, orderStats] = await Promise.all([
    getDashboardStats(),
    getSalesChartData(30),
    getTopProducts(5),
    getLowStockProducts(),
    getOrderStats(),
  ]);

  const statCards = [
    {
      label: "CA du jour",
      value: formatCurrency(stats.todayRevenue),
      sub: `${stats.todaySalesCount} vente(s)`,
      icon: Euro,
      color: "bg-emerald-500",
    },
    {
      label: "CA du mois",
      value: formatCurrency(stats.monthRevenue),
      sub: `${stats.monthSalesCount} vente(s)`,
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      label: "Marge nette",
      value: formatCurrency(stats.monthProfit),
      sub: `${stats.profitMargin.toFixed(1)}% de marge`,
      icon: BarChart3,
      color: "bg-violet-500",
    },
    {
      label: "Total produits",
      value: stats.totalProducts.toString(),
      sub: `${stats.lowStockCount} en stock bas`,
      icon: Package,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mt-1">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-400">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-700">
              Évolution des ventes (30 derniers jours)
            </h2>
          </div>
          <SalesChart data={chartData} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-700">
              Alertes stock bas ({lowStock.length})
            </h2>
          </div>
          <LowStockWidget products={lowStock} />
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-4 h-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-slate-700">
            Top ventes du mois
          </h2>
        </div>
        <TopProductsTable products={topProducts} />
      </div>

      {/* Online Orders Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-500" />
            <h2 className="text-sm font-semibold text-slate-700">Commandes en ligne</h2>
          </div>
          <Link
            href="/commandes"
            className="text-xs font-medium text-sky-600 hover:text-sky-800 hover:underline"
          >
            Gérer les commandes →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "En attente", value: orderStats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
            { label: "Payées", value: orderStats.paid, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "Expédiées", value: orderStats.shipped, icon: Truck, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
            { label: "Livrées", value: orderStats.delivered, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Annulées", value: orderStats.cancelled, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 border-red-100" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl p-4 flex flex-col items-center gap-1`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {orderStats.revenue > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600">
              Revenu commandes en ligne confirmées :{" "}
              <span className="font-bold text-emerald-600">{formatCurrency(orderStats.revenue)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
