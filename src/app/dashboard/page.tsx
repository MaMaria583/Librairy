import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Euro,
  BarChart3,
} from "lucide-react";
import { getDashboardStats, getSalesChartData } from "@/lib/actions/sales";
import { getTopProducts, getLowStockProducts } from "@/lib/actions/products";
import { formatCurrency } from "@/lib/utils";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { LowStockWidget } from "@/components/dashboard/LowStockWidget";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, chartData, topProducts, lowStock] = await Promise.all([
    getDashboardStats(),
    getSalesChartData(30),
    getTopProducts(5),
    getLowStockProducts(),
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
    </div>
  );
}
