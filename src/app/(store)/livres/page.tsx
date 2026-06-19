import Link from "next/link";
import { BookCard } from "@/components/storefront/BookCard";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { Filter } from "lucide-react";

export default async function LivresPage({
  searchParams,
}: {
  searchParams: Promise<{ rayon?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { rayon, q } = params;

  // Build the query
  const whereClause: Prisma.ProductWhereInput = { type: "LIVRE" };
  
  if (rayon) {
    if (rayon === "litterature") whereClause.genre = { contains: "littérature", mode: "insensitive" };
    else if (rayon === "bd-mangas" || rayon === "bd") whereClause.genre = { contains: "bd", mode: "insensitive" };
    else if (rayon === "jeunesse") whereClause.genre = { contains: "jeunesse", mode: "insensitive" };
    else whereClause.genre = { contains: rayon.replace('-', ' '), mode: "insensitive" };
  }

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { isbn: { contains: q, mode: "insensitive" } },
    ];
  }

  const books = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 space-y-8">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-900 border-b pb-2">
              <Filter className="h-5 w-5" /> Filtrer par rayon
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/livres" className={`hover:text-blue-600 ${!rayon ? 'font-bold text-blue-600' : ''}`}>Tous les livres</Link></li>
              <li><Link href="/livres?rayon=litterature" className={`hover:text-blue-600 ${rayon === 'litterature' ? 'font-bold text-blue-600' : ''}`}>Littérature</Link></li>
              <li><Link href="/livres?rayon=bd" className={`hover:text-blue-600 ${rayon === 'bd' ? 'font-bold text-blue-600' : ''}`}>BD & Mangas</Link></li>
              <li><Link href="/livres?rayon=jeunesse" className={`hover:text-blue-600 ${rayon === 'jeunesse' ? 'font-bold text-blue-600' : ''}`}>Jeunesse</Link></li>
              <li><Link href="/livres?rayon=vie-pratique" className={`hover:text-blue-600 ${rayon === 'vie-pratique' ? 'font-bold text-blue-600' : ''}`}>Vie pratique</Link></li>
              <li><Link href="/livres?rayon=sciences-humaines" className={`hover:text-blue-600 ${rayon === 'sciences-humaines' ? 'font-bold text-blue-600' : ''}`}>Sciences humaines</Link></li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {rayon ? `Rayon : ${rayon.charAt(0).toUpperCase() + rayon.slice(1).replace('-', ' ')}` : "Tous les livres"}
          </h1>
          <p className="text-slate-500">
            {books.length} {books.length > 1 ? "résultats trouvés" : "résultat trouvé"}
          </p>
        </div>

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
                  genre: book.genre,
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-lg text-slate-500 font-medium">Aucun livre ne correspond à votre recherche.</p>
            <Link href="/livres" className="mt-4 inline-block text-blue-600 hover:underline">Voir tous les livres</Link>
          </div>
        )}
      </main>
    </div>
  );
}
