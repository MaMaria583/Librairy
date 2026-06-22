"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function toggleSubscription(genre: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non connecté" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "Utilisateur introuvable" };

  const existing = await prisma.userSubscription.findUnique({
    where: { userId_genre: { userId: user.id, genre } },
  });

  if (existing) {
    await prisma.userSubscription.delete({ where: { id: existing.id } });
    return { subscribed: false };
  } else {
    await prisma.userSubscription.create({ data: { userId: user.id, genre } });
    return { subscribed: true };
  }
}

export async function getSubscriptions(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscriptions: true },
  });
  return user?.subscriptions.map((s) => s.genre) ?? [];
}
