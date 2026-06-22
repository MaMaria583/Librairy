"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type RegisterResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Tous les champs sont obligatoires." };
  }

  if (password.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Un compte avec cet e-mail existe déjà." };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, password: hashed } });

  return { success: true };
}
