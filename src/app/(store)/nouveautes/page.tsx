import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/storefront/BookCard";
import { Sparkles } from "lucide-react";

export default async function NouveautesPage() {
  const books = await prisma.product.findMany({
    where: { type: "LIVRE", isNew: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-amber-100 rounded-full p-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">Nouveautés</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">Les dernières acquisitions de la librairie.</p>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
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
              badge="Nouveau"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-amber-200">
          <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucune nouveauté pour le moment.</p>
          <p className="text-sm text-slate-400 mt-1">Revenez bientôt !</p>
        </div>
      )}
    </div>
  );
}
