"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Eye, EyeOff, ArrowLeft } from "lucide-react";

type View = "home" | "login" | "register";

export default function ComptePage() {
  const [view, setView] = useState<View>("home");
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md">

        {/* ── Vue accueil ── */}
        {view === "home" && (
          <div className="text-center">
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
              <button
                onClick={() => setView("login")}
                className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Se connecter
              </button>
              <button
                onClick={() => setView("register")}
                className="w-full border border-[#1e3a5f] text-[#1e3a5f] font-semibold py-3 rounded-xl hover:bg-[#1e3a5f]/5 transition-colors"
              >
                Créer un compte
              </button>
            </div>
            <Link href="/" className="inline-block mt-6 text-sm text-slate-400 hover:text-[#1e3a5f]">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        )}

        {/* ── Connexion ── */}
        {view === "login" && (
          <>
            <button onClick={() => setView("home")} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 mb-6">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <h2 className="text-xl font-extrabold text-[#1e3a5f] mb-1">Se connecter</h2>
            <p className="text-slate-500 text-sm mb-6">Bienvenue ! Entrez vos identifiants.</p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Adresse e-mail</label>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-right mt-1"><button className="text-xs text-[#1e3a5f] hover:underline">Mot de passe oublié ?</button></p>
              </div>
              <button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors mt-2">
                Se connecter
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">
              Pas encore de compte ?{" "}
              <button onClick={() => setView("register")} className="text-[#1e3a5f] font-semibold hover:underline">Créer un compte</button>
            </p>
          </>
        )}

        {/* ── Inscription ── */}
        {view === "register" && (
          <>
            <button onClick={() => setView("home")} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 mb-6">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <h2 className="text-xl font-extrabold text-[#1e3a5f] mb-1">Créer un compte</h2>
            <p className="text-slate-500 text-sm mb-6">Rejoignez DAR ELHIKMA en quelques secondes.</p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nom complet</label>
                <input type="text" placeholder="Prénom Nom" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Adresse e-mail</label>
                <input type="email" placeholder="exemple@email.com" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors mt-2">
                Créer mon compte
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">
              Déjà inscrit ?{" "}
              <button onClick={() => setView("login")} className="text-[#1e3a5f] font-semibold hover:underline">Se connecter</button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
