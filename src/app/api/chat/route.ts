import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount) + " FCFA";
}

function buildSystemPrompt(bookContext: string) {
  return `Tu es l'assistant virtuel de DAR ELHIKMA, une librairie et papeterie en ligne basée au Mali (Bamako).

RÈGLES ABSOLUES :
- Tu ne dois JAMAIS inventer un prix, un auteur, un titre ou un statut de stock.
- Si un livre n'est PAS dans la liste ci-dessous, dis honnêtement que tu ne le trouves pas dans le catalogue et propose de contacter WhatsApp.
- Utilise UNIQUEMENT les données du catalogue fourni pour répondre aux questions sur les livres.
- Réponds toujours en français, de façon courte et amicale.
- Utilise des emojis avec modération.

INFORMATIONS LIBRAIRIE :
- WhatsApp : +223 94 66 46 94
- Facebook : https://www.facebook.com/profile.php?id=61578883261940
- TikTok : @librairie_darelhi
- Horaires : Lun-Sam 8h-20h, Dim 9h-17h
- Paiement : Orange Money, Moov Money, espèces à la livraison
- Livraison : Bamako et autres villes du Mali

${bookContext}`;
}

function extractKeywords(messages: { role: string; content: string }[]) {
  const last3 = messages.slice(-3).map((m) => m.content).join(" ");
  return last3.replace(/[?!.,;:]/g, " ").trim();
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    const keywords = extractKeywords(messages);
    const words = keywords.split(/\s+/).filter((w) => w.length > 2);

    const books = await prisma.product.findMany({
      where: {
        type: "LIVRE",
        OR: words.flatMap((word) => [
          { name: { contains: word, mode: "insensitive" } },
          { author: { contains: word, mode: "insensitive" } },
          { genre: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
        ]),
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    let bookContext: string;
    if (books.length > 0) {
      bookContext =
        "CATALOGUE TROUVÉ (utilise uniquement ces données) :\n" +
        books
          .map(
            (b) =>
              `• "${b.name}"${b.author ? ` — ${b.author}` : ""}${b.genre ? ` | Genre: ${b.genre}` : ""} | Prix: ${formatFCFA(b.sellPrice)} | ${b.stock > 0 ? `En stock (${b.stock} ex.)` : "❌ Épuisé"}`
          )
          .join("\n");
    } else {
      const sample = await prisma.product.findMany({
        where: { type: "LIVRE", stock: { gt: 0 } },
        orderBy: { createdAt: "desc" },
        take: 6,
      });
      bookContext =
        "Aucun livre trouvé pour cette recherche dans notre catalogue.\n" +
        "Si le client cherche un livre précis, dis-lui qu'il n'est pas disponible et propose WhatsApp.\n" +
        "Voici quelques livres disponibles en ce moment :\n" +
        sample
          .map(
            (b) =>
              `• "${b.name}"${b.author ? ` — ${b.author}` : ""}${b.genre ? ` | ${b.genre}` : ""} | ${formatFCFA(b.sellPrice)}`
          )
          .join("\n");
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: buildSystemPrompt(bookContext) },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.5,
    });

    const reply =
      completion.choices[0]?.message?.content ?? "Désolé, je n'ai pas pu répondre.";
    return NextResponse.json({ reply });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
