import type { Metadata } from "next";
import { OrderDetails } from "@/components/modules/customer/orders/details/OrderDetails";
import { getCustomerOrderDetails } from "@/services/order.service";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} | JEE Store`,
    description: "View order tracking, serial numbers and delivery details",
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const order = await getCustomerOrderDetails(id);

  return <OrderDetails order={order} />;
}
