import type { Metadata } from "next";
import { AdminOrderDetails } from "@/components/modules/admin/orders/admin-order-details";
import { getAdminOrderDetails } from "@/services/order.service";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Manage Order #${id} | JEE Admin`,
    description: "Update order status and view customer purchase details",
  };
}

export default async function AdminOrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const order = await getAdminOrderDetails(id);

  return <AdminOrderDetails order={order} />;
}
