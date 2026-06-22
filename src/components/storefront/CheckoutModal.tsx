"use client";

import { X, MessageCircle, Smartphone, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const WHATSAPP_NUMBER = "22394664694";

const MOBILE_MONEY = [
  {
    name: "Orange Money",
    number: "77 XXX XX XX",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    logo: "🟠",
  },
  {
    name: "Wave",
    number: "77 XXX XX XX",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    logo: "🌊",
  },
  {
    name: "Sama Money",
    number: "77 XXX XX XX",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    logo: "💜",
  },
  {
    name: "Moov Money",
    number: "77 XXX XX XX",
    color: "bg-green-600",
    textColor: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    logo: "🟢",
  },
];

interface Props {
  onClose: () => void;
}

export function CheckoutModal({ onClose }: Props) {
  const { items, totalPrice } = useCart();
  const [selected, setSelected] = useState<string | null>(null);

  const cartSummary = items
    .map((i) => `• ${i.title} x${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`)
    .join("\n");

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je souhaite passer commande :\n\n${cartSummary}\n\nTotal : ${totalPrice.toFixed(2)} €\n\nMerci !`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#1e3a5f]">Finaliser la commande</h2>
            <p className="text-sm text-slate-400 mt-0.5">Total : <span className="font-semibold text-slate-700">{totalPrice.toFixed(2).replace(".", ",")} €</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Option 1 : WhatsApp */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contacter le vendeur</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full bg-[#25D366] hover:bg-[#1db954] text-white font-semibold py-4 px-5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-6 h-6 shrink-0" />
              <div className="text-left">
                <span className="block text-base">Contacter via WhatsApp</span>
                <span className="block text-xs text-white/80 font-normal">Le vendeur vous confirmera la commande</span>
              </div>
            </a>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">ou payer directement</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Option 2 : Mobile Money */}
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
                  {selected === m.name && (
                    <CheckCircle className={`absolute top-2 right-2 w-4 h-4 ${m.textColor}`} />
                  )}
                  <span className="text-2xl mb-1 block">{m.logo}</span>
                  <span className={`block font-bold text-sm ${selected === m.name ? m.textColor : "text-slate-800"}`}>
                    {m.name}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">Envoi au numéro</span>
                </button>
              ))}
            </div>

            {/* Détail paiement sélectionné */}
            {selected && (() => {
              const m = MOBILE_MONEY.find((x) => x.name === selected)!;
              return (
                <div className={`mt-4 ${m.bg} border ${m.border} rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <Smartphone className={`w-5 h-5 mt-0.5 ${m.textColor} shrink-0`} />
                    <div>
                      <p className={`font-bold text-sm ${m.textColor}`}>Envoyez {totalPrice.toFixed(2).replace(".", ",")} € via {m.name}</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Numéro : <span className="font-mono font-bold text-slate-900">{m.number}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Après le paiement, envoyez une capture d&apos;écran via WhatsApp pour confirmer votre commande.
                      </p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#25D366] hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Confirmer via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
