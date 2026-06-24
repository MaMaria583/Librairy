"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CreditCard, Hash, PackageCheck, AlertCircle,
  Loader2, ArrowLeft, CheckCircle2, MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const WHATSAPP_NUMBER = "22394664694";
const PAYMENT_METHODS = ["Orange Money", "Wave", "Sama Money", "Moov Money"];

interface SuccessData {
  orderId: string;
  customerName: string;
  total: number;
  paidAt: string;
}

function ConfirmPaymentForm() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("ref") ?? "");
  const [transactionRef, setTransactionRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !transactionRef.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId.trim(),
          transactionRef: transactionRef.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
      setSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    const whatsappMsg = encodeURIComponent(
      `Bonjour DAR ELHIKMA 👋\n\nJ'ai confirmé mon paiement en ligne.\n\n🔖 Réf. commande : ${success.orderId.slice(0, 16).toUpperCase()}\n✅ Statut : Payée\n💰 Total : ${formatPrice(success.total)}\n\nMerci !`
    );
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Paiement confirmé !</h1>
            <p className="text-sm text-slate-500 mt-1">
              Bonjour <strong>{success.customerName}</strong>, votre paiement a bien été enregistré.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Référence</span>
              <span className="font-mono font-bold text-[#1e3a5f]">{success.orderId.slice(0, 16).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Montant</span>
              <span className="font-bold text-slate-900">{formatPrice(success.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payé le</span>
              <span className="text-slate-700">
                {new Date(success.paidAt).toLocaleString("fr-FR", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            Le stock a été mis à jour automatiquement. Vous serez contacté(e) pour la livraison.
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1db954] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Contacter DAR ELHIKMA via WhatsApp
          </a>

          <Link href="/livres" className="block text-sm text-slate-400 hover:text-slate-600">
            ← Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour à l&apos;accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1e3a5f] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white">Confirmer mon paiement</h1>
                <p className="text-xs text-white/70 mt-0.5">
                  Orange Money · Wave · Sama Money · Moov Money
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Instructions */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 space-y-1">
              <p className="font-semibold">Comment confirmer ?</p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-amber-700">
                <li>Envoyez le montant exact via Mobile Money au <strong>94 66 46 94</strong></li>
                <li>Copiez le <strong>numéro de transaction</strong> reçu par SMS</li>
                <li>Renseignez votre <strong>référence de commande</strong> ci-dessous</li>
              </ol>
            </div>

            {/* Méthode de paiement (info) */}
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <span key={m} className="text-xs border border-slate-200 bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full">
                  {m}
                </span>
              ))}
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Champ référence commande */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Hash className="w-3.5 h-3.5" /> Référence de commande *
              </span>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ex : CMQRUYH4H0001R3CW…"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 placeholder:font-sans"
              />
              <p className="text-xs text-slate-400 mt-1">
                Trouvez cette référence dans le SMS ou l&apos;email de confirmation de commande.
              </p>
            </label>

            {/* Numéro de transaction */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Numéro de transaction Mobile Money *
              </span>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Ex : OM241231ABCD1234 ou 1234567890"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 placeholder:font-sans"
              />
              <p className="text-xs text-slate-400 mt-1">
                Ce numéro est indiqué dans le SMS de confirmation de votre opérateur.
              </p>
            </label>

            <button
              type="submit"
              disabled={loading || !orderId.trim() || !transactionRef.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Vérification en cours…</>
              ) : (
                <><PackageCheck className="w-4 h-4" /> Valider mon paiement</>
              )}
            </button>

            <div className="text-center pt-1">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, j'ai besoin d'aide pour confirmer mon paiement.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Besoin d&apos;aide ? Contactez-nous
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmerPaiementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
      </div>
    }>
      <ConfirmPaymentForm />
    </Suspense>
  );
}
