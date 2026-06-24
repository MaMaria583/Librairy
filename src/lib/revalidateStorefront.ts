import { revalidatePath } from "next/cache";

/**
 * Revalide toutes les pages publiques du site vitrine.
 * À appeler après chaque modification de stock (vente POS, commande payée,
 * ajout/modification/suppression d'un produit).
 */
export function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/livres");
  revalidatePath("/fournitures");
  revalidatePath("/nouveautes");
  revalidatePath("/collections");
}
