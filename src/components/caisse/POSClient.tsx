"use client";

import { useState, useRef, useTransition } from "react";
import { Product } from "@prisma/client";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  FileText,
  CheckCircle,
  BookOpen,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createSale } from "@/lib/actions/sales";

type CartItem = {
  product: Product;
  quantity: number;
  discount: number;
};

type Props = {
  products: Product[];
};

type PaymentMethod = "ESPECES" | "CARTE" | "CHEQUE";

export function POSClient({ products }: Props) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ESPECES");
  const [amountPaid, setAmountPaid] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredProducts = search.length >= 1
    ? products.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.barcode?.includes(q) ||
          p.isbn?.includes(q) ||
          p.sku?.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
    setSearch("");
    searchRef.current?.focus();
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.product.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const updateDiscount = (id: string, val: number) => {
    setCart((prev) =>
      prev.map((i) => i.product.id === id ? { ...i, discount: Math.min(100, Math.max(0, val)) } : i)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellPrice * item.quantity * (1 - item.discount / 100),
    0
  );
  const afterDiscount = subtotal * (1 - globalDiscount / 100);
  const total = afterDiscount;
  const paid = parseFloat(amountPaid) || 0;
  const change = Math.max(0, paid - total);

  const handleValidate = () => {
    if (cart.length === 0) return;
    startTransition(async () => {
      await createSale({
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.sellPrice,
          discount: item.discount,
        })),
        paymentMethod,
        amountPaid: paymentMethod === "ESPECES" ? paid : total,
        globalDiscount,
      });
      setCart([]);
      setAmountPaid("");
      setGlobalDiscount(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  };

  return (
    <div className="flex h-full">
      {/* Left: Product search */}
      <div className="flex-1 p-6 overflow-y-auto border-r border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShoppingCart size={20} className="text-blue-500" />
          Point de Vente
        </h1>

        {success && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-medium">
            <CheckCircle size={16} />
            Vente validée avec succès !
          </div>
        )}

        {/* Scanner / Search */}
        <div className="relative mb-4">
          <Barcode size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Scanner ISBN/code-barres ou rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredProducts.length === 1) {
                addToCart(filteredProducts[0]);
              }
            }}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            autoFocus
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {filteredProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.type === "LIVRE" ? "bg-blue-50" : "bg-amber-50"}`}>
                    {p.type === "LIVRE" ? <BookOpen size={14} className="text-blue-500" /> : <Package size={14} className="text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.isbn ?? p.barcode ?? p.sku ?? "—"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{formatCurrency(p.sellPrice)}</p>
                  <p className={`text-xs ${p.stock === 0 ? "text-red-500" : "text-slate-400"}`}>
                    {p.stock === 0 ? "Épuisé" : `Stock: ${p.stock}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {search.length > 0 && filteredProducts.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <Search size={28} className="mx-auto mb-2 opacity-40" />
            Aucun produit trouvé pour &quot;{search}&quot;
          </div>
        )}
      </div>

      {/* Right: Cart */}
      <div className="w-96 flex flex-col bg-white border-l border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 text-sm">
            Panier ({cart.length} article{cart.length !== 1 ? "s" : ""})
          </h2>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600">
              Vider
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
              <ShoppingCart size={32} className="opacity-30" />
              <p>Panier vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800 leading-tight flex-1">
                    {item.product.name}
                  </p>
                  <button onClick={() => removeItem(item.product.id)} className="text-slate-300 hover:text-red-500 shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>Remise</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateDiscount(item.product.id, parseFloat(e.target.value) || 0)}
                        className="w-12 text-xs border border-slate-200 rounded px-1 py-0.5 text-center"
                      />
                      <span>%</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {formatCurrency(item.product.sellPrice * item.quantity * (1 - item.discount / 100))}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="border-t border-slate-200 p-4 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Remise globale</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={globalDiscount}
                  onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                  className="w-14 text-xs border border-slate-200 rounded px-2 py-0.5 text-center"
                />
                <span className="text-xs">%</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-base pt-1 border-t border-slate-100">
              <span>TOTAL</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="grid grid-cols-3 gap-1.5">
            {(["ESPECES", "CARTE", "CHEQUE"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`py-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                  paymentMethod === m
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m === "ESPECES" ? <Banknote size={14} /> : m === "CARTE" ? <CreditCard size={14} /> : <FileText size={14} />}
                {m === "ESPECES" ? "Espèces" : m === "CARTE" ? "Carte" : "Chèque"}
              </button>
            ))}
          </div>

          {paymentMethod === "ESPECES" && (
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Montant reçu (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={total.toFixed(2)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {paid > 0 && paid >= total && (
                <p className="text-sm font-semibold text-emerald-600 mt-1">
                  Monnaie à rendre : {formatCurrency(change)}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleValidate}
            disabled={cart.length === 0 || isPending || (paymentMethod === "ESPECES" && paid < total && paid > 0)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            {isPending ? "Traitement…" : "Valider la vente"}
          </button>
        </div>
      </div>
    </div>
  );
}
