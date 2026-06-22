"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { User, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { registerUser } from "./actions";

type View = "home" | "login" | "register" | "success";

export default function ComptePage() {
  const [view, setView] = useState<View>("home");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (res?.error) {
        setError("E-mail ou mot de passe incorrect.");
      } else {
        window.location.href = "/";
      }
    });
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await registerUser(formData);
      if (result.success) {
        setView("success");
      } else {
        setError(result.error);
      }
    });
  }

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

        {/* ── Succès inscription ── */}
        {view === "success" && (
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-emerald-50 rounded-full p-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-[#1e3a5f] mb-2">Compte créé !</h2>
            <p className="text-slate-500 text-sm mb-6">
              Votre compte a bien été créé. Vous pouvez maintenant vous connecter.
            </p>
            <button
              onClick={() => { setView("login"); setError(null); }}
              className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Se connecter
            </button>
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Adresse e-mail</label>
                <input
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-right mt-1"><button type="button" className="text-xs text-[#1e3a5f] hover:underline">Mot de passe oublié ?</button></p>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
              >
                {isPending ? "Connexion..." : "Se connecter"}
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nom complet</label>
                <input name="name" type="text" placeholder="Prénom Nom" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Adresse e-mail</label>
                <input name="email" type="email" placeholder="exemple@email.com" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
              >
                {isPending ? "Création en cours..." : "Créer mon compte"}
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
