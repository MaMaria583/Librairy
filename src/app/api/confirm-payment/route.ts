import { NextRequest, NextResponse } from "next/server";
import { confirmOrderPayment } from "@/lib/actions/orders";

export async function POST(req: NextRequest) {
  try {
    const { orderId, transactionRef } = await req.json();

    if (!orderId?.trim() || !transactionRef?.trim()) {
      return NextResponse.json(
        { error: "L'ID de commande et le numéro de transaction sont obligatoires." },
        { status: 400 }
      );
    }

    const { order, paidAt } = await confirmOrderPayment(orderId.trim(), transactionRef.trim());

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

    if (msg === "ALREADY_PAID") {
      return NextResponse.json({ error: "Cette commande a déjà été validée.", alreadyPaid: true }, { status: 409 });
    }
    if (msg === "CANCELLED") {
      return NextResponse.json({ error: "Cette commande a été annulée et ne peut plus être confirmée." }, { status: 409 });
    }
    if (msg === "Commande introuvable.") {
      return NextResponse.json({ error: "Commande introuvable. Vérifiez votre référence." }, { status: 404 });
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
