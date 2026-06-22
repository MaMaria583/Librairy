import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Star, BookOpen } from "lucide-react";

export const revalidate = 60;

export default async function StoreHomePage() {
  const coupsDeCoeur = await prisma.product.findMany({
    where: { type: "LIVRE", stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const nouveautes = await prisma.product.findMany({
    where: { type: "LIVRE", stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    skip: 6,
    take: 6,
  });

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative w-full h-[420px] md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&h=800&fit=crop&q=80"
          alt="Bibliothèque"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1e3a5f]/65" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 lg:px-10 text-white max-w-2xl">
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-white/70 mb-3 font-medium">
              Des milliers d&apos;ouvrages sélectionnés avec soin
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 uppercase tracking-tight">
              DÉCOUVREZ VOTRE PROCHAINE<br />AVENTURE LITTÉRAIRE
            </h1>
            <p className="text-sm md:text-base text-white/70 mb-7 max-w-lg">
              Les meilleurs ouvrages sélectionnés avec passion.<br />Explorez et voyagez.
            </p>
            <Link
              href="/livres"
              className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] font-bold px-7 py-3 rounded-md hover:bg-white/90 transition-colors text-sm uppercase tracking-wider"
            >
              Collections récentes
            </Link>
          </div>
        </div>
        {/* Slider dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {[0,1,2].map(i => (
            <span key={i} className={`rounded-full transition-all ${i === 0 ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} />
          ))}
        </div>
      </section>

      {/* ── Nos Coups de Cœur ── */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a5f] text-center mb-10 tracking-wide uppercase">
            Nos Coups de Cœur
          </h2>
          {coupsDeCoeur.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {coupsDeCoeur.map((book) => (
                <Link key={book.id} href={`/livres/${book.id}`} className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-slate-100">
                  {/* Cover */}
                  <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt={book.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 16vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2 mb-1 min-h-[2rem]">
                      {book.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mb-2">{book.author || "Auteur inconnu"}</p>
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-[#1e3a5f] mt-auto">
                      {book.sellPrice.toFixed(2).replace(".", ",")} €
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-10">Aucun livre disponible.</p>
          )}
        </div>
      </section>

      {/* ── Nouveautés ── */}
      {nouveautes.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-[#1e3a5f] uppercase tracking-wide">Nouveautés</h2>
              <Link href="/livres" className="text-sm font-medium text-[#1e3a5f] hover:underline flex items-center gap-1">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {nouveautes.map((book) => (
                <Link key={book.id} href={`/livres/${book.id}`} className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-slate-100">
                  <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt={book.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 16vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2 mb-1 min-h-[2rem]">
                      {book.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mb-2">{book.author || "Auteur inconnu"}</p>
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-[#1e3a5f] mt-auto">
                      {book.sellPrice.toFixed(2).replace(".", ",")} €
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
