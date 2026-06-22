import Link from "next/link";
import { User, LogIn } from "lucide-react";

export default function ComptePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-[#1e3a5f]/10 rounded-full p-4">
            <User className="w-10 h-10 text-[#1e3a5f]" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-2">Mon Compte</h1>
        <p className="text-slate-500 text-sm mb-8">
          Connectez-vous pour accéder à vos commandes et préférences.
        </p>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 px-6 rounded-xl transition-colors">
            <LogIn className="w-4 h-4" />
            Se connecter
          </button>
          <button className="w-full border border-[#1e3a5f] text-[#1e3a5f] font-semibold py-3 px-6 rounded-xl hover:bg-[#1e3a5f]/5 transition-colors">
            Créer un compte
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          Fonctionnalité à venir — espace client en cours de développement.
        </p>

        <Link href="/" className="inline-block mt-4 text-sm text-[#1e3a5f] hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
