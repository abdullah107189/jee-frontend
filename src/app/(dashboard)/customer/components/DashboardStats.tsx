// app/(dashboard)/customer/components/DashboardStats.tsx
'use client';

import { useGetCustomerStatsQuery } from '@/lib/redux/features/customer/customerApi';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Shield, Clock, Package } from 'lucide-react';

const statConfigs = [
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: ShoppingBag,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    key: 'activeWarranties',
    label: 'Active Warranties',
    icon: Shield,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'pendingClaims',
    label: 'Pending Claims',
    icon: Clock,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    key: 'totalSpent',
    label: 'Total Spent',
    icon: Package,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
];

export function DashboardStats() {
  const { data, isLoading } = useGetCustomerStatsQuery();
  const stats = data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfigs.map((config) => {
        const Icon = config.icon;
        const value = stats?.[config.key as keyof typeof stats];
        const displayValue = config.key === 'totalSpent' 
          ? `৳${value?.toLocaleString() || 0}`
          : value || 0;

        return (
          <Card key={config.key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{config.label}</p>
                  <p className="text-2xl font-bold">{displayValue}</p>
                </div>
                <div className={`p-3 rounded-full ${config.iconBg}`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}