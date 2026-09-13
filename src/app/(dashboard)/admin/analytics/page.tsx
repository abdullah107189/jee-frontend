import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AnalyticsContent from '@/components/modules/admin/analytics/AnalyticsContent';
import { getAnalytics } from '@/services/admin.service';

export const metadata: Metadata = {
  title: 'Analytics | JEE Admin',
  description: 'Charts and insights about store performance.',
};

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <DashboardLayout allowedRole="admin">
      <AnalyticsContent analytics={analytics} />
    </DashboardLayout>
  );
}