import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowLeft, Star, ShoppingCart, Package } from "lucide-react";

export default async function LivreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = await prisma.product.findUnique({
    where: { id, type: "LIVRE" },
    include: { supplier: true },
  });

  if (!book) {
    notFound();
  }

  const imageSrc =
    book.imageUrl || `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <Link
        href="/livres"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour aux livres
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Cover */}
        <div className="relative aspect-[2/3] w-full max-w-sm mx-auto md:mx-0 rounded-xl overflow-hidden bg-slate-100 shadow-lg">
          {book.imageUrl ? (
            <Image
              src={imageSrc}
              alt={book.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <BookOpen size={48} />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
              {book.genre || "Livre"}
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">
              {book.name}
            </h1>
            <p className="text-lg text-slate-500">
              par <span className="font-medium text-slate-700">{book.author || "Auteur inconnu"}</span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`}
              />
            ))}
            <span className="text-sm text-slate-400 ml-2">(4.0)</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-slate-900">
              {book.sellPrice.toFixed(2).replace(".", ",")} €
            </span>
            {book.buyPrice > 0 && (
              <span className="text-sm text-slate-400 line-through">
                {(book.sellPrice * 1.2).toFixed(2).replace(".", ",")} €
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              <ShoppingCart size={18} />
              Ajouter au panier
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div>
              <span className="block text-xs text-slate-400 uppercase tracking-wider">Éditeur</span>
              <span className="font-medium text-slate-800">{book.publisher || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 uppercase tracking-wider">ISBN</span>
              <span className="font-medium text-slate-800 font-mono">{book.isbn || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 uppercase tracking-wider">Emplacement</span>
              <span className="font-medium text-slate-800">{book.location || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 uppercase tracking-wider">Fournisseur</span>
              <span className="font-medium text-slate-800">{book.supplier?.name || "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 uppercase tracking-wider">Stock</span>
              <span className={`font-medium inline-flex items-center gap-1 ${book.stock === 0 ? "text-red-600" : book.stock <= book.alertThreshold ? "text-orange-500" : "text-emerald-600"}`}>
                <Package size={14} />
                {book.stock === 0 ? "Épuisé" : `${book.stock} en stock`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
