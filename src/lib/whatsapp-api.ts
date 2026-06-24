/**
 * Helpers pour Meta WhatsApp Business Cloud API v19.0
 * Variables requises : WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN
 */

const WA_BASE = "https://graph.facebook.com/v19.0";

function getCredentials() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  };
}

export async function sendTextMessage(to: string, body: string): Promise<void> {
  const { phoneNumberId, accessToken } = getCredentials();
  if (!phoneNumberId || !accessToken) {
    console.warn("[WhatsApp] API non configurée (WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN manquants)");
    return;
  }
  const res = await fetch(`${WA_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[WhatsApp] sendTextMessage error:", JSON.stringify(err));
  }
}

export async function markAsRead(messageId: string): Promise<void> {
  const { phoneNumberId, accessToken } = getCredentials();
  if (!phoneNumberId || !accessToken) return;
  await fetch(`${WA_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  });
}

// Délai utilitaire pour espacer deux messages consécutifs
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
