import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function PanierPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-[#1e3a5f]/10 rounded-full p-4">
            <ShoppingCart className="w-10 h-10 text-[#1e3a5f]" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-2">Votre Panier</h1>
        <p className="text-slate-500 text-sm mb-8">
          Votre panier est vide pour le moment.
        </p>

        <Link
          href="/livres"
          className="inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 px-7 rounded-xl transition-colors"
        >
          Découvrir nos livres <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-slate-400 mt-6">
          Fonctionnalité à venir — système de commande en cours de développement.
        </p>

        <Link href="/" className="inline-block mt-4 text-sm text-[#1e3a5f] hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
