import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import NewSaleContent from '@/components/modules/seller/sales/new/NewSaleContent';

export const metadata: Metadata = {
  title: 'New Offline Sale | JEE',
  description: 'Search a unique product ID and issue an instant digital warranty.',
};

export default function NewSalePage() {
  return (
      <NewSaleContent />
  );
}