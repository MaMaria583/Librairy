import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de DAR ELHIKMA, une librairie et papeterie en ligne basée au Mali (Bamako).
Ton rôle est d'aider les clients avec :
- Trouver des livres (romans, BD, mangas, développement personnel, livres islamiques, jeunesse, art, éducation)
- Informations sur les prix en FCFA
- Modes de paiement : Orange Money, Moov Money, espèces à la livraison
- Livraison au Mali (Bamako et autres villes)
- Conseils de lecture selon les goûts du client
- Questions sur les commandes et le stock

Informations clés :
- Numéro WhatsApp : +223 94 66 46 94
- Page Facebook : https://www.facebook.com/profile.php?id=61578883261940
- TikTok : @librairie_darelhi
- Horaires : Lun-Sam 8h-20h, Dim 9h-17h

Règles :
- Réponds toujours en français, de façon courte et amicale.
- Si tu ne sais pas le prix exact d'un livre, invite le client à contacter via WhatsApp.
- Pour les commandes complexes, redirige vers WhatsApp.
- N'invente pas de prix ou de stocks.
- Utilise des emojis avec modération pour rendre la conversation agréable.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "Désolé, je n'ai pas pu répondre.";
    return NextResponse.json({ reply });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
