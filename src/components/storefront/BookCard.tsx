import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export interface BookProps {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string | null;
  genre?: string | null;
}

export function BookCard({ book }: { book: BookProps }) {
  return (
    <Link href={`/livres/${book.id}`} className="group flex flex-col w-40 sm:w-48 shrink-0 bg-white border border-slate-100 rounded-lg p-3 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-50 flex items-center justify-center mb-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] rounded-md">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 160px, 192px"
          />
        ) : (
          <div className="text-slate-400 text-xs font-medium text-center p-2">
            Couverture non disponible
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 text-left">
        <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2 truncate">{book.author || "Auteur inconnu"}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-extrabold text-slate-900">
            {book.price.toFixed(2).replace('.', ',')} €
          </span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3 h-3 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
