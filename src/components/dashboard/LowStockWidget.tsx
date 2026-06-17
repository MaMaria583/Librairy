import Link from "next/link";
import { AlertTriangle, BookOpen, Package } from "lucide-react";
import { Product } from "@prisma/client";

type Props = {
  products: Product[];
};

export function LowStockWidget({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
          <AlertTriangle className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-sm text-slate-500">Tous les stocks sont OK</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.slice(0, 6).map((product) => {
        const isOut = product.stock === 0;
        return (
          <div
            key={product.id}
            className="flex items-center justify-between gap-2 py-1.5"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  product.type === "LIVRE"
                    ? "bg-blue-50"
                    : "bg-amber-50"
                }`}
              >
                {product.type === "LIVRE" ? (
                  <BookOpen size={13} className="text-blue-500" />
                ) : (
                  <Package size={13} className="text-amber-500" />
                )}
              </div>
              <p className="text-xs text-slate-700 font-medium truncate">
                {product.name}
              </p>
            </div>
            <span
              className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                isOut
                  ? "bg-red-100 text-red-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {isOut ? "Épuisé" : `${product.stock} restant(s)`}
            </span>
          </div>
        );
      })}
      {products.length > 6 && (
        <Link
          href="/stock/alertes"
          className="block text-center text-xs text-blue-500 hover:underline pt-1"
        >
          +{products.length - 6} autres produits →
        </Link>
      )}
    </div>
  );
}
