"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Search, Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/books/logo.png"
              alt="DAR ELHIKMA - Librairie et Papeterie"
              width={180}
              height={56}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-green-500 font-semibold">Accueil</Link>
            <Link href="/livres" className="text-slate-600 hover:text-slate-900 transition-colors">Nouveautés</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
                Collections <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <Link href="/livres?rayon=jeunesse" className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
              Rayons <ChevronDown className="h-4 w-4" />
            </Link>
            <Link href="/boutique" className="text-slate-600 hover:text-slate-900 transition-colors">Boutique</Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
          </nav>

          {/* Right: Search + Mobile */}
          <div className="flex items-center gap-3">
            {searchOpen && (
              <input
                autoFocus
                type="search"
                placeholder="Rechercher..."
                className="hidden md:block h-9 px-4 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-52"
                onBlur={() => setSearchOpen(false)}
              />
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="lg:hidden p-2 text-slate-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
            <Link href="/" className="py-2 text-green-500 font-semibold" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link href="/livres" className="py-2 hover:text-slate-900" onClick={() => setMobileOpen(false)}>Nouveautés</Link>
            <Link href="/livres?rayon=litterature" className="py-2 hover:text-slate-900" onClick={() => setMobileOpen(false)}>Collections</Link>
            <Link href="/livres?rayon=jeunesse" className="py-2 hover:text-slate-900" onClick={() => setMobileOpen(false)}>Rayons</Link>
            <Link href="/contact" className="py-2 hover:text-slate-900" onClick={() => setMobileOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
