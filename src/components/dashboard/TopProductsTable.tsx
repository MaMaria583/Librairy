import { BookOpen, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@prisma/client";

type TopProduct = {
  product: Product | null;
  totalSold: number;
  totalRevenue: number;
};

type Props = {
  products: TopProduct[];
};

export function TopProductsTable({ products }: Props) {
  if (products.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-6">
        Aucune vente enregistrée
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs text-slate-500 font-medium pb-2">#</th>
            <th className="text-left text-xs text-slate-500 font-medium pb-2">Produit</th>
            <th className="text-left text-xs text-slate-500 font-medium pb-2">Type</th>
            <th className="text-right text-xs text-slate-500 font-medium pb-2">Qté vendue</th>
            <th className="text-right text-xs text-slate-500 font-medium pb-2">CA généré</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map(({ product, totalSold, totalRevenue }, index) => (
            <tr key={product?.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-2.5 text-slate-400 font-mono text-xs">{index + 1}</td>
              <td className="py-2.5">
                <p className="font-medium text-slate-700 truncate max-w-[200px]">
                  {product?.name}
                </p>
                {product?.author && (
                  <p className="text-xs text-slate-400">{product.author}</p>
                )}
              </td>
              <td className="py-2.5">
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                    product?.type === "LIVRE"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {product?.type === "LIVRE" ? (
                    <BookOpen size={11} />
                  ) : (
                    <Package size={11} />
                  )}
                  {product?.type === "LIVRE" ? "Livre" : "Fourniture"}
                </span>
              </td>
              <td className="py-2.5 text-right font-semibold text-slate-700">
                {totalSold}
              </td>
              <td className="py-2.5 text-right font-semibold text-emerald-600">
                {formatCurrency(totalRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
