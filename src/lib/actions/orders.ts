"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notifyNewPayment } from "@/lib/notifications";

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

// ── Normalise un numéro de téléphone pour la comparaison ───────────────────
function normalizePhone(phone: string): string {
  return phone.replace(/[\s+\-()]/g, "");
}

// ── Confirme le paiement d'une commande (utilisé par API + agent WhatsApp) ──
export async function confirmOrderPayment(orderId: string, transactionRef: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) throw new Error("Commande introuvable.");

  if (["PAID", "SHIPPED", "DELIVERED"].includes(order.status)) {
    throw new Error("ALREADY_PAID");
  }
  if (order.status === "CANCELLED") throw new Error("CANCELLED");

  for (const item of order.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(
        `Stock insuffisant pour "${item.product.name}" (dispo: ${item.product.stock})`
      );
    }
  }

  const paidAt = new Date();

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID", transactionRef: transactionRef.trim(), paidAt },
      include: { items: { include: { product: true } } },
    });
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return updated;
  });

  revalidatePath("/commandes");
  revalidatePath("/stock/livres");
  revalidatePath("/dashboard");

  notifyNewPayment({
    orderId: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    paymentMethod: order.paymentMethod,
    transactionRef: transactionRef.trim(),
    total: order.total,
    items: updatedOrder.items,
    paidAt,
  }).catch((err) => console.error("[confirmOrderPayment] Notification error:", err));

  return { order: updatedOrder, paidAt };
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
