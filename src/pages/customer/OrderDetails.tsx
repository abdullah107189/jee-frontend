"use client"; 
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useGetTransactionDetailsQuery } from '@/lib/redux/features/seller/sellerApi';
import { TransactionDetails } from '@/components/shared/TransactionDetails';
import { useParams } from 'next/navigation';

export default function CustomerOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: transaction, isLoading } = useGetTransactionDetailsQuery(id || '');

  return (
    <DashboardLayout allowedRole="customer">
      <TransactionDetails 
        transaction={transaction} 
        isLoading={isLoading} 
        backPath="/customer/orders" 
      />
    </DashboardLayout>
  );
}
