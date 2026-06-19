import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, BookOpen, Music, Palette, Star } from "lucide-react";

export const revalidate = 60;

const HERO_COLORS = [
  "bg-[#7c6fd4]",
  "bg-[#4bb8c4]",
  "bg-[#f5f5f5]",
];

const CATEGORIES = [
  { label: "Littérature", href: "/livres?rayon=litterature", icon: BookOpen, color: "bg-orange-100 text-orange-500" },
  { label: "Musique", href: "/livres?rayon=musique", icon: Music, color: "bg-green-100 text-green-500" },
  { label: "Arts", href: "/livres?rayon=arts", icon: Palette, color: "bg-purple-100 text-purple-500" },
  { label: "Jeunesse", href: "/livres?rayon=jeunesse", icon: Star, color: "bg-pink-100 text-pink-500" },
];

export default async function StoreHomePage() {
  const featuredBooks = await prisma.product.findMany({
    where: { type: "LIVRE", stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  const heroBooks = featuredBooks.slice(0, 3);
  const gridBooks = featuredBooks.slice(0, 4);

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero Slider (static 3 cards) ── */}
      <section className="container mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {heroBooks.map((book, idx) => (
            <Link
              key={book.id}
              href={`/livres/${book.id}`}
              className={`relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-between p-7 group transition-transform hover:-translate-y-1 duration-300 ${HERO_COLORS[idx % 3]}`}
            >
              {/* Text */}
              <div className={idx === 2 ? "text-slate-800" : "text-white"}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-70">
                  {book.author || "Auteur inconnu"}
                </p>
                <h2 className="text-2xl font-black leading-tight mb-3 line-clamp-3">
                  {book.name}
                </h2>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= 4 ? "fill-current" : "opacity-30 fill-current"}`} />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider border-b-2 pb-0.5 border-current opacity-80 group-hover:opacity-100 transition-opacity">
                  Détails <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              {/* Book cover floating */}
              {book.imageUrl && (
                <div className="absolute bottom-0 right-4 w-24 h-36 shadow-2xl rounded-md overflow-hidden transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Image
                    src={book.imageUrl}
                    alt={book.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {[0,1,2].map(i => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-slate-800 w-4" : "bg-slate-300"} transition-all`} />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container mx-auto px-6 lg:px-10 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-5 py-4 hover:shadow-md transition-all group"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${cat.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{cat.label}</p>
                  <p className="text-xs text-slate-400">Collection</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="container mx-auto px-6 lg:px-10 py-10">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Featured</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {gridBooks.map((book) => (
            <Link key={book.id} href={`/livres/${book.id}`} className="group flex flex-col">
              {/* Title + Author above cover */}
              <div className="mb-3 text-center">
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-green-600 transition-colors">
                  {book.name}
                </h3>
                <p className="text-xs text-slate-400">By {book.author || "Auteur inconnu"}</p>
              </div>
              {/* Cover */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt={book.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs text-center p-4">
                    <BookOpen className="w-10 h-10 opacity-30" />
                  </div>
                )}
              </div>
              {/* Price */}
              <p className="text-center font-bold text-slate-900 mt-3 text-sm">
                {book.sellPrice.toFixed(2).replace(".", ",")} €
              </p>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            href="/livres"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-8 py-3 rounded-full hover:bg-slate-700 transition-colors text-sm"
          >
            Voir tous les livres <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
