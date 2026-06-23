export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-14 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-[#1e3a5f] mb-2">Mentions légales</h1>
      <p className="text-slate-400 text-sm mb-10">Dernière mise à jour : Juin 2025</p>
      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">Éditeur du site</h2>
          <p><strong>DAR ELHIKMA</strong> — Librairie et Papeterie</p>
          <p>Bamako, Mali</p>
          <p>Téléphone / WhatsApp : +223 94 66 46 94</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">Hébergement</h2>
          <p>Ce site est hébergé par des services cloud tiers (Vercel / Neon). Toute réclamation relative à l&apos;hébergement peut être adressée à ces prestataires.</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de ce site (textes, images, logo) est la propriété de DAR ELHIKMA. Toute reproduction sans autorisation est interdite.</p>
        </section>
        <section>
          <h2 className="font-bold text-slate-800 text-base mb-2">Responsabilité</h2>
          <p>DAR ELHIKMA s&apos;efforce de maintenir des informations exactes mais ne peut être tenu responsable des erreurs ou omissions.</p>
        </section>
      </div>
    </div>
  );
}
