/**
 * Webhook UltraMsg — Réception des messages WhatsApp
 *
 * À configurer dans https://app.ultramsg.com → votre instance → Settings → Webhooks
 * URL : https://VOTRE_DOMAINE.vercel.app/api/whatsapp/ultramsg
 * Activer : "Webhook on Received"
 *
 * Variables requises : ULTRAMSG_INSTANCE_ID, ULTRAMSG_TOKEN
 */

import { NextRequest, NextResponse } from "next/server";
import { handleIncomingMessage } from "@/lib/whatsapp-agent";
import { normalizeWaPhone } from "@/lib/whatsapp-api";

// Payload UltraMsg pour un message reçu
interface UltraMsgPayload {
  event_type: string; // "message_received"
  instanceId: string;
  data: {
    id: string;
    from: string;        // ex: "22376000000@c.us"
    to: string;
    type: string;        // "chat" | "image" | "video" | "document" | "ptt"
    body: string;        // texte ou URL de média
    caption?: string;    // légende de l'image
    fromMe: boolean;
    time: number;        // timestamp Unix
    pushname?: string;   // nom WhatsApp de l'expéditeur
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = (await req.json()) as UltraMsgPayload;

    // Ignorer les messages envoyés par le bot lui-même
    if (payload.data?.fromMe) {
      return NextResponse.json({ status: "ok" });
    }

    // Uniquement traiter les messages reçus
    if (payload.event_type !== "message_received") {
      return NextResponse.json({ status: "ok" });
    }

    // Ignorer les messages trop anciens (> 90s pour UltraMsg)
    const ageSeconds = Math.floor(Date.now() / 1000) - payload.data.time;
    if (ageSeconds > 90) {
      return NextResponse.json({ status: "ok" });
    }

    const from = normalizeWaPhone(payload.data.from);
    const msgType = payload.data.type;

    // UltraMsg types → agent types
    // "chat" → "text"
    // "image" → "image" (body = URL, caption optionnel)
    const agentType = msgType === "chat" ? "text" : msgType;
    const text = msgType === "chat" ? payload.data.body : "";
    const imageCaption = msgType === "image" ? payload.data.caption : undefined;

    // Traitement asynchrone — répondre 200 immédiatement à UltraMsg
    handleIncomingMessage({
      from,
      messageType: agentType,
      text,
      messageId: payload.data.id,
      imageCaption,
    }).catch((err) => console.error("[UltraMsg Webhook] Agent error:", err));

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[UltraMsg Webhook] Parse error:", err);
    return NextResponse.json({ status: "ok" }); // Toujours 200 pour UltraMsg
  }
}
