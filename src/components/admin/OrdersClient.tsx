"use client";

import { useState, useTransition } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { updateOrderStatus } from "@/lib/actions/orders";
import {
  Clock, CheckCircle2, Truck, PackageCheck, XCircle,
  ChevronDown, ChevronUp, User, Phone, MapPin, CreditCard,
  ShoppingBag, TrendingUp,
} from "lucide-react";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: { id: string; name: string; imageUrl: string | null };
}

interface Order {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string | null;
  paymentMethod: string;
  total: number;
  notes: string | null;
  items: OrderItem[];
  createdAt: Date;
}

interface Stats {
  pending: number;
  paid: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ElementType; next: OrderStatus[] }
> = {
  PENDING: {
    label: "En attente",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
    next: ["PAID", "CANCELLED"],
  },
  PAID: {
    label: "Payée",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: CheckCircle2,
    next: ["SHIPPED", "CANCELLED"],
  },
  SHIPPED: {
    label: "Expédiée",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: Truck,
    next: ["DELIVERED"],
  },
  DELIVERED: {
    label: "Livrée",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: PackageCheck,
    next: [],
  },
  CANCELLED: {
    label: "Annulée",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    next: [],
  },
};

const NEXT_LABELS: Record<OrderStatus, string> = {
  PAID: "Marquer comme Payée 💰",
  SHIPPED: "Marquer comme Expédiée 📦",
  DELIVERED: "Marquer comme Livrée ✅",
  CANCELLED: "Annuler ❌",
  PENDING: "",
};

interface Props {
  orders: Order[];
  stats: Stats;
}

export function OrdersClient({ orders: initialOrders, stats }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; msg: string } | null>(null);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setLoadingId(orderId);
    setErrorId(null);
    startTransition(async () => {
      try {
        const updated = await updateOrderStatus(orderId, newStatus);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? (updated as Order) : o)));
      } catch (err) {
        setErrorId({ id: orderId, msg: err instanceof Error ? err.message : "Erreur" });
      } finally {
        setLoadingId(null);
      }
    });
  }

  const displayed = filterStatus === "ALL" ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Commandes en ligne</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          const count = stats[s.toLowerCase() as keyof Stats] as number;
          return (
            <div key={s} className={`rounded-xl border p-4 ${cfg.bg} cursor-pointer ${filterStatus === s ? "ring-2 ring-offset-1 ring-current" : ""}`} onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}>
              <Icon className={`w-5 h-5 ${cfg.color} mb-1`} />
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-xs text-slate-500">{cfg.label}</p>
            </div>
          );
        })}
        <div className="rounded-xl border bg-[#1e3a5f]/5 border-[#1e3a5f]/20 p-4">
          <TrendingUp className="w-5 h-5 text-[#1e3a5f] mb-1" />
          <p className="text-xl font-bold text-[#1e3a5f]">{formatPrice(stats.revenue)}</p>
          <p className="text-xs text-slate-500">Revenus confirmés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilterStatus("ALL")} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${filterStatus === "ALL" ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          Toutes ({orders.length})
        </button>
        {(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const count = orders.filter((o) => o.status === s).length;
          if (count === 0) return null;
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${filterStatus === s ? `${cfg.color} ${cfg.bg}` : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {displayed.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucune commande trouvée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const Icon = cfg.icon;
            const isExp = expanded === order.id;
            const isLoading = loadingId === order.id && isPending;
            const err = errorId?.id === order.id ? errorId.msg : null;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : order.id)}>
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{order.customerName}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {order.customerPhone} · {order.paymentMethod} · {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{order.id.slice(0, 16).toUpperCase()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#1e3a5f] text-sm">{formatPrice(order.total)}</p>
                    <p className="text-xs text-slate-400">{order.items.reduce((s, i) => s + i.quantity, 0)} art.</p>
                  </div>
                  {isExp ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </div>

                {/* Expanded */}
                {isExp && (
                  <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50">
                    {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{err}</div>}

                    {/* Client info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-600"><User className="w-3.5 h-3.5 shrink-0" />{order.customerName}</div>
                      <div className="flex items-center gap-2 text-slate-600"><Phone className="w-3.5 h-3.5 shrink-0" />{order.customerPhone}</div>
                      {order.customerAddress && <div className="flex items-center gap-2 text-slate-600"><MapPin className="w-3.5 h-3.5 shrink-0" />{order.customerAddress}</div>}
                      <div className="flex items-center gap-2 text-slate-600"><CreditCard className="w-3.5 h-3.5 shrink-0" />{order.paymentMethod}</div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-white border border-slate-100 rounded-lg px-3 py-2">
                          <span className="text-slate-800 font-medium">{item.product.name} <span className="text-slate-400 font-normal">×{item.quantity}</span></span>
                          <span className="text-[#1e3a5f] font-bold">{formatPrice(item.subtotal)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-[#1e3a5f]">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Status actions */}
                    {cfg.next.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cfg.next.map((nextStatus) => {
                          const isCancelBtn = nextStatus === "CANCELLED";
                          return (
                            <button
                              key={nextStatus}
                              onClick={() => handleStatusChange(order.id, nextStatus)}
                              disabled={isLoading}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                                isCancelBtn
                                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                  : "bg-[#1e3a5f] text-white hover:bg-[#162d4a]"
                              }`}
                            >
                              {isLoading ? "..." : NEXT_LABELS[nextStatus]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
