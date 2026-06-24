/**
 * Webhook Green API — Réception des messages WhatsApp
 *
 * Plan GRATUIT disponible sur https://console.green-api.com
 *
 * Configuration dans Green API Console → votre instance → Settings :
 *   webhookUrl = https://VOTRE_DOMAINE.vercel.app/api/whatsapp/greenapi
 *   Activer : "Receive incoming messages and files"
 *
 * Variables requises : GREENAPI_INSTANCE_ID, GREENAPI_TOKEN
 * Variable optionnelle : GREENAPI_API_URL (auto-fournie par Green API console)
 */

import { NextRequest, NextResponse } from "next/server";
import { handleIncomingMessage } from "@/lib/whatsapp-agent";
import { normalizeWaPhone } from "@/lib/whatsapp-api";

// Payload Green API pour un message entrant
interface GreenApiPayload {
  typeWebhook: string;
  instanceData?: { idInstance: number; wid: string };
  timestamp: number;
  idMessage: string;
  senderData?: {
    chatId: string;   // ex: "22376000000@c.us"
    sender: string;
    senderName?: string;
  };
  messageData?: {
    typeMessage: string; // "textMessage" | "imageMessage" | "videoMessage" | "documentMessage"
    textMessageData?: { textMessage: string };
    fileMessageData?: {
      downloadUrl: string;
      caption?: string;
      mimeType?: string;
    };
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = (await req.json()) as GreenApiPayload;

    // Seulement traiter les messages entrants
    if (payload.typeWebhook !== "incomingMessageReceived") {
      return NextResponse.json({ status: "ok" });
    }

    if (!payload.senderData || !payload.messageData) {
      return NextResponse.json({ status: "ok" });
    }

    // Ignorer les messages trop anciens (> 90s)
    const ageSeconds = Math.floor(Date.now() / 1000) - payload.timestamp;
    if (ageSeconds > 90) {
      return NextResponse.json({ status: "ok" });
    }

    const from = normalizeWaPhone(payload.senderData.chatId);
    const msgTypeRaw = payload.messageData.typeMessage;

    // Mapper les types Green API → types de l'agent
    let agentType = "text";
    let text = "";
    let imageCaption: string | undefined;

    if (msgTypeRaw === "textMessage") {
      agentType = "text";
      text = payload.messageData.textMessageData?.textMessage ?? "";
    } else if (msgTypeRaw === "imageMessage") {
      agentType = "image";
      imageCaption = payload.messageData.fileMessageData?.caption;
    } else if (msgTypeRaw === "videoMessage" || msgTypeRaw === "documentMessage") {
      agentType = "document";
    } else {
      agentType = msgTypeRaw;
    }

    // Traitement asynchrone — répondre 200 immédiatement
    handleIncomingMessage({
      from,
      messageType: agentType,
      text,
      messageId: payload.idMessage,
      imageCaption,
    }).catch((err) => console.error("[GreenAPI Webhook] Agent error:", err));

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[GreenAPI Webhook] Parse error:", err);
    return NextResponse.json({ status: "ok" });
  }
}
