import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AbonnementsClient } from "./AbonnementsClient";
import Link from "next/link";
import { Bell } from "lucide-react";

const CATALOGUES = [
  { slug: "roman", label: "Livre Roman" },
  { slug: "developpement-personnel", label: "Livre Développement personnel" },
  { slug: "jeunesse", label: "Livre Jeunesse" },
  { slug: "bd-mangas", label: "Livre BD & Mangas" },
  { slug: "art", label: "Livre Art" },
  { slug: "fourniture", label: "Livre Fourniture" },
  { slug: "education", label: "Livre Éducation" },
  { slug: "livres-islamiques", label: "Livres islamiques" },
  { slug: "jeux-enfants", label: "Jeux pour enfants" },
  { slug: "autres", label: "Livre Autres" },
];

export default async function AbonnementsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-md text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-[#1e3a5f]/10 rounded-full p-4">
              <Bell className="w-10 h-10 text-[#1e3a5f]" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f] mb-2">Abonnements</h1>
          <p className="text-slate-500 text-sm mb-6">
            Connectez-vous pour vous abonner à vos rayons préférés et recevoir des notifications dès qu&apos;un nouveau livre arrive.
          </p>
          <Link href="/compte" className="inline-flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 px-7 rounded-xl transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscriptions: true },
  });

  const subscribedGenres = user?.subscriptions.map((s) => s.genre) ?? [];

  // Livres récents (7 derniers jours) dans les genres abonnés
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newBooks = subscribedGenres.length > 0
    ? await prisma.product.findMany({
        where: {
          type: "LIVRE",
          createdAt: { gte: sevenDaysAgo },
          OR: subscribedGenres.map((g) => ({ genre: { contains: g, mode: "insensitive" as const } })),
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
    : [];

  return (
    <AbonnementsClient
      catalogues={CATALOGUES}
      subscribedGenres={subscribedGenres}
      newBooks={newBooks.map((b) => ({
        id: b.id,
        title: b.name,
        author: b.author || "",
        price: b.sellPrice,
        imageUrl: b.imageUrl,
        genre: b.genre,
      }))}
      userName={session.user.name ?? ""}
    />
  );
}
