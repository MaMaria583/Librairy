import Link from "next/link";
import Image from "next/image";
import { Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/books/logo.jpg"
                alt="DAR ELHIKMA"
                width={160}
                height={50}
                className="object-contain"
                style={{ mixBlendMode: "screen" }}
              />
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
              <a href="https://www.facebook.com/profile.php?id=61578883261940" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@librairie_darelhikma" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-black hover:text-white transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
                </svg>
              </a>
              <a href="https://wa.me/22394664694" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.054 23.454a.75.75 0 0 0 .918.918l5.683-1.487A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.745 9.745 0 0 1-4.976-1.364l-.356-.212-3.695.968.984-3.595-.232-.371A9.745 9.745 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DAR ELHIKMA - Librairie &amp; Papeterie. Tous droits réservés.</p>
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
