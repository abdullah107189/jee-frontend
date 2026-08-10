// app/(dashboard)/customer/orders/[id]/page.tsx
// Server Component - SEO Friendly

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OrderDetails } from './components/OrderDetails';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Order Details | TechStore`,
    description: `View order details and tracking information`,
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails orderId={params.id} />
    </div>
  );
}