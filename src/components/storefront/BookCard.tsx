import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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
    <div className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link href={`/livres/${book.id}`} className="relative aspect-[2/3] overflow-hidden bg-slate-100 flex items-center justify-center">
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-slate-400 font-medium text-center p-4">
            Couverture non disponible
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-blue-600 shadow-sm">
          {book.genre || "Livre"}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/livres/${book.id}`} className="flex-1">
          <h3 className="font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{book.author || "Auteur inconnu"}</p>
        </Link>
        
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-extrabold text-slate-900">
            {book.price.toFixed(2).replace('.', ',')} €
          </span>
          <button className="bg-slate-100 text-blue-600 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors" title="Ajouter au panier">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
