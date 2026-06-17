import { getSales } from "@/lib/actions/sales";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, CreditCard, Banknote, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const paymentIcons = {
  ESPECES: Banknote,
  CARTE: CreditCard,
  CHEQUE: FileText,
};

const paymentLabels = {
  ESPECES: "Espèces",
  CARTE: "Carte",
  CHEQUE: "Chèque",
};

export default async function VentesPage() {
  const sales = await getSales(100);

  const total = sales.reduce((s, v) => s + v.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Historique des Ventes</h1>
            <p className="text-slate-500 text-sm">
              {sales.length} vente(s) · Total : {formatCurrency(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Date</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Articles</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Paiement</th>
                <th className="text-right px-4 py-3 text-xs text-slate-500 font-semibold">Remise</th>
                <th className="text-right px-4 py-3 text-xs text-slate-500 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    Aucune vente enregistrée
                  </td>
                </tr>
              ) : (
                sales.map((sale) => {
                  const Icon = paymentIcons[sale.paymentMethod];
                  return (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                        {formatDate(sale.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {sale.items.map((item) => (
                            <p key={item.id} className="text-xs text-slate-600">
                              {item.quantity}× {item.product.name}
                              {item.discount > 0 && (
                                <span className="text-orange-500 ml-1">(-{item.discount}%)</span>
                              )}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Icon size={13} className="text-slate-400" />
                          {paymentLabels[sale.paymentMethod]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-500">
                        {sale.discount > 0 ? `-${sale.discount}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {formatCurrency(sale.total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
