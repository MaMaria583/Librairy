import Link from "next/link";
import { Search, ShoppingCart, User, Menu, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white text-xs py-2 text-center font-medium tracking-wide">
        Livraison gratuite à partir de 35€ d&apos;achat - Retrait gratuit en librairie
      </div>
      
      {/* Main Navbar */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-blue-800 tracking-tight">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="hidden sm:inline-block">LaLibrairie</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center relative">
            <input 
              type="search"
              placeholder="Rechercher par titre, auteur, ISBN..."
              className="w-full h-10 pl-4 pr-10 rounded-full border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 text-slate-500 hover:text-blue-600">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="md:hidden text-slate-600">
              <Search className="h-6 w-6" />
            </button>
            <Link href="/compte" className="flex flex-col items-center text-slate-600 hover:text-blue-600 transition-colors">
              <User className="h-6 w-6" />
              <span className="text-[10px] uppercase font-semibold mt-1 hidden sm:block">Compte</span>
            </Link>
            <Link href="/panier" className="flex flex-col items-center text-slate-600 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
              <span className="text-[10px] uppercase font-semibold mt-1 hidden sm:block">Panier</span>
            </Link>
          </div>
        </div>

        {/* Categories Nav */}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t text-sm font-semibold text-slate-700 overflow-x-auto">
          <button className="flex items-center gap-2 hover:text-blue-600 transition-colors shrink-0">
            <Menu className="h-5 w-5" />
            Tous les rayons
          </button>
          <Link href="/livres?rayon=litterature" className="hover:text-blue-600 transition-colors shrink-0">Littérature</Link>
          <Link href="/livres?rayon=bd-mangas" className="hover:text-blue-600 transition-colors shrink-0">BD, mangas</Link>
          <Link href="/livres?rayon=jeunesse" className="hover:text-blue-600 transition-colors shrink-0">Jeunesse</Link>
          <Link href="/livres?rayon=vie-pratique" className="hover:text-blue-600 transition-colors shrink-0">Vie pratique, bien-être</Link>
          <Link href="/livres?rayon=sciences-humaines" className="hover:text-blue-600 transition-colors shrink-0">Sciences humaines</Link>
        </nav>
      </div>
    </header>
  );
}
