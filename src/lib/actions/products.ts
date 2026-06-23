"use server";

import { prisma } from "@/lib/prisma";
import { ProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getProducts(type?: ProductType) {
  return prisma.product.findMany({
    where: type ? { type } : undefined,
    include: { supplier: true },
    orderBy: { name: "asc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { supplier: true },
  });
}

export async function getProductByBarcode(barcode: string) {
  return prisma.product.findFirst({
    where: {
      OR: [{ barcode }, { isbn: barcode }, { sku: barcode }],
    },
  });
}

export async function getLowStockProducts() {
  const products = await prisma.product.findMany({
    include: { supplier: true },
  });
  return products.filter((p) => p.stock <= p.alertThreshold);
}

export async function getDeadstockProducts(months = 3) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const soldProductIds = await prisma.saleItem.findMany({
    where: {
      sale: { createdAt: { gte: cutoffDate } },
    },
    select: { productId: true },
    distinct: ["productId"],
  });

  const soldIds = soldProductIds.map((s) => s.productId);

  return prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      id: { notIn: soldIds },
    },
    include: { supplier: true },
  });
}

export async function createProduct(data: {
  type: ProductType;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  alertThreshold?: number;
  barcode?: string;
  supplierId?: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  genre?: string;
  location?: string;
  description?: string;
  isNew?: boolean;
  isCollection?: boolean;
  brand?: string;
  category?: string;
  sku?: string;
}) {
  const product = await prisma.product.create({ data });
  revalidatePath("/stock/livres");
  revalidatePath("/stock/fournitures");
  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    buyPrice: number;
    sellPrice: number;
    stock: number;
    alertThreshold: number;
    barcode: string;
    supplierId: string;
    author: string;
    publisher: string;
    isbn: string;
    genre: string;
    location: string;
    description: string;
    isNew: boolean;
    isCollection: boolean;
    brand: string;
    category: string;
    sku: string;
  }>
) {
  const product = await prisma.product.update({ where: { id }, data });
  revalidatePath("/stock/livres");
  revalidatePath("/stock/fournitures");
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/stock/livres");
  revalidatePath("/stock/fournitures");
}

export async function getTopProducts(limit = 10) {
  const items = await prisma.saleItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true, subtotal: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const products = await Promise.all(
    items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      return {
        product,
        totalSold: item._sum.quantity ?? 0,
        totalRevenue: item._sum.subtotal ?? 0,
      };
    })
  );

  return products.filter((p) => p.product !== null);
}
