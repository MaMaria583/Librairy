import { BookCard } from "@/components/storefront/BookCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Revalidate every minute

export default async function StoreHomePage() {
  // Fetch books by categories based on our seeded genres
  const litteratureBooks = await prisma.product.findMany({
    where: { 
      type: "LIVRE",
      genre: { in: ["Littérature classique", "Roman", "Aventure", "Science-fiction"] }
    },
    take: 10,
  });

  const devPersoBooks = await prisma.product.findMany({
    where: { 
      type: "LIVRE",
      genre: "Développement personnel"
    },
    take: 10,
  });

  const jeunesseBooks = await prisma.product.findMany({
    where: { 
      type: "LIVRE",
      genre: "Fantasy / Jeunesse"
    },
    take: 10,
  });

  return (
    <div className="flex flex-col p-6 lg:p-10 gap-12 max-w-full overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
        VOTRE SÉLECTION PERSONNALISÉE PAR CATÉGORIE
      </h1>

      {litteratureBooks.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              DÉCOUVREZ NOTRE SÉLECTION LITTÉRATURE 
            </h2>
            <span className="text-slate-500 font-medium text-sm">({litteratureBooks.length} COUVERTURES)</span>
          </div>
          <div className="flex overflow-x-auto gap-4 py-2 snap-x no-scrollbar -mx-2 px-2">
            {litteratureBooks.map((book) => (
              <div key={book.id} className="snap-start flex-none">
                <BookCard 
                  book={{
                    id: book.id,
                    title: book.name,
                    author: book.author || "",
                    price: book.sellPrice,
                    imageUrl: book.imageUrl,
                    genre: book.genre,
                  }} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {devPersoBooks.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              DÉCOUVREZ NOTRE SÉLECTION DÉVELOPPEMENT PERSONNEL
            </h2>
            <span className="text-slate-500 font-medium text-sm">({devPersoBooks.length} COUVERTURES)</span>
          </div>
          <div className="flex overflow-x-auto gap-4 py-2 snap-x no-scrollbar -mx-2 px-2">
            {devPersoBooks.map((book) => (
              <div key={book.id} className="snap-start flex-none">
                <BookCard 
                  book={{
                    id: book.id,
                    title: book.name,
                    author: book.author || "",
                    price: book.sellPrice,
                    imageUrl: book.imageUrl,
                    genre: book.genre,
                  }} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {jeunesseBooks.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 uppercase">
              DÉCOUVREZ NOTRE SÉLECTION JEUNESSE
            </h2>
            <span className="text-slate-500 font-medium text-sm">({jeunesseBooks.length} COUVERTURES)</span>
          </div>
          <div className="flex overflow-x-auto gap-4 py-2 snap-x no-scrollbar -mx-2 px-2">
            {jeunesseBooks.map((book) => (
              <div key={book.id} className="snap-start flex-none">
                <BookCard 
                  book={{
                    id: book.id,
                    title: book.name,
                    author: book.author || "",
                    price: book.sellPrice,
                    imageUrl: book.imageUrl,
                    genre: book.genre,
                  }} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
