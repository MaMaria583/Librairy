/**
 * Service de notifications — double canal :
 * 1. Email via Resend  (configurer : RESEND_API_KEY + NOTIFICATION_EMAIL)
 * 2. Webhook POST      (configurer : NOTIFICATION_WEBHOOK_URL)
 *    → compatible Make.com, Zapier, n8n, WhatsApp Business API
 */

import { Resend } from "resend";
import { formatPrice } from "./formatPrice";

interface OrderItem {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: { name: string };
}

interface NotifyPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  paymentMethod: string;
  transactionRef: string;
  total: number;
  items: OrderItem[];
  paidAt: Date;
}

function buildEmailHtml(p: NotifyPayload): string {
  const itemsRows = p.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${i.product.name}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:center">×${i.quantity}</td><td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice(i.subtotal)}</td></tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="fr">
<body style="font-family:sans-serif;background:#f8fafc;padding:24px;color:#1e293b">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#1e3a5f;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:20px">💰 Nouvelle commande payée</h1>
      <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">DAR ELHIKMA — Paiement confirmé</p>
    </div>
    <div style="padding:24px 32px;space-y:16px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:140px">Référence</td><td style="font-mono;font-weight:700;font-size:13px">${p.orderId.slice(0, 16).toUpperCase()}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Client</td><td style="font-size:13px;font-weight:600">${p.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Téléphone</td><td style="font-size:13px">${p.customerPhone}</td></tr>
        ${p.customerAddress ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Adresse</td><td style="font-size:13px">${p.customerAddress}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Mode de paiement</td><td style="font-size:13px">${p.paymentMethod}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">N° Transaction</td><td style="font-family:monospace;font-size:13px;color:#1e3a5f;font-weight:700">${p.transactionRef}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Payé le</td><td style="font-size:13px">${new Date(p.paidAt).toLocaleString("fr-FR")}</td></tr>
      </table>

      <h3 style="font-size:14px;font-weight:600;color:#1e293b;margin:0 0 8px">Articles commandés</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr style="background:#f8fafc"><th style="padding:8px 12px;text-align:left;font-weight:600">Article</th><th style="padding:8px 12px;text-align:center">Qté</th><th style="padding:8px 12px;text-align:right">Sous-total</th></tr></thead>
        <tbody>${itemsRows}</tbody>
        <tfoot><tr style="background:#1e3a5f;color:#fff"><td style="padding:10px 12px;font-weight:700" colspan="2">TOTAL</td><td style="padding:10px 12px;font-weight:700;text-align:right">${formatPrice(p.total)}</td></tr></tfoot>
      </table>

      <div style="margin-top:20px;padding:12px 16px;background:#d1fae5;border-radius:8px;font-size:13px;color:#065f46">
        ✅ Le stock a été décrémenté automatiquement.
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function notifyNewPayment(payload: NotifyPayload): Promise<void> {
  const errors: string[] = [];

  // ── Canal 1 : Email via Resend ──────────────────────────────────────────────
  // À CONFIGURER : RESEND_API_KEY dans .env (obtenir sur resend.com — gratuit)
  // À CONFIGURER : NOTIFICATION_EMAIL dans .env (ex: votre email librairie)
  if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        // À CONFIGURER : remplacez par votre domaine vérifié sur resend.com
        // En attendant, 'onboarding@resend.dev' fonctionne en mode test
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: process.env.NOTIFICATION_EMAIL,
        subject: `💰 Commande payée — ${payload.customerName} — ${formatPrice(payload.total)}`,
        html: buildEmailHtml(payload),
      });
    } catch (err) {
      errors.push(`Email: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // ── Canal 2 : Webhook (Make.com / Zapier / n8n / WhatsApp Business) ─────────
  // À CONFIGURER : NOTIFICATION_WEBHOOK_URL dans .env
  // Ex Make.com : https://hook.eu2.make.com/xxxxxxxxxxxxxxxxxxxx
  if (process.env.NOTIFICATION_WEBHOOK_URL) {
    try {
      await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "order.paid",
          orderId: payload.orderId,
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          customerAddress: payload.customerAddress ?? "",
          paymentMethod: payload.paymentMethod,
          transactionRef: payload.transactionRef,
          total: payload.total,
          currency: "FCFA",
          paidAt: payload.paidAt.toISOString(),
          items: payload.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            subtotal: i.subtotal,
          })),
        }),
      });
    } catch (err) {
      errors.push(`Webhook: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length > 0) {
    console.warn("[notifications] Erreurs :", errors.join(" | "));
  }
}
