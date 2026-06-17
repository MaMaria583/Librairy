import Link from "next/link";
import { BookOpen, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white tracking-tight">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span>LaLibrairie</span>
            </Link>
            <p className="text-sm text-slate-400">
              Votre librairie en ligne de confiance. Découvrez des milliers de références de livres, BD, mangas, et plus encore.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Acheter</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/livres" className="hover:text-white transition-colors">Tous les livres</Link></li>
              <li><Link href="/livres?rayon=litterature" className="hover:text-white transition-colors">Littérature</Link></li>
              <li><Link href="/livres?rayon=bd" className="hover:text-white transition-colors">BD & Mangas</Link></li>
              <li><Link href="/livres?rayon=jeunesse" className="hover:text-white transition-colors">Jeunesse</Link></li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">La Librairie</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos de nous</Link></li>
              <li><Link href="/magasins" className="hover:text-white transition-colors">Nos magasins</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Suivez-nous</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-400 hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LaLibrairie. Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/cgv" className="hover:text-slate-300 transition-colors">CGV</Link>
            <Link href="/confidentialite" className="hover:text-slate-300 transition-colors">Politique de confidentialité</Link>
            <Link href="/mentions-legales" className="hover:text-slate-300 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
