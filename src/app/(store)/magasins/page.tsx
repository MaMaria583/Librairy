import { MapPin, Clock, Phone } from "lucide-react";

export default function MagasinsPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-14 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-[#1e3a5f]/10 rounded-full p-2">
          <MapPin className="w-6 h-6 text-[#1e3a5f]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">Nos magasins</h1>
      </div>
      <p className="text-slate-500 mb-10 text-sm">Retrouvez-nous en boutique ou commandez en ligne.</p>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-xl font-bold text-[#1e3a5f]">DAR ELHIKMA — Bamako</h2>

        <div className="flex items-start gap-3 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-[#1e3a5f] mt-0.5 shrink-0" />
          <span>Mali — Bamako</span>
        </div>

        <div className="flex items-start gap-3 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-[#1e3a5f] mt-0.5 shrink-0" />
          <div>
            <p>Lundi — Samedi : 08h00 – 20h00</p>
            <p>Dimanche : 09h00 – 17h00</p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm text-slate-600">
          <Phone className="w-4 h-4 text-[#1e3a5f] mt-0.5 shrink-0" />
          <a href="https://wa.me/22394664694" className="text-[#1e3a5f] hover:underline">+223 94 66 46 94</a>
        </div>
      </div>
    </div>
  );
}
