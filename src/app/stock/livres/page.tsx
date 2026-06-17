import { getProducts } from "@/lib/actions/products";
import { getSuppliers } from "@/lib/actions/suppliers";
import { ProductsTable } from "@/components/stock/ProductsTable";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LivresPage() {
  const [products, suppliers] = await Promise.all([
    getProducts("LIVRE"),
    getSuppliers(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Catalogue Livres</h1>
            <p className="text-slate-500 text-sm">{products.length} livre(s) en catalogue</p>
          </div>
        </div>
      </div>

      <ProductsTable
        products={products}
        suppliers={suppliers}
        type="LIVRE"
      />
    </div>
  );
}
