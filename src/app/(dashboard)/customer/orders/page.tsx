// app/(dashboard)/customer/orders/page.tsx
// Server Component - SEO Friendly

import { Metadata } from 'next';
import { OrdersList } from '@/components/customer/orders/OrdersList';
import { getCustomerOrders } from '@/services/customer.service';

export const metadata: Metadata = {
  title: 'My Orders | TechStore',
  description: 'View and track all your orders',
};

export default async function OrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <OrdersList orders={orders} />
    </div>
  );
}