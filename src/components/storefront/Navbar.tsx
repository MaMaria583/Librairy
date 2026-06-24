"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { totalItems, openDrawer } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  function navClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return active
      ? "text-white font-semibold border-b-2 border-white pb-0.5"
      : "text-white/75 hover:text-white transition-colors";
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement)?.value.trim();
    if (q) router.push(`/livres?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-[#1e3a5f] text-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/images/books/logo.jpg"
              alt="DAR ELHIKMA"
              width={130}
              height={52}
              className="object-contain"
              style={{ mixBlendMode: "screen" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={navClass("/")}>Accueil</Link>
            <Link href="/livres" className={navClass("/livres")}>Les livres</Link>
            <Link href="/fournitures" className={navClass("/fournitures")}>Les fournitures</Link>
            <Link href="/nouveautes" className={navClass("/nouveautes")}>Nouveautés</Link>
            <Link href="/collections" className={navClass("/collections")}>Collections</Link>
            <Link href="/abonnements" className={navClass("/abonnements")}>Abonnements</Link>
            <Link href="/suivi-commande" className={navClass("/suivi-commande")}>Suivi commande</Link>
          </nav>

          {/* Search + Icons */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs items-center bg-white/10 border border-white/20 rounded-full px-4 h-9 gap-2">
            <Search className="h-4 w-4 text-white/60 shrink-0" />
            <input
              name="q"
              type="search"
              placeholder="Trouver un livre, auteur, ISBN..."
              className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-full"
            />
          </form>

          <div className="flex items-center gap-3 shrink-0">
            {session?.user ? (
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold uppercase">
                    {session.user.name?.charAt(0) ?? "U"}
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                    <p className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100 truncate">{session.user.email}</p>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/compte" className="hidden lg:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
                <User className="h-5 w-5" />
                <span>Compte</span>
              </Link>
            )}
            <button onClick={openDrawer} className="relative flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:inline">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c0392b] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">{totalItems > 9 ? "9+" : totalItems}</span>
              )}
            </button>
            <button className="lg:hidden p-1.5" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#1e3a5f]">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2 text-sm font-medium">
            <Link href="/" className="py-2 text-white" onClick={() => setMobileOpen(false)}>Accueil</Link>
            <Link href="/livres" className="py-2 text-white/75" onClick={() => setMobileOpen(false)}>Nouveautés</Link>
            <Link href="/fournitures" className="py-2 text-white/75" onClick={() => setMobileOpen(false)}>Les fournitures</Link>
            <Link href="/livres?rayon=litterature" className="py-2 text-white/75" onClick={() => setMobileOpen(false)}>Collections</Link>
            <Link href="/livres?rayon=jeunesse" className="py-2 text-white/75" onClick={() => setMobileOpen(false)}>Abonnements</Link>
            <Link href="/suivi-commande" className="py-2 text-white/75" onClick={() => setMobileOpen(false)}>Suivi commande</Link>
          </nav>
        </div>
      )}
    </header>
    <CartDrawer />
    </>
  );
}
