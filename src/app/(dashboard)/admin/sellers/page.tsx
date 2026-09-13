import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SellersContent from '@/components/admin/sellers/SellersContent';
import { getSellers } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Sellers | JEE Admin',
  description: 'Manage seller accounts and their status.',
};

export default async function AdminSellersPage() {
  const sellers = await getSellers();

  return (
    <DashboardLayout allowedRole="admin">
      <SellersContent sellers={sellers} />
    </DashboardLayout>
  );
}