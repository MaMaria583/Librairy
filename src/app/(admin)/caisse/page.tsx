import { getProducts } from "@/lib/actions/products";
import { POSClient } from "@/components/caisse/POSClient";

export const dynamic = "force-dynamic";

export default async function CaissePage() {
  const products = await getProducts();

  return <POSClient products={products} />;
}
