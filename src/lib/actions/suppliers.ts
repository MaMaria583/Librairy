"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSuppliers() {
  return prisma.supplier.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getSupplierById(id: string) {
  return prisma.supplier.findUnique({
    where: { id },
    include: { products: true },
  });
}

export async function createSupplier(data: {
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}) {
  const supplier = await prisma.supplier.create({ data });
  revalidatePath("/fournisseurs");
  return supplier;
}

export async function updateSupplier(
  id: string,
  data: Partial<{
    name: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
  }>
) {
  const supplier = await prisma.supplier.update({ where: { id }, data });
  revalidatePath("/fournisseurs");
  return supplier;
}

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({ where: { id } });
  revalidatePath("/fournisseurs");
}

export async function getReorderList() {
  const products = await prisma.product.findMany({
    include: { supplier: true },
  });

  return products
    .filter((p) => p.stock <= p.alertThreshold)
    .map((p) => ({
      product: p,
      supplier: p.supplier,
      suggestedQty: Math.max(p.alertThreshold * 3 - p.stock, 10),
    }));
}
