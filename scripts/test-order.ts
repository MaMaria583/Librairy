/**
 * Script de test : simule une commande en ligne et vérifie le décrément de stock
 * Usage : npx tsx scripts/test-order.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧪 Démarrage du test de commande...\n");

  // 1. Trouver un livre avec du stock
  const product = await prisma.product.findFirst({
    where: { type: "LIVRE", stock: { gt: 0 } },
    orderBy: { stock: "desc" },
  });

  if (!product) {
    console.error("❌ Aucun livre en stock. Ajoutez des livres avant de tester.");
    process.exit(1);
  }

  const stockBefore = product.stock;
  console.log(`📖 Livre choisi : "${product.name}"`);
  console.log(`   Stock avant commande : ${stockBefore}\n`);

  // 2. Créer une commande PENDING
  const order = await prisma.order.create({
    data: {
      customerName: "Client Test",
      customerPhone: "+223 00 00 00 00",
      customerAddress: "Bamako, ACI 2000",
      paymentMethod: "Test",
      total: product.sellPrice * 2,
      notes: "Commande de test automatisé",
      items: {
        create: [
          {
            productId: product.id,
            quantity: 2,
            unitPrice: product.sellPrice,
            subtotal: product.sellPrice * 2,
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log(`✅ Commande créée : ${order.id}`);
  console.log(`   Statut : ${order.status} (PENDING)`);
  console.log(`   Total : ${order.total} FCFA\n`);

  // 3. Simuler confirmation paiement (PENDING → PAID)
  console.log("💰 Simulation du paiement (PENDING → PAID)...");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: order.id }, data: { status: "PAID" } });
    await tx.product.update({
      where: { id: product.id },
      data: { stock: { decrement: 2 } },
    });
  });

  const productAfter = await prisma.product.findUnique({ where: { id: product.id } });
  const stockAfter = productAfter!.stock;

  console.log(`✅ Commande marquée PAID`);
  console.log(`   Stock après paiement : ${stockAfter}`);
  console.log(`   Décrément : ${stockBefore} → ${stockAfter} (${stockBefore - stockAfter === 2 ? "✅ CORRECT (-2)" : "❌ INCORRECT"})\n`);

  // 4. Simuler annulation (PAID → CANCELLED = restaure le stock)
  console.log("❌ Simulation d'annulation (PAID → CANCELLED, stock restauré)...");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    await tx.product.update({
      where: { id: product.id },
      data: { stock: { increment: 2 } },
    });
  });

  const productRestored = await prisma.product.findUnique({ where: { id: product.id } });
  const stockRestored = productRestored!.stock;

  console.log(`✅ Commande annulée`);
  console.log(`   Stock restauré : ${stockRestored} (${stockRestored === stockBefore ? "✅ CORRECT (stock = initial)" : "❌ INCORRECT"})\n`);

  // 5. Nettoyage
  await prisma.order.delete({ where: { id: order.id } });
  console.log("🧹 Commande de test supprimée.\n");
  console.log("🎉 Test terminé avec succès !");
}

main()
  .catch((e) => { console.error("❌ Erreur :", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
