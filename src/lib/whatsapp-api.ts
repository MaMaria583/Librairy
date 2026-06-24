/**
 * WhatsApp API — Triple fournisseur
 *
 * WHATSAPP_PROVIDER=GREENAPI  → Green API (plan gratuit, numéro existant) ← RECOMMANDÉ
 * WHATSAPP_PROVIDER=ULTRAMSG  → UltraMsg  (essai 3 jours, numéro existant)
 * WHATSAPP_PROVIDER=META      → Meta Cloud API (nouveau numéro dédié requis)
 *
 * Variables Green API : GREENAPI_INSTANCE_ID, GREENAPI_TOKEN, GREENAPI_API_URL
 * Variables UltraMsg  : ULTRAMSG_INSTANCE_ID, ULTRAMSG_TOKEN
 * Variables Meta      : WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN
 */

// ── Détection du fournisseur actif ──────────────────────────────────────────
function getProvider(): "META" | "ULTRAMSG" | "GREENAPI" | null {
  const p = (process.env.WHATSAPP_PROVIDER ?? "").toUpperCase();
  if (p === "GREENAPI") return "GREENAPI";
  if (p === "ULTRAMSG") return "ULTRAMSG";
  if (p === "META") return "META";
  // Auto-détection si WHATSAPP_PROVIDER non défini
  if (process.env.GREENAPI_INSTANCE_ID && process.env.GREENAPI_TOKEN) return "GREENAPI";
  if (process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN) return "ULTRAMSG";
  if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) return "META";
  return null;
}

// ── Normalise le numéro cible ────────────────────────────────────────────────
// UltraMsg attend le numéro seul (ex: 22376000000), Meta aussi
export function normalizeWaPhone(raw: string): string {
  return raw.replace(/@c\.us$/, "").replace(/[\s+\-()]/g, "");
}

// ── Envoi texte ──────────────────────────────────────────────────────────────
export async function sendTextMessage(to: string, body: string): Promise<void> {
  const phone = normalizeWaPhone(to);
  const provider = getProvider();

  if (provider === "GREENAPI") {
    await greenApiSend("sendMessage", { chatId: `${phone}@c.us`, message: body });
    return;
  }

  if (provider === "ULTRAMSG") {
    await ultraMsgSend(`/messages/chat`, { to: phone, body, priority: "10" });
    return;
  }

  if (provider === "META") {
    await metaSend({ to: phone, type: "text", text: { preview_url: false, body } });
    return;
  }

  console.warn("[WhatsApp] Aucun fournisseur configuré. Définissez WHATSAPP_PROVIDER=GREENAPI | ULTRAMSG | META.");
}

// ── Indicateur de frappe ─────────────────────────────────────────────────────
// UltraMsg ne supporte pas nativement, on simule un délai
export async function sendTypingIndicator(to: string, messageId: string): Promise<void> {
  if (getProvider() !== "META") return; // UltraMsg : pas d'indicateur natif
  const { phoneNumberId, accessToken } = getMetaCredentials();
  if (!phoneNumberId || !accessToken) return;
  await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
      typing_indicator: { type: "text" },
    }),
  });
}

// ── Marquer comme lu ─────────────────────────────────────────────────────────
export async function markAsRead(messageId: string): Promise<void> {
  if (getProvider() !== "META") return;
  const { phoneNumberId, accessToken } = getMetaCredentials();
  if (!phoneNumberId || !accessToken) return;
  await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: messageId }),
  });
}

export interface ButtonCTA {
  id: string;
  title: string;
}

// ── Boutons interactifs ──────────────────────────────────────────────────────
// Meta  : vrais boutons cliquables
// UltraMsg : texte avec options numérotées (pas de support natif)
export async function sendInteractiveButtons(
  to: string,
  bodyText: string,
  buttons: ButtonCTA[]
): Promise<void> {
  const phone = normalizeWaPhone(to);
  const provider = getProvider();

  // Green API et UltraMsg : pas de boutons natifs → fallback texte numéroté
  if (provider === "GREENAPI" || provider === "ULTRAMSG") {
    const optionsList = buttons
      .slice(0, 3)
      .map((b, i) => `${i + 1}. ${b.title}`)
      .join("\n");
    const fullText = `${bodyText}\n\n${optionsList}\n\n_(Répondez avec le numéro de votre choix)_`;
    if (provider === "GREENAPI") {
      await greenApiSend("sendMessage", { chatId: `${phone}@c.us`, message: fullText });
    } else {
      await ultraMsgSend(`/messages/chat`, { to: phone, body: fullText, priority: "10" });
    }
    return;
  }

  if (provider === "META") {
    await metaSend({
      to: phone,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.slice(0, 3).map((btn) => ({
            type: "reply",
            reply: { id: btn.id, title: btn.title },
          })),
        },
      },
    });
    return;
  }

  console.warn("[WhatsApp] Aucun fournisseur configuré.");
}

// ── Délai utilitaire ─────────────────────────────────────────────────────────
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Internals : Meta ─────────────────────────────────────────────────────────
function getMetaCredentials() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  };
}

async function metaSend(payload: Record<string, unknown>): Promise<void> {
  const { phoneNumberId, accessToken } = getMetaCredentials();
  if (!phoneNumberId || !accessToken) {
    console.warn("[WhatsApp/Meta] WHATSAPP_PHONE_NUMBER_ID ou WHATSAPP_ACCESS_TOKEN manquant");
    return;
  }
  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", ...payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[WhatsApp/Meta] API error:", JSON.stringify(err));
  }
}

// ── Internals : Green API ────────────────────────────────────────────────────
async function greenApiSend(
  method: string,
  body: Record<string, unknown>
): Promise<void> {
  const idInstance = process.env.GREENAPI_INSTANCE_ID;
  const token = process.env.GREENAPI_TOKEN;
  const apiUrl = process.env.GREENAPI_API_URL ?? "https://api.green-api.com";
  if (!idInstance || !token) {
    console.warn("[WhatsApp/GreenAPI] GREENAPI_INSTANCE_ID ou GREENAPI_TOKEN manquant");
    return;
  }
  const res = await fetch(`${apiUrl}/waInstance${idInstance}/${method}/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[WhatsApp/GreenAPI] API error:", err);
  }
}

// ── Internals : UltraMsg ─────────────────────────────────────────────────────
async function ultraMsgSend(
  endpoint: string,
  params: Record<string, string>
): Promise<void> {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  if (!instanceId || !token) {
    console.warn("[WhatsApp/UltraMsg] ULTRAMSG_INSTANCE_ID ou ULTRAMSG_TOKEN manquant");
    return;
  }
  const form = new URLSearchParams({ token, ...params });
  const res = await fetch(`https://api.ultramsg.com/${instanceId}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("[WhatsApp/UltraMsg] API error:", err);
  }
}
