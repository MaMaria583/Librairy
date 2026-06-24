import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizePhone(raw: string): string {
  return raw.replace(/[\s+\-().]/g, "").replace(/^00/, "");
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone?.trim()) {
    return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);

  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: { include: { product: true } } },
  });

  const matched = allOrders.filter(
    (o) => normalizePhone(o.customerPhone) === normalized
  );

  if (matched.length === 0) {
    return NextResponse.json({ orders: [] });
  }

  return NextResponse.json({ orders: matched });
}
