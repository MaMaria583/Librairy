/**
 * Webhook Meta WhatsApp Business Cloud API
 *
 * GET  → Vérification du webhook (challenge handshake Meta)
 * POST → Réception des messages entrants
 *
 * Variables requises :
 *   WHATSAPP_VERIFY_TOKEN  — chaîne aléatoire choisie par vous (ex: darelhikma_wh_2024)
 *   WHATSAPP_ACCESS_TOKEN  — token Meta (permanent token depuis Meta Developer Console)
 *   WHATSAPP_PHONE_NUMBER_ID — ID numéro dans Meta Developer Console
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { handleIncomingMessage } from "@/lib/whatsapp-agent";
import { markAsRead } from "@/lib/whatsapp-api";

// ── Vérification du webhook par Meta ────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp Webhook] ✅ Webhook vérifié avec succès");
    return new Response(challenge, { status: 200 });
  }

  console.warn("[WhatsApp Webhook] ❌ Vérification échouée — token invalide");
  return new Response("Forbidden", { status: 403 });
}

// ── Réception des messages ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // ── Vérification HMAC-SHA256 (technique de Jasper's Market) ─────────────
    // WHATSAPP_APP_SECRET = App Secret de votre app Meta Developer Console
    // Protège contre les faux appels non issus de Meta
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (appSecret) {
      const signature = req.headers.get("x-hub-signature-256") ?? "";
      const expectedHash = createHmac("sha256", appSecret).update(rawBody).digest("hex");
      if (signature !== `sha256=${expectedHash}`) {
        console.warn("[WhatsApp Webhook] ❌ Signature invalide — rejeté");
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);

    // Meta exige une réponse 200 immédiate — traitement asynchrone
    processWebhook(body).catch((err) =>
      console.error("[WhatsApp Webhook] processWebhook error:", err)
    );

    return NextResponse.json({ status: "ok" });
  } catch {
    // Toujours retourner 200 à Meta pour éviter les relivraisons
    return NextResponse.json({ status: "ok" });
  }
}

// ── Traitement asynchrone du payload Meta ───────────────────────────────────
async function processWebhook(body: unknown): Promise<void> {
  const data = body as {
    object?: string;
    entry?: Array<{
      changes?: Array<{
        field?: string;
        value?: {
          messages?: Array<{
            from: string;
            id: string;
            type: string;
            timestamp: string;
            text?: { body: string };
            image?: { caption?: string; id: string; mime_type: string };
            interactive?: {
              type: string;
              button_reply?: { id: string; title: string };
            };
          }>;
        };
      }>;
    }>;
  };

  if (data.object !== "whatsapp_business_account") return;

  for (const entry of data.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;

      for (const msg of change.value?.messages ?? []) {
        // Ignorer les messages trop anciens (> 60s) pour éviter les retraitements
        const ageSeconds = Math.floor(Date.now() / 1000) - parseInt(msg.timestamp);
        if (ageSeconds > 60) continue;

        // Marquer comme lu (le typing indicator dans l'agent gère le cas interactif)
        markAsRead(msg.id).catch(() => {});

        // Extraire le contenu selon le type
        let msgText = msg.text?.body ?? "";
        if (msg.type === "interactive" && msg.interactive?.button_reply) {
          msgText = msg.interactive.button_reply.id;
        }

        await handleIncomingMessage({
          from: msg.from,
          messageType: msg.type,
          text: msgText,
          messageId: msg.id,
          imageCaption: msg.image?.caption,
        });
      }
    }
  }
}
