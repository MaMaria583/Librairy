import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status }: { status: OrderStatus } = await req.json();

    const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    }

    if (order.status === status) {
      return NextResponse.json({ error: "La commande est déjà dans ce statut." }, { status: 400 });
    }

    if (status === "PAID" && order.status !== "PAID") {
      // Vérification stock avant décrément
      for (const item of order.items) {
        if (item.product.stock < item.quantity) {
          return NextResponse.json(
            {
              error: `Stock insuffisant pour "${item.product.name}" (disponible : ${item.product.stock}, demandé : ${item.quantity})`,
            },
            { status: 409 }
          );
        }
      }

      // Transaction atomique : mise à jour statut + décrément stock
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
      revalidatePath("/stock/fournitures");
      revalidatePath("/dashboard");

      return NextResponse.json({ order: updated, stockDecremented: true });
    }

    if (status === "CANCELLED" && order.status === "PAID") {
      // Remettre le stock si on annule une commande déjà payée
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

      return NextResponse.json({ order: updated, stockRestored: true });
    }

    // Transition simple (ex: PAID → SHIPPED, SHIPPED → DELIVERED)
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });

    revalidatePath("/commandes");
    return NextResponse.json({ order: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("PATCH /api/orders/[id]/status error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
