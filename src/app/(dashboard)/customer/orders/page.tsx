// app/(dashboard)/customer/orders/page.tsx
// Server Component - SEO Friendly

import { Metadata } from 'next';
import { OrdersList } from './components/OrdersList';

export const metadata: Metadata = {
  title: 'My Orders | TechStore',
  description: 'View and track all your orders',
};

export default async function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <OrdersList />
    </div>
  );
}