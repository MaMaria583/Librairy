import { getProducts } from "@/lib/actions/products";
import { getSuppliers } from "@/lib/actions/suppliers";
import { ProductsTable } from "@/components/stock/ProductsTable";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FournituresPage() {
  const [products, suppliers] = await Promise.all([
    getProducts("FOURNITURE"),
    getSuppliers(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Catalogue Fournitures</h1>
          <p className="text-slate-500 text-sm">{products.length} article(s) en catalogue</p>
        </div>
      </div>

      <ProductsTable
        products={products}
        suppliers={suppliers}
        type="FOURNITURE"
      />
    </div>
  );
}
