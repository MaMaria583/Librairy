import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Comment passer une commande ?",
    a: "Ajoutez les livres à votre panier, puis cliquez sur « Passer la commande ». Vous pouvez finaliser par WhatsApp ou Mobile Money (Orange Money, Moov).",
  },
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Nous acceptons Orange Money, Moov Money et les paiements via WhatsApp. Le paiement à la livraison est aussi disponible selon la zone.",
  },
  {
    q: "Livrez-vous partout au Mali ?",
    a: "Nous livrons à Bamako et dans les principales villes. Contactez-nous via WhatsApp pour les détails de livraison dans votre zone.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Après validation, nous vous envoyons une confirmation via WhatsApp avec les détails de suivi.",
  },
  {
    q: "Puis-je retourner un livre ?",
    a: "Oui, sous 7 jours si le livre est en parfait état. Contactez-nous par WhatsApp pour organiser le retour.",
  },
  {
    q: "Comment abonner à des notifications de nouveautés ?",
    a: "Connectez-vous à votre compte, puis rendez-vous dans la section « Abonnements » pour choisir vos genres préférés.",
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-14 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-amber-100 rounded-full p-2">
          <HelpCircle className="w-6 h-6 text-amber-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">Questions fréquentes</h1>
      </div>
      <p className="text-slate-500 mb-10 text-sm">Trouvez rapidement une réponse à vos questions.</p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <p className="font-bold text-[#1e3a5f] mb-2">{faq.q}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
