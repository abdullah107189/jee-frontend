import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SellersContent from './components/SellersContent';

export const metadata: Metadata = {
  title: 'Sellers | TechStore Admin',
  description: 'Manage seller accounts and their status.',
};

export default function AdminSellersPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <SellersContent />
    </DashboardLayout>
  );
}