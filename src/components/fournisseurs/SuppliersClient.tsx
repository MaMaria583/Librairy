"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Supplier } from "@prisma/client";
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Package } from "lucide-react";
import { createSupplier, updateSupplier, deleteSupplier } from "@/lib/actions/suppliers";

type SupplierWithCount = Supplier & { _count: { products: number } };

type Props = {
  suppliers: SupplierWithCount[];
};

const emptyForm = { name: "", contact: "", phone: "", email: "", address: "", notes: "" };

export function SuppliersClient({ suppliers }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<SupplierWithCount | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditSupplier(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: SupplierWithCount) => {
    setEditSupplier(s);
    setForm({ name: s.name, contact: s.contact ?? "", phone: s.phone ?? "", email: s.email ?? "", address: s.address ?? "", notes: s.notes ?? "" });
    setShowModal(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        name: form.name,
        contact: form.contact || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        notes: form.notes || undefined,
      };
      if (editSupplier) {
        await updateSupplier(editSupplier.id, data);
      } else {
        await createSupplier(data);
      }
      setShowModal(false);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce fournisseur ?")) return;
    startTransition(() => deleteSupplier(id));
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Ajouter un fournisseur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{s.name}</h3>
                {s.contact && <p className="text-xs text-slate-500 mt-0.5">{s.contact}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {s.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone size={12} className="text-slate-400 shrink-0" />
                  {s.phone}
                </div>
              )}
              {s.email && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  {s.email}
                </div>
              )}
              {s.address && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  {s.address}
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Package size={12} />
                {s._count.products} produit(s) associé(s)
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editSupplier ? "Modifier" : "Ajouter"} un fournisseur
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              <div><label className={labelCls}>Nom *</label><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
              <div><label className={labelCls}>Contact</label><input className={inputCls} value={form.contact} onChange={(e) => set("contact", e.target.value)} /></div>
              <div><label className={labelCls}>Téléphone</label><input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div><label className={labelCls}>Adresse</label><input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div><label className={labelCls}>Notes</label><textarea className={inputCls} rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-sm border border-slate-200 text-slate-600 py-2 rounded-lg hover:bg-slate-50">Annuler</button>
                <button type="submit" disabled={isPending} className="flex-1 text-sm bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium disabled:opacity-60">
                  {isPending ? "En cours…" : editSupplier ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
