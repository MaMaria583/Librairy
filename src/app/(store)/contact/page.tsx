import { MessageCircle, Phone, Facebook } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-14 max-w-2xl">
      <h1 className="text-3xl font-extrabold text-[#1e3a5f] mb-2">Nous contacter</h1>
      <p className="text-slate-500 mb-10">Nous sommes disponibles pour répondre à toutes vos questions.</p>

      <div className="grid gap-5">
        <a
          href="https://wa.me/22394664694"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 hover:shadow-md transition-shadow group"
        >
          <div className="bg-emerald-500 text-white rounded-full p-3 shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">WhatsApp</p>
            <p className="text-sm text-slate-500">+223 94 66 46 94</p>
            <p className="text-xs text-slate-400 mt-1">Réponse rapide — disponible tous les jours</p>
          </div>
        </a>

        <a
          href="tel:+22394664694"
          className="flex items-center gap-5 bg-blue-50 border border-blue-100 rounded-2xl p-6 hover:shadow-md transition-shadow group"
        >
          <div className="bg-[#1e3a5f] text-white rounded-full p-3 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-800 group-hover:text-[#1e3a5f] transition-colors">Appel téléphonique</p>
            <p className="text-sm text-slate-500">+223 94 66 46 94</p>
          </div>
        </a>

        <a
          href="https://www.facebook.com/profile.php?id=61578883261940"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-5 bg-blue-50 border border-blue-200 rounded-2xl p-6 hover:shadow-md transition-shadow group"
        >
          <div className="bg-[#1877f2] text-white rounded-full p-3 shrink-0">
            <Facebook className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-800 group-hover:text-[#1877f2] transition-colors">Page Facebook</p>
            <p className="text-sm text-slate-500">DAR ELHIKMA — Librairie & Papeterie</p>
          </div>
        </a>
      </div>
    </div>
  );
}
