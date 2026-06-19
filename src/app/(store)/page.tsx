import Link from "next/link";
import Image from "next/image";
import { BookCard } from "@/components/storefront/BookCard";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Sparkles } from "lucide-react";

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
    take: 8,
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=800&fit=crop&q=80"
          alt="Librairie"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1e3a5f]/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 lg:px-8 text-center text-white">
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white/80 mb-4">
              Des milliers d&apos;ouvrages sélectionnés avec passion
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
              DÉCOUVREZ VOTRE PROCHAINE AVENTURE LITTÉRAIRE
            </h1>
            <Link
              href="/livres"
              className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] font-semibold px-8 py-3.5 rounded-lg hover:bg-white/90 transition-colors text-sm tracking-wide uppercase"
            >
              Collections récentes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Nos Coups de Cœur */}
      <section className="py-14 md:py-20 bg-[#faf9f7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Sparkles className="h-5 w-5 text-[#c0392b]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] tracking-wide uppercase text-center">
              Nos Coups de Cœur
            </h2>
            <Sparkles className="h-5 w-5 text-[#c0392b]" />
          </div>

          {coupsDeCoeur.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
              {coupsDeCoeur.map((book) => (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.id,
                    title: book.name,
                    author: book.author || "",
                    price: book.sellPrice,
                    imageUrl: book.imageUrl,
                    genre: book.genre,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">
              Aucun livre disponible pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* Nouveautés */}
      {nouveautes.length > 0 && (
        <section className="py-14 md:py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-[#1e3a5f] tracking-wide uppercase">
                Nouveautés
              </h2>
              <Link
                href="/livres"
                className="text-sm font-medium text-[#1e3a5f] hover:underline flex items-center gap-1"
              >
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {nouveautes.map((book) => (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.id,
                    title: book.name,
                    author: book.author || "",
                    price: book.sellPrice,
                    imageUrl: book.imageUrl,
                    genre: book.genre,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
