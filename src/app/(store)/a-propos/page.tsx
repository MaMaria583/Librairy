import { BookOpen, MapPin, Phone, Mail } from "lucide-react";

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-14 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#1e3a5f]/10 rounded-full p-2">
          <BookOpen className="w-6 h-6 text-[#1e3a5f]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">À propos de nous</h1>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p className="text-lg leading-relaxed">
          <strong className="text-[#1e3a5f]">DAR ELHIKMA</strong> est une librairie et papeterie basée au Mali, 
          dédiée à rendre la lecture et les fournitures scolaires accessibles à tous.
        </p>
        <p className="leading-relaxed">
          Notre mission est de promouvoir la culture et l&apos;éducation en proposant un large choix de livres : 
          romans, développement personnel, littérature islamique, jeunesse, BD et bien plus encore.
        </p>
        <p className="leading-relaxed">
          Nous proposons également des fournitures scolaires et de bureau de qualité pour accompagner 
          étudiants, enseignants et professionnels au quotidien.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <MapPin className="w-6 h-6 text-[#1e3a5f]" />
          <p className="text-sm font-semibold text-slate-800">Adresse</p>
          <p className="text-xs text-slate-500">Mali</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <Phone className="w-6 h-6 text-[#1e3a5f]" />
          <p className="text-sm font-semibold text-slate-800">Téléphone / WhatsApp</p>
          <a href="https://wa.me/22394664694" className="text-xs text-[#1e3a5f] hover:underline">+223 94 66 46 94</a>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center text-center gap-2">
          <Mail className="w-6 h-6 text-[#1e3a5f]" />
          <p className="text-sm font-semibold text-slate-800">Réseaux sociaux</p>
          <a href="https://www.facebook.com/profile.php?id=61578883261940" target="_blank" rel="noopener noreferrer" className="text-xs text-[#1e3a5f] hover:underline">Facebook</a>
        </div>
      </div>
    </div>
  );
}
