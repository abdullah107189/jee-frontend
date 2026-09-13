import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import OrdersContent from "@/components/modules/admin/orders/OrdersContent";
import { getAdminOrderDetails, getAdminOrders } from "@/services/order.service";

export const metadata: Metadata = {
  title: "Orders | JEE Admin",
  description: "Manage all customer orders.",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  const details = await Promise.all(
    orders.map((order) => getAdminOrderDetails(order.id)),
  );
  const orderDetailsById = Object.fromEntries(
    details.map((order) => [order.id, order]),
  );

  return <OrdersContent orders={orders} orderDetailsById={orderDetailsById} />;
}
