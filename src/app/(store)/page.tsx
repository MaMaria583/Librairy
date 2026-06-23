import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Star, BookOpen } from "lucide-react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { formatPrice } from "@/lib/formatPrice";

export const revalidate = 60;

export default async function StoreHomePage() {
  const coupsDeCoeur = await prisma.product.findMany({
    where: { type: "LIVRE", stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const nouveautes = await prisma.product.findMany({
    where: { type: "LIVRE", stock: { gt: 0 }, isNew: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="flex flex-col">

      <HeroSlider />

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
                      {formatPrice(book.sellPrice)}
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
                      {formatPrice(book.sellPrice)}
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
