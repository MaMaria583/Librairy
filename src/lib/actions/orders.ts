"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) throw new Error("Commande introuvable.");

  if (status === "PAID" && order.status !== "PAID") {
    for (const item of order.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(
          `Stock insuffisant pour "${item.product.name}" (dispo: ${item.product.stock})`
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
        include: { items: { include: { product: true } } },
      });
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return updatedOrder;
    });

    revalidatePath("/commandes");
    revalidatePath("/stock/livres");
    revalidatePath("/dashboard");
    return updated;
  }

  if (status === "CANCELLED" && order.status === "PAID") {
    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
        include: { items: { include: { product: true } } },
      });
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return updatedOrder;
    });
    revalidatePath("/commandes");
    revalidatePath("/stock/livres");
    revalidatePath("/dashboard");
    return updated;
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } } },
  });
  revalidatePath("/commandes");
  return updated;
}

export async function getOrderStats() {
  const [pending, paid, shipped, delivered, cancelled] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
  ]);
  const revenue = await prisma.order.aggregate({
    where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    _sum: { total: true },
  });
  return { pending, paid, shipped, delivered, cancelled, revenue: revenue._sum.total ?? 0 };
}
