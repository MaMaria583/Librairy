import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowLeft, Star, Package, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";
import { formatPrice } from "@/lib/formatPrice";

export default async function LivreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = await prisma.product.findUnique({
    where: { id, type: "LIVRE" },
    include: { supplier: true },
  });

  if (!book) notFound();

  const imageSrc = book.imageUrl || null;

  const similarBooks = await prisma.product.findMany({
    where: { type: "LIVRE", genre: book.genre ?? undefined, id: { not: book.id }, stock: { gt: 0 } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      {/* ── Hero dark section ─────────────────────────────────── */}
      <div className="bg-[#1a2a3a] text-white">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <Link
            href="/livres"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            Retour aux livres
          </Link>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-10">
            {/* Cover */}
            <div className="shrink-0 w-40 md:w-52 lg:w-60 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl bg-slate-800">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={book.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 240px"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-600">
                    <BookOpen size={48} />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 flex-1">
              {book.genre && (
                <span className="inline-block self-start text-xs font-semibold tracking-widest uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  {book.genre}
                </span>
              )}

              <h1 className="text-2xl lg:text-4xl font-extrabold leading-tight">
                {book.name}
              </h1>

              {book.author && (
                <p className="text-lg text-white/60">
                  par <span className="text-white/90 font-medium">{book.author}</span>
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-5 h-5 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"}`} />
                ))}
                <span className="text-sm text-white/40 ml-1">4.0 / 5.0</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  {formatPrice(book.sellPrice)}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${book.stock === 0 ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                  {book.stock === 0 ? "Épuisé" : "En stock"}
                </span>
              </div>

              {/* Action */}
              <div className="mt-2 flex flex-col gap-3">
                <AddToCartButton
                  id={book.id}
                  title={book.name}
                  author={book.author || ""}
                  price={book.sellPrice}
                  imageUrl={book.imageUrl}
                />

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Paiement sécurisé
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    <Zap className="w-3.5 h-3.5" /> Livraison rapide Mali
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
                    <MessageCircle className="w-3.5 h-3.5" /> Support WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content section ───────────────────────────────────── */}
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 pb-2 border-b border-slate-100">
              À propos du livre
            </h2>
            {book.description ? (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            ) : (
              <p className="text-slate-400 italic text-sm">
                Aucune description disponible pour ce livre.
              </p>
            )}
          </div>

          {/* Metadata */}
          <div>
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 pb-2 border-b border-slate-100">
              Informations
            </h2>
            <dl className="space-y-4 text-sm">
              {[
                { label: "Éditeur", value: book.publisher },
                { label: "ISBN", value: book.isbn, mono: true },
                { label: "Genre", value: book.genre },
                { label: "Emplacement", value: book.location },
                { label: "Fournisseur", value: book.supplier?.name },
                { label: "Stock", value: book.stock === 0 ? "Épuisé" : `${book.stock} exemplaire${book.stock > 1 ? "s" : ""}` },
              ].map(({ label, value, mono }) =>
                value ? (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</dt>
                    <dd className={`font-medium text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </div>
        </div>
      </div>
      {/* ── Vous aimerez aussi ──────────────────────────────── */}
      {similarBooks.length > 0 && (
        <div className="container mx-auto px-4 lg:px-8 pb-12 max-w-5xl">
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-5 pb-2 border-b border-slate-100">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarBooks.map((s) => (
              <Link key={s.id} href={`/livres/${s.id}`} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                <div className="relative aspect-[2/3] bg-slate-100 overflow-hidden">
                  {s.imageUrl ? (
                    <Image src={s.imageUrl} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="160px" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><BookOpen className="w-6 h-6 text-slate-300" /></div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-1">{s.name}</p>
                  <p className="text-xs font-bold text-[#1e3a5f]">{formatPrice(s.sellPrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
