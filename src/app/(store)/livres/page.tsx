import Link from "next/link";
import { BookCard } from "@/components/storefront/BookCard";
import { FuzzyBookSearch } from "@/components/storefront/FuzzyBookSearch";
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
  
  const RAYONS: Record<string, string> = {
    roman: "roman",
    "developpement-personnel": "développement personnel",
    jeunesse: "jeunesse",
    "bd-mangas": "bd",
    art: "art",
    autres: "autres",
    education: "éducation",
    "livres-islamiques": "islamique",
    "jeux-enfants": "jeux",
  };

  if (rayon && RAYONS[rayon]) {
    whereClause.genre = { contains: RAYONS[rayon], mode: "insensitive" };
  }

  const books = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24">
          <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-base flex items-center gap-2 mb-4 text-[#1e3a5f] border-b border-pink-100 pb-3">
              <Filter className="h-4 w-4" /> Filtrer par rayon
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { slug: "", label: "Tous les livres" },
                { slug: "roman", label: "Livre Roman" },
                { slug: "developpement-personnel", label: "Livre Développement personnel" },
                { slug: "jeunesse", label: "Livre Jeunesse" },
                { slug: "bd-mangas", label: "Livre BD & Mangas" },
                { slug: "art", label: "Livre Art" },
                { slug: "education", label: "Livre Éducation" },
                { slug: "livres-islamiques", label: "Livres islamiques" },
                { slug: "jeux-enfants", label: "Jeux pour enfants" },
                { slug: "autres", label: "Autres Livres" },
              ].map(({ slug, label }) => (
                <li key={slug}>
                  <Link
                    href={slug ? `/livres?rayon=${slug}` : "/livres"}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      (slug === "" && !rayon) || rayon === slug
                        ? "font-bold text-white bg-[#1e3a5f]"
                        : "text-slate-600 hover:bg-pink-50 hover:text-[#1e3a5f]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] mb-1">
            {q
              ? `Recherche : "${q}"`
              : rayon
              ? `Rayon : ${{ roman: "Livre Roman", "developpement-personnel": "Livre Développement personnel", jeunesse: "Livre Jeunesse", "bd-mangas": "Livre BD & Mangas", art: "Livre Art", fourniture: "Livre Fourniture", education: "Livre Éducation", "livres-islamiques": "Livres islamiques", "jeux-enfants": "Jeux pour enfants", autres: "Autres Livres" }[rayon] ?? rayon}`
              : "Tous les livres"}
          </h1>
        </div>

        {q ? (
          <FuzzyBookSearch
            query={q}
            books={books.map((book) => ({
              id: book.id,
              title: book.name,
              author: book.author || "",
              price: book.sellPrice,
              imageUrl: book.imageUrl,
              genre: book.genre,
            }))}
          />
        ) : books.length > 0 ? (
          <>
            <p className="text-slate-500 text-sm mb-6">
              {books.length} résultat{books.length > 1 ? "s" : ""}
            </p>
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
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-pink-200">
            <p className="text-lg text-slate-500 font-medium">Aucun livre dans ce rayon pour l&apos;instant.</p>
            <Link href="/livres" className="mt-4 inline-block text-[#1e3a5f] hover:underline">Voir tous les livres</Link>
          </div>
        )}
      </main>
    </div>
  );
}
