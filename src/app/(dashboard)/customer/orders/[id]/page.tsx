// app/(dashboard)/customer/orders/[id]/page.tsx
// Server Component - SEO Friendly

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderDetails } from "@/components/customer/orders/details/OrderDetails";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getCustomerOrderDetails } from "@/services/customer.service";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Order Details | JEE`,
    description: `View order details and tracking information`,
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const order = await getCustomerOrderDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb name={"product name"} />
      <OrderDetails order={order} />
    </div>
  );
}
