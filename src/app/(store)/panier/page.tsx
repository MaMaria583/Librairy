"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus, BookOpen } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CheckoutModal } from "@/components/storefront/CheckoutModal";

export default function PanierPage() {
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-md text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-[#1e3a5f]/10 rounded-full p-4">
              <ShoppingCart className="w-10 h-10 text-[#1e3a5f]" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-2">Votre panier est vide</h1>
          <p className="text-slate-500 text-sm mb-8">Ajoutez des livres pour commencer.</p>
          <Link href="/livres" className="inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 px-7 rounded-xl transition-colors">
            Découvrir nos livres <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-8">
          Mon panier <span className="text-slate-400 font-normal text-lg">({totalItems} article{totalItems > 1 ? "s" : ""})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste articles */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center shadow-sm">
                {/* Cover */}
                <div className="relative w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/livres/${item.id}`} className="font-semibold text-slate-900 text-sm hover:text-[#1e3a5f] line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">{item.author || "Auteur inconnu"}</p>
                  <p className="text-base font-bold text-[#1e3a5f] mt-1">{item.price.toFixed(2).replace(".", ",")} €</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal + delete */}
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold text-slate-800">{(item.price * item.quantity).toFixed(2).replace(".", ",")} €</p>
                  <button onClick={() => removeItem(item.id)} className="mt-1 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé commande */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-[#1e3a5f] text-lg mb-4">Résumé</h2>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>Sous-total ({totalItems} art.)</span>
                  <span>{totalPrice.toFixed(2).replace(".", ",")} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-emerald-600 font-medium">Gratuite</span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 border-t border-slate-100 pt-3 mt-3">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Passer la commande
              </button>
              <Link href="/livres" className="block text-center text-sm text-slate-400 hover:text-slate-600 mt-3">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
}
