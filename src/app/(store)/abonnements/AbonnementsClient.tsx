"use client";

import { useState, useTransition } from "react";
import { Bell, BellOff, CheckCircle, Sparkles, BookOpen } from "lucide-react";
import { toggleSubscription } from "./actions";
import { BookCard } from "@/components/storefront/BookCard";
import type { BookProps } from "@/components/storefront/BookCard";

interface Catalogue { slug: string; label: string; }

interface Props {
  catalogues: Catalogue[];
  subscribedGenres: string[];
  newBooks: BookProps[];
  userName: string;
}

export function AbonnementsClient({ catalogues, subscribedGenres, newBooks, userName }: Props) {
  const [subscribed, setSubscribed] = useState<string[]>(subscribedGenres);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleToggle(slug: string) {
    startTransition(async () => {
      const res = await toggleSubscription(slug);
      if ("error" in res) return;
      setSubscribed((prev) =>
        res.subscribed ? [...prev, slug] : prev.filter((g) => g !== slug)
      );
      setFeedback(res.subscribed ? "Abonnement activé !" : "Abonnement retiré.");
      setTimeout(() => setFeedback(null), 2500);
    });
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-[#1e3a5f]/10 rounded-full p-2">
          <Bell className="w-5 h-5 text-[#1e3a5f]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">Mes abonnements</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Bonjour <span className="font-semibold text-slate-700">{userName}</span> — sélectionnez les rayons qui vous intéressent pour être notifié dès qu&apos;un nouveau livre arrive.
      </p>

      {feedback && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Catalogue grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {catalogues.map(({ slug, label }) => {
          const isOn = subscribed.includes(slug);
          return (
            <button
              key={slug}
              onClick={() => handleToggle(slug)}
              disabled={isPending}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                isOn
                  ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-[#1e3a5f]/40"
              }`}
            >
              {isOn ? <Bell className="w-4 h-4 shrink-0" /> : <BellOff className="w-4 h-4 shrink-0 text-slate-400" />}
              <span className="text-sm font-medium leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Nouvelles entrées correspondant aux goûts */}
      {subscribed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-[#1e3a5f]">Nouveaux livres pour vous</h2>
            <span className="text-xs text-slate-400">(7 derniers jours)</span>
          </div>

          {newBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {newBooks.map((book) => (
                <BookCard key={book.id} book={book} badge="Nouveau" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Aucune nouveauté cette semaine dans vos rayons.</p>
              <p className="text-xs text-slate-400 mt-1">Vous serez notifié dès qu&apos;un nouveau livre arrive !</p>
            </div>
          )}
        </div>
      )}

      {subscribed.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Abonnez-vous à un rayon pour voir les nouvelles entrées.</p>
        </div>
      )}
    </div>
  );
}
