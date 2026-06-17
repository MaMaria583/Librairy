import { Settings } from "lucide-react";

export default function ParametresPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-500 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>
          <p className="text-slate-500 text-sm">Configuration de l&apos;application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Informations de la librairie</h2>
          <div className="space-y-3">
            {[
              { label: "Nom de la librairie", placeholder: "Ma Librairie" },
              { label: "Adresse", placeholder: "123 rue des Livres" },
              { label: "Téléphone", placeholder: "+33 1 23 45 67 89" },
              { label: "Email", placeholder: "contact@malibrairie.fr" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Paramètres fiscaux</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Taux de TVA par défaut (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue="0"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Seuil de stock bas par défaut
              </label>
              <input
                type="number"
                min="1"
                defaultValue="5"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Délai invendu (mois)
              </label>
              <input
                type="number"
                min="1"
                defaultValue="3"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-2">Base de données</h2>
          <p className="text-sm text-slate-500 mb-3">
            La base de données SQLite est stockée localement dans <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">prisma/dev.db</code>.
          </p>
          <div className="flex gap-3">
            <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors">
              Exporter les données
            </button>
            <button className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors">
              Ouvrir Prisma Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
