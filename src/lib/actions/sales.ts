"use server";

import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { revalidateStorefront } from "@/lib/revalidateStorefront";

export type CartItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCostPrice: number;
  discount: number;
};

export async function createSale(data: {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  amountPaid: number;
  taxRate?: number;
  globalDiscount?: number;
  notes?: string;
}) {
  const { items, paymentMethod, amountPaid, taxRate = 0, globalDiscount = 0, notes } = data;

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (1 - item.discount / 100),
    0
  );
  const afterDiscount = subtotal * (1 - globalDiscount / 100);
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;
  const change = Math.max(0, amountPaid - total);

  const sale = await prisma.$transaction(async (tx) => {
    const newSale = await tx.sale.create({
      data: {
        total,
        subtotal,
        taxAmount,
        discount: globalDiscount,
        amountPaid,
        change,
        paymentMethod,
        notes,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unitCostPrice: item.unitCostPrice ?? 0,
            discount: item.discount,
            subtotal: item.quantity * item.unitPrice * (1 - item.discount / 100),
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newSale;
  });

  revalidatePath("/caisse");
  revalidatePath("/dashboard");
  revalidatePath("/ventes");
  revalidatePath("/stock/livres");
  revalidatePath("/stock/fournitures");
  revalidateStorefront();

  return sale;
}

export async function getSales(limit?: number) {
  return prisma.sale.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

export async function getDashboardStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todaySales, monthSales, totalProducts] = await Promise.all([
    prisma.sale.findMany({ where: { createdAt: { gte: startOfToday } } }),
    prisma.sale.findMany({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.product.count(),
  ]);

  const todayRevenue = todaySales.reduce((s, sale) => s + sale.total, 0);
  const monthRevenue = monthSales.reduce((s, sale) => s + sale.total, 0);

  const allSaleItems = await prisma.saleItem.findMany({
    where: { sale: { createdAt: { gte: startOfMonth } } },
    include: { product: true },
  });

  const monthCost = allSaleItems.reduce(
    (s, item) =>
      s + (item.unitCostPrice > 0 ? item.unitCostPrice : item.product.buyPrice) * item.quantity,
    0
  );
  const monthProfit = monthRevenue - monthCost;
  const profitMargin = monthRevenue > 0 ? (monthProfit / monthRevenue) * 100 : 0;

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const dailySalesRaw = await prisma.sale.findMany({
    where: { createdAt: { gte: last30Days } },
    orderBy: { createdAt: "asc" },
  });

  const dailySalesMap: Record<string, number> = {};
  for (const sale of dailySalesRaw) {
    const dateKey = new Date(sale.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
    dailySalesMap[dateKey] = (dailySalesMap[dateKey] ?? 0) + sale.total;
  }

  const chartData = Object.entries(dailySalesMap).map(([date, total]) => ({
    date,
    total: Math.round(total * 100) / 100,
  }));

  const allProducts = await prisma.product.findMany();
  const lowStockCount = allProducts.filter((p) => p.stock <= p.alertThreshold).length;

  return {
    todayRevenue,
    monthRevenue,
    monthProfit,
    profitMargin,
    todaySalesCount: todaySales.length,
    monthSalesCount: monthSales.length,
    totalProducts,
    lowStockCount,
    chartData,
  };
}

export async function getSalesChartData(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: startDate } },
    orderBy: { createdAt: "asc" },
  });

  const map: Record<string, number> = {};
  for (const sale of sales) {
    const key = new Date(sale.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
    map[key] = (map[key] ?? 0) + sale.total;
  }

  return Object.entries(map).map(([date, total]) => ({
    date,
    total: Math.round(total * 100) / 100,
  }));
}
