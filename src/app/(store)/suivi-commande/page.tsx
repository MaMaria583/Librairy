"use client";

import { useState } from "react";
import { Search, Package, Clock, CheckCircle2, Truck, PackageCheck, XCircle, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import Link from "next/link";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; imageUrl: string | null };
}

interface Order {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  total: number;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType; description: string }> = {
  PENDING:   { label: "En attente de paiement", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", icon: Clock,        description: "Votre commande est enregistrée. Effectuez le paiement Mobile Money pour la confirmer." },
  PAID:      { label: "Paiement confirmé",       color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  icon: CheckCircle2, description: "Votre paiement a été reçu. Votre commande est en cours de préparation." },
  SHIPPED:   { label: "En cours de livraison",   color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200",icon: Truck,        description: "Votre commande est en route ! Le livreur vous contactera bientôt." },
  DELIVERED: { label: "Livrée",                  color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200",icon: PackageCheck, description: "Commande livrée avec succès. Merci pour votre confiance !" },
  CANCELLED: { label: "Annulée",                 color: "text-red-700",   bg: "bg-red-50",    border: "border-red-200",   icon: XCircle,      description: "Cette commande a été annulée. Contactez-nous pour plus d'informations." },
};

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING",   label: "Commande reçue" },
  { status: "PAID",      label: "Paiement confirmé" },
  { status: "SHIPPED",   label: "En livraison" },
  { status: "DELIVERED", label: "Livrée" },
];

const STEP_ORDER: Record<OrderStatus, number> = {
  PENDING: 0, PAID: 1, SHIPPED: 2, DELIVERED: 3, CANCELLED: -1,
};

export default function SuiviCommandePage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
      setOrders(data.orders ?? []);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e3a5f] rounded-2xl mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f]">Suivi de commande</h1>
          <p className="text-slate-500 mt-2">Entrez votre numéro de téléphone pour retrouver vos commandes</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Numéro de téléphone
          </label>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ex: 76 00 00 00"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
            />
            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="bg-[#1e3a5f] text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#16304f] transition disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Rechercher
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </form>

        {/* Results */}
        {searched && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucune commande trouvée pour ce numéro.</p>
            <p className="text-sm text-slate-400 mt-1">Vérifiez le numéro ou <Link href="/contact" className="text-[#1e3a5f] underline">contactez-nous</Link>.</p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const config = STATUS_CONFIG[order.status];
            const Icon = config.icon;
            const currentStep = STEP_ORDER[order.status];

            return (
              <div key={order.id} className={`bg-white rounded-2xl border ${config.border} shadow-sm overflow-hidden`}>
                {/* Status header */}
                <div className={`${config.bg} px-6 py-4 flex items-center gap-3`}>
                  <Icon className={`w-6 h-6 ${config.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${config.color}`}>{config.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{config.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>

                {/* Progress bar (pas pour CANCELLED) */}
                {order.status !== "CANCELLED" && (
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-0">
                      {STEPS.map((step, i) => {
                        const done = i <= currentStep;
                        const active = i === currentStep;
                        return (
                          <div key={step.status} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                done ? "bg-[#1e3a5f] text-white" : "bg-slate-100 text-slate-400"
                              } ${active ? "ring-2 ring-[#1e3a5f]/30 scale-110" : ""}`}>
                                {i + 1}
                              </div>
                              <span className={`text-[10px] font-medium hidden sm:block ${done ? "text-[#1e3a5f]" : "text-slate-400"}`}>
                                {step.label}
                              </span>
                            </div>
                            {i < STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? "bg-[#1e3a5f]" : "bg-slate-200"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="px-6 py-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative">
                        {item.product.imageUrl ? (
                          <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg">📚</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-slate-400">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#1e3a5f]">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Commandé le {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="font-bold text-[#1e3a5f]">{formatPrice(order.total)}</span>
                </div>

                {/* CTA paiement si PENDING */}
                {order.status === "PENDING" && (
                  <div className="px-6 pb-4">
                    <Link
                      href={`/confirmer-paiement?orderId=${order.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-[#c0392b] text-white font-semibold py-2.5 rounded-xl hover:bg-[#a93226] transition text-sm"
                    >
                      Confirmer mon paiement <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
