export default function ConfidentialitePage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-14 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-[#1e3a5f] mb-2">Politique de confidentialité</h1>
      <p className="text-slate-400 text-sm mb-10">Dernière mise à jour : Juin 2025</p>
      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">1. Données collectées</h2>
          <p>Nous collectons uniquement les données nécessaires à la gestion de votre compte et de vos commandes : nom, email, et numéro de téléphone.</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">2. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour traiter vos commandes et vous envoyer des notifications de nouveautés si vous y avez consenti.</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">3. Partage des données</h2>
          <p>Nous ne vendons ni ne partageons vos données personnelles avec des tiers.</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">4. Vos droits</h2>
          <p>Vous pouvez demander la suppression de vos données à tout moment en nous contactant par WhatsApp au +223 94 66 46 94.</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">5. Contact</h2>
          <p>Pour toute question relative à vos données personnelles : DAR ELHIKMA — +223 94 66 46 94</p>
        </section>
      </div>
    </div>
  );
}
