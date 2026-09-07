import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AnalyticsContent from './components/AnalyticsContent';

export const metadata: Metadata = {
  title: 'Analytics | TechStore Admin',
  description: 'Charts and insights about store performance.',
};

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout allowedRole="admin">
      <AnalyticsContent />
    </DashboardLayout>
  );
}