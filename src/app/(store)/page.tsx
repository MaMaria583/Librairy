import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Truck, Shield, Clock, Search } from "lucide-react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { BookCard } from "@/components/storefront/BookCard";

export const revalidate = 60;

export default async function StoreHomePage() {
  const [coupsDeCoeur, nouveautes, totalBooks, totalGenres] = await Promise.all([
    prisma.product.findMany({
      where: { type: "LIVRE", stock: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { type: "LIVRE", stock: { gt: 0 }, isNew: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.count({ where: { type: "LIVRE", stock: { gt: 0 } } }),
    prisma.product.findMany({
      where: { type: "LIVRE", genre: { not: null } },
      select: { genre: true },
      distinct: ["genre"],
    }),
  ]);

  return (
    <div className="flex flex-col">

      <HeroSlider />

      {/* ── Bandeau chiffres clés ── */}
      <section className="bg-[#1e3a5f] py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: `${totalBooks}+`, label: "Livres disponibles" },
              { value: `${totalGenres.length}`, label: "Genres & rayons" },
              { value: "Bamako", label: "Livraison à domicile" },
              { value: "24h", label: "Délai de livraison" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nos Coups de Cœur ── */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a5f] tracking-wide uppercase">
              Nos Coups de Cœur
            </h2>
            <Link href="/livres" className="text-sm font-medium text-[#1e3a5f] hover:underline flex items-center gap-1 shrink-0">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {coupsDeCoeur.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {coupsDeCoeur.map((book) => (
                <BookCard
                  key={book.id}
                  book={{ id: book.id, title: book.name, author: book.author ?? "", price: book.sellPrice, imageUrl: book.imageUrl, genre: book.genre }}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-10">Aucun livre disponible pour le moment.</p>
          )}
        </div>
      </section>

      {/* ── Bannière livraison ── */}
      <section className="bg-gradient-to-r from-[#c0392b] to-[#e74c3c] py-10">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-extrabold">📦 Livraison à domicile sur Bamako</h3>
            <p className="text-white/80 mt-1">Commandez en ligne, recevez chez vous en 24h. Paiement Mobile Money accepté.</p>
          </div>
          <Link
            href="/livres"
            className="shrink-0 bg-white text-[#c0392b] font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition flex items-center gap-2"
          >
            Commander maintenant <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Nouveautés ── */}
      {nouveautes.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-[#1e3a5f] uppercase tracking-wide">Nouveautés</h2>
              <Link href="/nouveautes" className="text-sm font-medium text-[#1e3a5f] hover:underline flex items-center gap-1 shrink-0">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {nouveautes.map((book) => (
                <BookCard
                  key={book.id}
                  badge="Nouveau"
                  book={{ id: book.id, title: book.name, author: book.author ?? "", price: book.sellPrice, imageUrl: book.imageUrl, genre: book.genre }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pourquoi nous choisir ── */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-extrabold text-[#1e3a5f] text-center uppercase tracking-wide mb-10">
            Pourquoi choisir DAR ELHIKMA ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Search,  title: "Large catalogue",       desc: `Plus de ${totalBooks} livres disponibles dans tous les genres.` },
              { icon: Truck,   title: "Livraison rapide",       desc: "Livraison à domicile sur Bamako en moins de 24h." },
              { icon: Shield,  title: "Paiement sécurisé",      desc: "Paiement Mobile Money (Orange, Wave, Moov) sans risque." },
              { icon: Clock,   title: "Commande 24h/7j",        desc: "Passez votre commande à n'importe quelle heure depuis notre site." },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-[#1e3a5f]" />
                </div>
                <h3 className="font-bold text-slate-800">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA suivi commande ── */}
      <section className="bg-slate-50 py-10 border-t border-slate-100">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-slate-600 font-medium mb-3">Vous avez déjà passé une commande ?</p>
          <Link
            href="/suivi-commande"
            className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#16304f] transition"
          >
            Suivre ma commande <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
