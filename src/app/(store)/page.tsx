import { BookCard } from "@/components/storefront/BookCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, BookMarked, Sparkles, TrendingUp } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function StoreHomePage() {
  // Fetch latest books
  const latestBooks = await prisma.product.findMany({
    where: { type: "LIVRE" },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-blue-50 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> Nouveautés de la semaine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Trouvez votre <br />
              <span className="text-blue-600">prochaine lecture</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg">
              Découvrez notre sélection de milliers de livres, romans, mangas et BD. La culture à portée de clic avec le conseil de nos libraires.
            </p>
            <div className="pt-4 flex gap-4">
              <Link href="/livres" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-600/30">
                Parcourir le catalogue
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex justify-center relative">
            <div className="w-64 h-80 bg-white shadow-2xl rounded-lg -rotate-6 absolute z-10 border border-slate-100 flex items-center justify-center p-4 text-slate-300">Image Couverture</div>
            <div className="w-64 h-80 bg-blue-100 shadow-xl rounded-lg rotate-6 translate-x-12 translate-y-6"></div>
          </div>
        </div>
      </section>

      {/* Latest Books Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900">
            <TrendingUp className="text-blue-600" /> Dernières parutions
          </h2>
          <Link href="/livres" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latestBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={{
                  id: book.id,
                  title: book.name,
                  author: book.author || "",
                  price: book.sellPrice,
                  genre: book.genre,
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Aucun livre n&apos;a encore été ajouté à la boutique.</p>
          </div>
        )}
      </section>

      {/* Categories Banners */}
      <section className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900 mb-8">
          <BookMarked className="text-blue-600" /> Explorer par rayon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/livres?rayon=litterature" className="group relative h-48 rounded-2xl overflow-hidden bg-slate-900 flex items-end p-6">
            <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/60 transition-colors"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Littérature</h3>
              <p className="text-blue-100 text-sm group-hover:translate-x-2 transition-transform flex items-center gap-1">
                Découvrir <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
          <Link href="/livres?rayon=bd" className="group relative h-48 rounded-2xl overflow-hidden bg-slate-900 flex items-end p-6">
            <div className="absolute inset-0 bg-red-900/40 group-hover:bg-red-900/60 transition-colors"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">BD & Mangas</h3>
              <p className="text-red-100 text-sm group-hover:translate-x-2 transition-transform flex items-center gap-1">
                Découvrir <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
          <Link href="/livres?rayon=jeunesse" className="group relative h-48 rounded-2xl overflow-hidden bg-slate-900 flex items-end p-6">
            <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/60 transition-colors"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Jeunesse</h3>
              <p className="text-green-100 text-sm group-hover:translate-x-2 transition-transform flex items-center gap-1">
                Découvrir <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
