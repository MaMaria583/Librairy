import { getLowStockProducts, getDeadstockProducts } from "@/lib/actions/products";
import { getReorderList } from "@/lib/actions/suppliers";
import { AlertTriangle, PackageX, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AlertesPage() {
  const [lowStock, deadstock, reorderList] = await Promise.all([
    getLowStockProducts(),
    getDeadstockProducts(3),
    getReorderList(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Alertes & Réapprovisionnement</h1>
        <p className="text-slate-500 text-sm mt-1">
          Suivi des stocks critiques et produits invendus
        </p>
      </div>

      {/* Low Stock */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="font-semibold text-slate-800 text-sm">
            Stock bas — {lowStock.length} produit(s)
          </h2>
        </div>
        <div className="divide-y divide-slate-50">
          {lowStock.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              Tous les stocks sont au-dessus du seuil critique ✓
            </p>
          ) : (
            lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400">
                    {p.type === "LIVRE" ? p.author : p.brand} · Seuil : {p.alertThreshold}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${p.stock === 0 ? "text-red-600" : "text-orange-500"}`}>
                    {p.stock === 0 ? "Épuisé" : `${p.stock} en stock`}
                  </span>
                  <p className="text-xs text-slate-400">{formatCurrency(p.sellPrice)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reorder suggestion */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-50">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-slate-800 text-sm">
              Suggestions de commande — {reorderList.length} produit(s)
            </h2>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {reorderList.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              Aucune commande suggérée pour le moment
            </p>
          ) : (
            reorderList.map(({ product, supplier, suggestedQty }) => (
              <div key={product.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{product.name}</p>
                  <p className="text-xs text-slate-400">
                    Fournisseur : {supplier?.name ?? "Non défini"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600">
                    Commander {suggestedQty} unité(s)
                  </span>
                  <p className="text-xs text-slate-400">
                    Coût estimé : {formatCurrency(product.buyPrice * suggestedQty)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deadstock */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-amber-50">
          <PackageX className="w-4 h-4 text-amber-500" />
          <h2 className="font-semibold text-slate-800 text-sm">
            Invendus (+3 mois) — {deadstock.length} produit(s)
          </h2>
        </div>
        <div className="divide-y divide-slate-50">
          {deadstock.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              Aucun invendu détecté
            </p>
          ) : (
            deadstock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400">
                    {p.type === "LIVRE" ? p.author : p.brand}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-amber-600">
                    {p.stock} en stock
                  </span>
                  <p className="text-xs text-slate-400">
                    Valeur : {formatCurrency(p.sellPrice * p.stock)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
