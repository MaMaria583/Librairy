import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Filter, Package } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";
import type { Prisma } from "@prisma/client";

export const revalidate = 60;

const CATEGORIES = [
  { slug: "",            label: "Toutes les fournitures" },
  { slug: "scolaire",    label: "Fournitures scolaires" },
  { slug: "bureautique", label: "Fournitures bureautiques" },
  { slug: "autres",      label: "Autres fournitures" },
];

export default async function FournituresPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const whereClause: Prisma.ProductWhereInput = {
    type: "FOURNITURE",
    stock: { gt: 0 },
  };

  if (categorie) {
    whereClause.category = { contains: categorie, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24">
          <div className="bg-white/80 backdrop-blur-sm border border-sky-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-base flex items-center gap-2 mb-4 text-[#1e3a5f] border-b border-sky-100 pb-3">
              <Filter className="h-4 w-4" /> Filtrer par catégorie
            </h3>
            <ul className="space-y-1.5 text-sm">
              {CATEGORIES.map(({ slug, label }) => (
                <li key={slug}>
                  <Link
                    href={slug ? `/fournitures?categorie=${slug}` : "/fournitures"}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      (!slug && !categorie) || categorie === slug
                        ? "font-bold text-white bg-[#1e3a5f]"
                        : "text-slate-600 hover:bg-sky-50 hover:text-[#1e3a5f]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] mb-1">
            {categorie
              ? CATEGORIES.find((c) => c.slug === categorie)?.label ?? "Fournitures"
              : "Toutes les fournitures"}
          </h1>
          <p className="text-slate-500 text-sm">
            Fournitures scolaires, bureautiques et papeterie
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <p className="text-slate-500 text-sm mb-6">
              {products.length} produit{products.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-10 h-10 text-slate-200" />
                      </div>
                    )}
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
                        Nouveau
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-[11px] text-slate-400 truncate mb-1">{product.brand}</p>
                    )}
                    {product.category && (
                      <span className="text-[10px] uppercase tracking-wider text-sky-600 font-medium mb-2">
                        {product.category}
                      </span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-50">
                      <span className="text-base font-bold text-[#c0392b]">
                        {formatPrice(product.sellPrice)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="mt-2">
                      <AddToCartButton
                        id={product.id}
                        title={product.name}
                        author={product.brand ?? ""}
                        price={product.sellPrice}
                        imageUrl={product.imageUrl}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border border-dashed border-sky-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-lg text-slate-500 font-medium">
              Aucune fourniture dans cette catégorie pour l&apos;instant.
            </p>
            <Link href="/fournitures" className="mt-4 inline-block text-[#1e3a5f] hover:underline text-sm">
              Voir toutes les fournitures
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
