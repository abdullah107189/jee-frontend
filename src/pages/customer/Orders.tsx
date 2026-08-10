import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useGetTransactionsQuery } from '@/lib/redux/features/seller/sellerApi';
import { TransactionList } from '@/components/shared/TransactionList';

export default function CustomerOrdersPage() {
  const { data: transactions, isLoading } = useGetTransactionsQuery({ role: 'customer' });

  return (
    <DashboardLayout allowedRole="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Orders</h1>
          <p className="text-zinc-500">View your order history and warranty status.</p>
        </div>

        <TransactionList 
          transactions={transactions || []} 
          isLoading={isLoading} 
          basePath="/customer/orders" 
        />
      </div>
    </DashboardLayout>
  );
}
