import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import NewSaleContent from '@/components/seller/sales/new/NewSaleContent';

export const metadata: Metadata = {
  title: 'New Offline Sale | TechStore',
  description: 'Search a unique product ID and issue an instant digital warranty.',
};

export default function NewSalePage() {
  return (
    <DashboardLayout allowedRole="seller">
      <NewSaleContent />
    </DashboardLayout>
  );
}