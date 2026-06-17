import { getSuppliers } from "@/lib/actions/suppliers";
import { SuppliersClient } from "@/components/fournisseurs/SuppliersClient";
import { Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FournisseursPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fournisseurs</h1>
          <p className="text-slate-500 text-sm">{suppliers.length} fournisseur(s)</p>
        </div>
      </div>

      <SuppliersClient suppliers={suppliers} />
    </div>
  );
}
