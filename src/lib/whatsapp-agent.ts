/**
 * Agent WhatsApp — machine à états pour la gestion des commandes
 *
 * États couverts :
 * 1. Message d'ordre (contient une réf. commande) → instructions de paiement
 * 2. Image (capture de paiement) ou texte = numéro de transaction → confirme paiement + livraison
 * 3. Tout autre message → assistant IA général (Groq)
 */

import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { confirmOrderPayment, findPendingOrderByPhone } from "@/lib/actions/orders";
import { sendTextMessage, delay } from "@/lib/whatsapp-api";
import { formatPrice } from "@/lib/formatPrice";

const WA_PHONE = "+22394664694";

// ── Extraire l'ID de commande du message WhatsApp ───────────────────────────
function extractOrderId(text: string): string | null {
  const match = text.match(/[Rr][eé]f\.?\s*commande\s*:?\s*([a-z0-9]+)/i);
  return match?.[1] ?? null;
}

// ── Détecter si le texte ressemble à un numéro de transaction Mobile Money ──
function isTransactionRef(text: string): boolean {
  // Orange Money: PP260623.XXXX.XXXX ou OMXXXXXX
  // Wave: TXN... / chiffres longs / références alphanumériques
  return (
    /\b(PP|OM|TXN|TF|WV|CI|BF|SN)[A-Z0-9.]{4,}/i.test(text) ||
    /\b\d{8,}\b/.test(text)
  );
}

// ── Dispatcher principal ────────────────────────────────────────────────────
export async function handleIncomingMessage(opts: {
  from: string;
  messageType: string;
  text: string;
  messageId: string;
  imageCaption?: string;
}): Promise<void> {
  const { from, messageType, text, messageId, imageCaption } = opts;
  const content = text || imageCaption || "";

  // 1. Message d'ordre venant de notre site
  const orderId = extractOrderId(content);
  if (orderId) {
    await handleOrderConfirmation(from, orderId);
    return;
  }

  // 2. Image = capture d'écran de paiement
  if (messageType === "image") {
    const txnRef = imageCaption?.trim() || `WA_IMG_${messageId}`;
    await handlePaymentProof(from, txnRef);
    return;
  }

  // 3. Texte = numéro de transaction Mobile Money
  if (messageType === "text" && isTransactionRef(content)) {
    await handlePaymentProof(from, content.trim());
    return;
  }

  // 4. Message général → assistant IA
  await handleGeneralMessage(from, content);
}

// ── Cas 1 : message d'ordre ─────────────────────────────────────────────────
async function handleOrderConfirmation(from: string, orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    await sendTextMessage(from, "⚠️ Référence de commande introuvable. Vérifiez le lien reçu ou contactez-nous.");
    return;
  }

  const statusMessages: Record<string, string> = {
    PAID: "✅ Votre commande a déjà été confirmée et payée.",
    SHIPPED: "🚚 Votre commande est en cours de livraison.",
    DELIVERED: "✅ Votre commande a déjà été livrée. Merci pour votre confiance !",
    CANCELLED: "❌ Cette commande a été annulée.",
  };

  if (order.status !== "PENDING") {
    await sendTextMessage(from, statusMessages[order.status] ?? `Statut : ${order.status}`);
    return;
  }

  const itemsList = order.items.map((i) => `• ${i.product.name} ×${i.quantity}`).join("\n");

  await sendTextMessage(
    from,
    `✅ *Commande validée !*\n\n${itemsList}\n\n💰 Total : *${formatPrice(order.total)}*\n\n` +
    `Merci d'envoyer cette somme via Mobile Money au numéro :\n\n` +
    `📱 *${WA_PHONE}*\n\n` +
    `Une fois le paiement effectué, renvoyez-nous la *capture d'écran* ou le *numéro de transaction*. 📸`
  );
}

// ── Cas 2 : preuve de paiement (image ou ref texte) ─────────────────────────
async function handlePaymentProof(from: string, txnRef: string): Promise<void> {
  const order = await findPendingOrderByPhone(from);

  if (!order) {
    await sendTextMessage(
      from,
      `⚠️ Aucune commande en attente pour ce numéro.\n\nSi vous avez une commande en cours, utilisez le lien reçu par SMS ou contactez-nous directement.`
    );
    return;
  }

  try {
    await confirmOrderPayment(order.id, txnRef);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "ALREADY_PAID") {
      await sendTextMessage(from, "ℹ️ Ce paiement a déjà été enregistré. Votre commande est confirmée ✅");
      return;
    }
    await sendTextMessage(from, `⚠️ ${msg}. Contactez-nous pour régulariser.`);
    return;
  }

  await sendTextMessage(from, "✅ *Transaction reçue !*\n\nVotre paiement a bien été enregistré et votre commande est confirmée. 🎉");

  await delay(2500);

  await sendTextMessage(
    from,
    `🚚 *Le livreur vous contactera dans peu de temps* pour organiser la livraison.\n\nMerci de votre confiance — *DAR ELHIKMA* 📚`
  );
}

// ── Cas 3 : question générale → Groq ────────────────────────────────────────
async function handleGeneralMessage(from: string, text: string): Promise<void> {
  if (!text.trim()) return;
  if (!process.env.GROQ_API_KEY) return;

  const products = await prisma.product.findMany({
    where: { type: "LIVRE", stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const catalog = products
    .map((p) => `• "${p.name}"${p.author ? ` — ${p.author}` : ""} | ${formatPrice(p.sellPrice)}`)
    .join("\n");

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          `Tu es l'assistant WhatsApp de la librairie DAR ELHIKMA à Bamako, Mali.\n` +
          `Réponds en français, de façon courte et directe (max 3 phrases).\n` +
          `N'utilise PAS de Markdown (pas de **, pas de #), car c'est WhatsApp.\n` +
          `Catalogue actuel :\n${catalog}`,
      },
      { role: "user", content: text },
    ],
    max_tokens: 250,
    temperature: 0.5,
  });

  const reply = completion.choices[0]?.message?.content ?? "Désolé, je n'ai pas pu traiter votre message.";
  await sendTextMessage(from, reply);
}
