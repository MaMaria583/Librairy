import { getOrders, getOrderStats } from "@/lib/actions/orders";
import { OrdersClient } from "@/components/admin/OrdersClient";

export const dynamic = "force-dynamic";

export default async function CommandesPage() {
  const [orders, stats] = await Promise.all([getOrders(), getOrderStats()]);
  return <OrdersClient orders={orders} stats={stats} />;
}
