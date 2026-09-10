import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import OrdersContent from './components/OrdersContent';

export const metadata: Metadata = {
  title: 'Orders | TechStore Admin',
  description: 'Manage all customer orders.',
};

export default function AdminOrdersPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <OrdersContent />
    </DashboardLayout>
  );
}