"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, User, BookOpen, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100">
      {/* Top bar */}
      <div className="bg-slate-50 text-xs text-slate-500 py-1.5">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <span>Livraison gratuite dès 35 € d&apos;achat</span>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/contact" className="hover:text-slate-800 transition-colors">Aide & Contact</Link>
            <Link href="/magasins" className="hover:text-slate-800 transition-colors">Nos magasins</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2 text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-[#1e3a5f]" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[10px] tracking-[0.2em] text-slate-400 font-medium uppercase">Librairie</span>
              <span className="text-lg font-bold text-[#1e3a5f] tracking-wide uppercase">L&apos;Harmonie</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-[#1e3a5f] transition-colors">Accueil</Link>
            <Link href="/livres" className="hover:text-[#1e3a5f] transition-colors">Nouveautés</Link>
            <Link href="/livres?rayon=litterature" className="hover:text-[#1e3a5f] transition-colors">Collections</Link>
            <Link href="/contact" className="hover:text-[#1e3a5f] transition-colors">Événements</Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:flex items-center relative">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Chercher un livre, auteur, ISBN..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] text-sm transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0 text-slate-700">
            <button className="md:hidden p-2 hover:text-[#1e3a5f] transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/compte" className="flex items-center gap-1.5 hover:text-[#1e3a5f] transition-colors p-2">
              <User className="h-5 w-5" />
              <span className="hidden lg:inline text-sm font-medium">Compte</span>
            </Link>
            <Link href="/panier" className="flex items-center gap-1.5 hover:text-[#1e3a5f] transition-colors relative p-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:inline text-sm font-medium">Panier</span>
              <span className="absolute -top-0.5 -right-0.5 bg-[#c0392b] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
            <Link href="/" className="py-2 hover:text-[#1e3a5f]" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link href="/livres" className="py-2 hover:text-[#1e3a5f]" onClick={() => setMobileOpen(false)}>Nouveautés</Link>
            <Link href="/livres?rayon=litterature" className="py-2 hover:text-[#1e3a5f]" onClick={() => setMobileOpen(false)}>Collections</Link>
            <Link href="/contact" className="py-2 hover:text-[#1e3a5f]" onClick={() => setMobileOpen(false)}>Événements</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
