"use client";

import { useState, useTransition } from "react";
import { Product, Supplier, ProductType } from "@prisma/client";
import {
  Search,
  AlertTriangle,
  BookOpen,
  Package,
  Edit2,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteProduct } from "@/lib/actions/products";
import { ProductFormModal } from "./ProductFormModal";

type ProductWithSupplier = Product & { supplier: Supplier | null };

type Props = {
  products: ProductWithSupplier[];
  suppliers: (Supplier & { _count: { products: number } })[];
  type: ProductType;
};

type SortKey = "name" | "stock" | "sellPrice" | "buyPrice";

export function ProductsTable({ products, suppliers, type }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductWithSupplier | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = [...new Set(products.map((p) => p.category || p.genre).filter(Boolean))];

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.author?.toLowerCase().includes(q) ?? false) ||
        (p.isbn?.includes(q) ?? false) ||
        (p.barcode?.includes(q) ?? false) ||
        (p.sku?.toLowerCase().includes(q) ?? false)
      );
    })
    .filter((p) => {
      if (!categoryFilter) return true;
      return p.category === categoryFilter || p.genre === categoryFilter;
    })
    .sort((a, b) => {
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;
      if (typeof va === "string" && typeof vb === "string") {
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null;

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    startTransition(() => deleteProduct(id));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, ISBN, auteur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c} value={c!}>{c}</option>
            ))}
          </select>
        )}

        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Ajouter {type === "LIVRE" ? "un livre" : "une fourniture"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  className="text-left px-4 py-3 text-xs text-slate-500 font-semibold cursor-pointer hover:text-slate-700 select-none"
                  onClick={() => toggleSort("name")}
                >
                  <span className="flex items-center gap-1">Produit <SortIcon k="name" /></span>
                </th>
                {type === "LIVRE" ? (
                  <>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Auteur</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">ISBN</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Genre</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Marque</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Catégorie</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">SKU</th>
                  </>
                )}
                <th
                  className="text-right px-4 py-3 text-xs text-slate-500 font-semibold cursor-pointer hover:text-slate-700 select-none"
                  onClick={() => toggleSort("buyPrice")}
                >
                  <span className="flex items-center justify-end gap-1">P. Achat <SortIcon k="buyPrice" /></span>
                </th>
                <th
                  className="text-right px-4 py-3 text-xs text-slate-500 font-semibold cursor-pointer hover:text-slate-700 select-none"
                  onClick={() => toggleSort("sellPrice")}
                >
                  <span className="flex items-center justify-end gap-1">P. Vente <SortIcon k="sellPrice" /></span>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs text-slate-500 font-semibold cursor-pointer hover:text-slate-700 select-none"
                  onClick={() => toggleSort("stock")}
                >
                  <span className="flex items-center justify-center gap-1">Stock <SortIcon k="stock" /></span>
                </th>
                <th className="text-center px-4 py-3 text-xs text-slate-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const isLow = product.stock <= product.alertThreshold;
                  const isOut = product.stock === 0;
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${type === "LIVRE" ? "bg-blue-50" : "bg-amber-50"}`}>
                            {type === "LIVRE" ? <BookOpen size={13} className="text-blue-500" /> : <Package size={13} className="text-amber-500" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 leading-tight">{product.name}</p>
                            {type === "LIVRE" && product.publisher && (
                              <p className="text-xs text-slate-400">{product.publisher}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      {type === "LIVRE" ? (
                        <>
                          <td className="px-4 py-3 text-slate-600 text-xs">{product.author ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs">{product.isbn ?? "—"}</td>
                          <td className="px-4 py-3">
                            {product.genre && (
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{product.genre}</span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-slate-600 text-xs">{product.brand ?? "—"}</td>
                          <td className="px-4 py-3">
                            {product.category && (
                              <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{product.category}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs">{product.sku ?? "—"}</td>
                        </>
                      )}
                      <td className="px-4 py-3 text-right text-slate-500 text-sm">{formatCurrency(product.buyPrice)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(product.sellPrice)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isLow && <AlertTriangle size={13} className={isOut ? "text-red-500" : "text-orange-400"} />}
                          <span className={`font-bold text-sm ${isOut ? "text-red-600" : isLow ? "text-orange-500" : "text-emerald-600"}`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setEditProduct(product); setShowModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={isPending}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400">{filtered.length} résultat(s) sur {products.length}</p>
        </div>
      </div>

      {showModal && (
        <ProductFormModal
          product={editProduct}
          suppliers={suppliers}
          type={type}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
