import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SellerDashboard } from '@/components/shared/Dashboards';
import { getRecentSales, getSellerDashboardStats } from '@/services/seller.service';

export const metadata: Metadata = {
  title: 'Seller Dashboard | JEE',
  description: 'Manage offline sales, track warranties and view performance.',
};

export default async function SellerDashboardPage() {
  const [stats, recentSales] = await Promise.all([
    getSellerDashboardStats(),
    getRecentSales(),
  ]);

  return (
    <DashboardLayout allowedRole="seller">
      <SellerDashboard stats={stats} recentSales={recentSales} />
    </DashboardLayout>
  );
}