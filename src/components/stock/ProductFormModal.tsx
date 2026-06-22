"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Product, Supplier, ProductType } from "@prisma/client";
import { X } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";

type Props = {
  product: Product | null;
  suppliers: Supplier[];
  type: ProductType;
  onClose: () => void;
};

export function ProductFormModal({ product, suppliers, type, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    buyPrice: product?.buyPrice?.toString() ?? "",
    sellPrice: product?.sellPrice?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    alertThreshold: product?.alertThreshold?.toString() ?? "5",
    barcode: product?.barcode ?? "",
    supplierId: product?.supplierId ?? "",
    author: product?.author ?? "",
    publisher: product?.publisher ?? "",
    isbn: product?.isbn ?? "",
    genre: product?.genre ?? "",
    location: product?.location ?? "",
    isNew: product?.isNew ?? false,
    isCollection: product?.isCollection ?? false,
    brand: product?.brand ?? "",
    category: product?.category ?? "",
    sku: product?.sku ?? "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k: string) => setForm((f) => ({ ...f, [k]: !(f as Record<string, unknown>)[k] }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        name: form.name,
        buyPrice: parseFloat(form.buyPrice),
        sellPrice: parseFloat(form.sellPrice),
        stock: parseInt(form.stock),
        alertThreshold: parseInt(form.alertThreshold),
        barcode: form.barcode || undefined,
        supplierId: form.supplierId || undefined,
        ...(type === "LIVRE"
          ? {
              author: form.author || undefined,
              publisher: form.publisher || undefined,
              isbn: form.isbn || undefined,
              genre: form.genre || undefined,
              location: form.location || undefined,
              isNew: form.isNew,
              isCollection: form.isCollection,
            }
          : {
              brand: form.brand || undefined,
              category: form.category || undefined,
              sku: form.sku || undefined,
            }),
      };

      if (isEdit) {
        await updateProduct(product!.id, data);
      } else {
        await createProduct({ type, ...data });
      }
      onClose();
    });
  };

  const inputCls = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? "Modifier" : "Ajouter"} {type === "LIVRE" ? "un livre" : "une fourniture"}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Nom *</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Prix d&apos;achat (€) *</label>
              <input type="number" step="0.01" min="0" className={inputCls} value={form.buyPrice} onChange={(e) => set("buyPrice", e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Prix de vente (€) *</label>
              <input type="number" step="0.01" min="0" className={inputCls} value={form.sellPrice} onChange={(e) => set("sellPrice", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Quantité en stock</label>
              <input type="number" min="0" className={inputCls} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Seuil d&apos;alerte</label>
              <input type="number" min="0" className={inputCls} value={form.alertThreshold} onChange={(e) => set("alertThreshold", e.target.value)} />
            </div>
          </div>

          {type === "LIVRE" ? (
            <>
              <div><label className={labelCls}>Auteur</label><input className={inputCls} value={form.author} onChange={(e) => set("author", e.target.value)} /></div>
              <div><label className={labelCls}>Éditeur</label><input className={inputCls} value={form.publisher} onChange={(e) => set("publisher", e.target.value)} /></div>
              <div><label className={labelCls}>ISBN</label><input className={inputCls} value={form.isbn} onChange={(e) => set("isbn", e.target.value)} /></div>
              <div><label className={labelCls}>Genre</label><input className={inputCls} value={form.genre} onChange={(e) => set("genre", e.target.value)} /></div>
              <div><label className={labelCls}>Emplacement</label><input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isNew} onChange={() => toggle("isNew")} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm text-slate-700 font-medium">Marquer comme Nouveau</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isCollection} onChange={() => toggle("isCollection")} className="w-4 h-4 accent-[#1e3a5f]" />
                  <span className="text-sm text-slate-700 font-medium">Marquer comme Collection</span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div><label className={labelCls}>Marque</label><input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} /></div>
              <div><label className={labelCls}>Catégorie</label><input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} /></div>
              <div><label className={labelCls}>SKU / Code-barres</label><input className={inputCls} value={form.sku} onChange={(e) => set("sku", e.target.value)} /></div>
            </>
          )}

          <div>
            <label className={labelCls}>Code-barres</label>
            <input className={inputCls} value={form.barcode} onChange={(e) => set("barcode", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Fournisseur</label>
            <select className={inputCls} value={form.supplierId} onChange={(e) => set("supplierId", e.target.value)}>
              <option value="">— Aucun —</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm border border-slate-200 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-60"
            >
              {isPending ? "En cours…" : isEdit ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
