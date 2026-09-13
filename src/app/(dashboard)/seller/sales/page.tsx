import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SalesHistoryContent from '@/components/modules/seller/sales/SalesHistoryContent';
import { getSellerTransactions } from '@/services/seller.service';

export const metadata: Metadata = {
  title: 'Sales History | JEE',
  description: 'View all registered offline transactions, receipts and digital warranties.',
};

export default async function SalesHistoryPage() {
  const sales = await getSellerTransactions();

  return (
    <DashboardLayout allowedRole="seller">
      <SalesHistoryContent sales={sales} />
    </DashboardLayout>
  );
}