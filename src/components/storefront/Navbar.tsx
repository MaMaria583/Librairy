import Link from "next/link";
import { Search, ShoppingCart, User, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-12">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl text-slate-900 tracking-tight shrink-0">
            <div className="relative flex items-center justify-center text-slate-800">
              <BookOpen className="h-9 w-9" />
              <div className="absolute inset-y-0 w-0.5 bg-blue-600 left-1/2 -translate-x-1/2 h-full z-10"></div>
            </div>
            <span className="hidden sm:inline-block tracking-widest text-slate-800 uppercase">Librium</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl hidden md:flex items-center relative">
            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
            <input 
              type="search"
              placeholder="Rechercher par titre, auteur, ISBN..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 shrink-0 text-slate-700">
            <button className="md:hidden hover:text-slate-900 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <Link href="/compte" className="hover:text-slate-900 transition-colors p-2">
              <User className="h-7 w-7" />
            </Link>
            <Link href="/panier" className="hover:text-slate-900 transition-colors relative p-2">
              <ShoppingCart className="h-7 w-7" />
              <span className="absolute top-1 right-0 bg-slate-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
