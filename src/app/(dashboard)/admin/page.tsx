import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AdminDashboard from '../components/Dashboards';

export const metadata: Metadata = {
  title: 'Admin Dashboard | TechStore',
  description: 'Overview of your store performance and operations.',
};

export default function AdminDashboardPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <AdminDashboard />
    </DashboardLayout>
  );
}