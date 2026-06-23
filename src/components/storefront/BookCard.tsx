import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";

export interface BookProps {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string | null;
  genre?: string | null;
}

export function BookCard({ book, badge }: { book: BookProps; badge?: string }) {
  const imageSrc = book.imageUrl || `https://covers.openlibrary.org/b/isbn/${book.title}-L.jpg`;

  return (
    <Link
      href={`/livres/${book.id}`}
      className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
        {book.imageUrl ? (
          <Image
            src={imageSrc}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs font-medium text-center p-4">
            Couverture non disponible
          </div>
        )}
        {badge && (
          <span className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">{badge}</span>
        )}
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-[#1e3a5f]/0 group-hover:bg-[#1e3a5f]/10 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 text-left">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[#1e3a5f] transition-colors min-h-[2.5rem]">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2 truncate">{book.author || "Auteur inconnu"}</p>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="text-base font-bold text-[#c0392b]">
            {formatPrice(book.price)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {book.genre || "Livre"}
          </span>
        </div>
      </div>
    </Link>
  );
}
