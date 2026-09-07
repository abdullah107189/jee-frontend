import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SalesHistoryContent from './components/SalesHistoryContent';

export const metadata: Metadata = {
  title: 'Sales History | TechStore',
  description: 'View all registered offline transactions, receipts and digital warranties.',
};

export default function SalesHistoryPage() {
  return (
    <DashboardLayout allowedRole="seller">
      <SalesHistoryContent />
    </DashboardLayout>
  );
}