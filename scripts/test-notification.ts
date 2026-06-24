/**
 * Test rapide : crée une commande, la confirme via API, vérifie l'email
 * Usage : npx tsx scripts/test-notification.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("📧 Test de la notification email...\n");

  const product = await prisma.product.findFirst({
    where: { type: "LIVRE", stock: { gt: 0 } },
  });
  if (!product) { console.error("❌ Aucun livre en stock."); return; }

  const order = await prisma.order.create({
    data: {
      customerName: "Test Notification",
      customerPhone: "+223 94 66 46 94",
      customerAddress: "Bamako, Badalabougou",
      paymentMethod: "Orange Money",
      total: product.sellPrice,
      items: {
        create: [{
          productId: product.id,
          quantity: 1,
          unitPrice: product.sellPrice,
          subtotal: product.sellPrice,
        }],
      },
    },
  });

  console.log(`✅ Commande créée : ${order.id}`);
  console.log(`   Livre : "${product.name}"\n`);

  const res = await fetch(`${BASE_URL}/api/confirm-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: order.id,
      transactionRef: "OM240624TEST12345",
    }),
  });

  const data = await res.json();

  if (res.ok) {
    console.log("✅ Paiement confirmé via API");
    console.log(`   Statut HTTP : ${res.status}`);
    console.log(`   Réponse :`, data);
    console.log("\n📧 Un email de notification a été envoyé à mariammariadembele@gmail.com");
    console.log("   Vérifiez votre boîte mail (aussi le dossier Spam).\n");
  } else {
    console.error("❌ Erreur API :", data.error);
  }

  await prisma.order.delete({ where: { id: order.id } });
  console.log("🧹 Commande test supprimée.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
