"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, BookOpen } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/formatPrice";

const WHATSAPP_NUMBER = "22394664694";

export function CartDrawer() {
  const { items, removeItem, updateQty, totalItems, totalPrice, drawerOpen, closeDrawer } = useCart();

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const whatsappMessage = encodeURIComponent(
    `Bonjour DAR ELHIKMA 👋\n\nJe souhaite commander :\n\n` +
    items.map((i) => `• ${i.title} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join("\n") +
    `\n\n💰 Total : ${formatPrice(totalPrice)}\n\nMerci !`
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="font-bold text-[#1e3a5f] text-lg">Mon panier</h2>
            {totalItems > 0 && (
              <span className="bg-[#c0392b] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
            )}
          </div>
          <button onClick={closeDrawer} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <BookOpen className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">Votre panier est vide</p>
              <button onClick={closeDrawer} className="mt-4 text-sm text-[#1e3a5f] hover:underline">
                Continuer mes achats
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 border-b border-slate-50 last:border-0">
                {/* Cover */}
                <Link href={`/livres/${item.id}`} onClick={closeDrawer} className="shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-slate-100 relative">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><BookOpen className="w-5 h-5 text-slate-300" /></div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/livres/${item.id}`} onClick={closeDrawer}>
                    <p className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-[#1e3a5f]">{item.title}</p>
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{item.author}</p>
                  <p className="text-sm font-bold text-[#1e3a5f] mt-1">{formatPrice(item.price)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})</span>
              <span className="font-bold text-slate-900">{formatPrice(totalPrice)}</span>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Commander via WhatsApp
            </a>

            <Link
              href="/panier"
              onClick={closeDrawer}
              className="flex items-center justify-center w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Voir le panier complet
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
