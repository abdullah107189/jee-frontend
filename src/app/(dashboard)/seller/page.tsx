import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SellerDashboard } from '../components/Dashboards';

export const metadata: Metadata = {
  title: 'Seller Dashboard | TechStore',
  description: 'Manage offline sales, track warranties and view performance.',
};

export default function SellerDashboardPage() {
  return (
    <DashboardLayout allowedRole="seller">
      <SellerDashboard />
    </DashboardLayout>
  );
}