"use client";

import { X, MessageCircle, Smartphone, CheckCircle, Loader2, User, Phone, MapPin, PackageCheck, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

const WHATSAPP_NUMBER = "22394664694";

const MOBILE_MONEY = [
  {
    name: "Orange Money",
    number: "94 66 46 94",
    textColor: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    logo: "/images/Moyen de paiement/Orange Money.png",
  },
  {
    name: "Wave",
    number: "94 66 46 94",
    textColor: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    logo: "/images/Moyen de paiement/wave money.jpg",
  },
  {
    name: "Sama Money",
    number: "94 66 46 94",
    textColor: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    logo: "/images/Moyen de paiement/sama money.jpg",
  },
  {
    name: "Moov Money",
    number: "94 66 46 94",
    textColor: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    logo: "/images/Moyen de paiement/moov money.png",
  },
];

interface Props {
  onClose: () => void;
}

type Step = "form" | "payment" | "confirmed";

export function CheckoutModal({ onClose }: Props) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("form");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const cartSummary = items
    .map((i) => `• ${i.title} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
    .join("\n");

  function buildWhatsapp(oId?: string) {
    const ref = oId ? `\n\n🔖 Réf. commande : ${oId}` : "";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Bonjour DAR ELHIKMA 👋\n\nJe souhaite passer commande :\n\n${cartSummary}\n\n💰 Total : ${formatPrice(totalPrice)}${ref}\n\nMerci !`
    )}`;
  }

  async function submitOrder(paymentMethod: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerAddress: form.address || undefined,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la commande.");
      setOrderId(data.order.id);
      setStep("confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleWhatsApp() {
    await submitOrder("WhatsApp");
  }

  async function handleMobileMoney() {
    if (!selected) return;
    await submitOrder(selected);
  }

  function handleConfirmed() {
    clearCart();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={step === "confirmed" ? handleConfirmed : onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#1e3a5f]">
              {step === "confirmed" ? "Commande enregistrée ✅" : "Finaliser la commande"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Total : <span className="font-semibold text-slate-700">{formatPrice(totalPrice)}</span>
            </p>
          </div>
          <button onClick={step === "confirmed" ? handleConfirmed : onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* ── ÉTAPE 1 : Infos client ── */}
        {step === "form" && (
          <div className="p-6 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vos coordonnées</p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5" /> Nom complet *
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5" /> Téléphone *
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+223 XX XX XX XX"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5" /> Adresse de livraison
                </span>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Quartier, commune... (optionnel)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </label>
            </div>

            <button
              disabled={!form.name.trim() || !form.phone.trim()}
              onClick={() => setStep("payment")}
              className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* ── ÉTAPE 2 : Mode de paiement ── */}
        {step === "payment" && (
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* WhatsApp */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Confirmer avec le vendeur</p>
              <button
                onClick={handleWhatsApp}
                disabled={loading}
                className="flex items-center gap-4 w-full bg-[#25D366] hover:bg-[#1db954] disabled:opacity-50 text-white font-semibold py-4 px-5 rounded-xl transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <MessageCircle className="w-6 h-6 shrink-0" />}
                <div className="text-left">
                  <span className="block text-base">Contacter via WhatsApp</span>
                  <span className="block text-xs text-white/80 font-normal">La commande sera enregistrée automatiquement</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">ou payer directement</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Mobile Money */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Paiement Mobile Money</p>
              <div className="grid grid-cols-2 gap-3">
                {MOBILE_MONEY.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setSelected(selected === m.name ? null : m.name)}
                    className={`relative text-left border-2 rounded-xl p-4 transition-all ${
                      selected === m.name
                        ? `${m.border} ${m.bg} ring-2 ring-offset-1 ${m.border.replace("border", "ring")}`
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {selected === m.name && <CheckCircle className={`absolute top-2 right-2 w-4 h-4 ${m.textColor}`} />}
                    <div className="w-12 h-12 relative mb-2 rounded-lg overflow-hidden bg-white border border-slate-100">
                      <Image src={m.logo} alt={m.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <span className={`block font-bold text-sm ${selected === m.name ? m.textColor : "text-slate-800"}`}>{m.name}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Envoi au numéro</span>
                  </button>
                ))}
              </div>

              {selected && (() => {
                const m = MOBILE_MONEY.find((x) => x.name === selected)!;
                return (
                  <div className={`mt-4 ${m.bg} border ${m.border} rounded-xl p-4 space-y-3`}>
                    <div className="flex items-start gap-3">
                      <Smartphone className={`w-5 h-5 mt-0.5 ${m.textColor} shrink-0`} />
                      <div>
                        <p className={`font-bold text-sm ${m.textColor}`}>
                          Envoyez {formatPrice(totalPrice)} via {m.name}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Numéro : <span className="font-mono font-bold text-slate-900">{m.number}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Après le paiement, envoyez la capture d&apos;écran via WhatsApp.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleMobileMoney}
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-50 ${m.textColor.replace("text", "bg")}`}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
                      Valider et enregistrer la commande
                    </button>
                  </div>
                );
              })()}
            </div>

            <button onClick={() => setStep("form")} className="text-sm text-slate-400 hover:text-slate-600 w-full text-center">
              ← Modifier mes informations
            </button>
          </div>
        )}

        {/* ── ÉTAPE 3 : Confirmation ── */}
        {step === "confirmed" && orderId && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <PackageCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Commande enregistrée !</h3>
              <p className="text-sm text-slate-500 mt-1">Référence : <span className="font-mono font-bold text-[#1e3a5f]">{orderId.slice(0, 12).toUpperCase()}</span></p>
            </div>
            <p className="text-sm text-slate-600">
              Votre commande est enregistrée. Payez maintenant via Mobile Money puis confirmez votre paiement ci-dessous.
            </p>

            {/* Étape suivante : confirmer le paiement */}
            <Link
              href={`/confirmer-paiement?ref=${orderId}`}
              onClick={handleConfirmed}
              className="flex items-center justify-center gap-2 w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Confirmer mon paiement Mobile Money
            </Link>

            <a
              href={buildWhatsapp(orderId)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleConfirmed}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1db954] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Confirmer via WhatsApp
            </a>
            <button onClick={handleConfirmed} className="text-sm text-slate-400 hover:text-slate-600">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
