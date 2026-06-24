import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewPayment } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const { orderId, transactionRef } = await req.json();

    if (!orderId?.trim() || !transactionRef?.trim()) {
      return NextResponse.json(
        { error: "L'ID de commande et le numéro de transaction sont obligatoires." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId.trim() },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable. Vérifiez votre référence." },
        { status: 404 }
      );
    }

    if (order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED") {
      return NextResponse.json(
        { error: "Cette commande a déjà été validée.", alreadyPaid: true },
        { status: 409 }
      );
    }

    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cette commande a été annulée et ne peut plus être confirmée." },
        { status: 409 }
      );
    }

    // Vérification du stock avant de committer
    for (const item of order.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuffisant pour "${item.product.name}" (disponible : ${item.product.stock}, commandé : ${item.quantity}). Contactez-nous via WhatsApp.`,
          },
          { status: 409 }
        );
      }
    }

    const paidAt = new Date();

    // Transaction atomique : statut PAID + enregistrement ref + décrément stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          transactionRef: transactionRef.trim(),
          paidAt,
        },
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

    // Notification asynchrone (ne bloque pas la réponse)
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
    }).catch((err) => console.error("[confirm-payment] Notification error:", err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      customerName: order.customerName,
      total: order.total,
      paidAt: paidAt.toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/confirm-payment error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
