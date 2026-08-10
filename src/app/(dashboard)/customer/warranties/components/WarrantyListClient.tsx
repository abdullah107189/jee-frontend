// app/(dashboard)/customer/warranties/components/WarrantyListClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link'; 
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, Eye, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react'; 
import { useGetCustomerWarrantiesQuery } from '@/lib/redux/features/customer/customerApi';

const statusConfig = {
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  EXPIRED: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  CLAIMED: {
    label: 'Claimed',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
};

export function WarrantyListClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useGetCustomerWarrantiesQuery([]);

  const warranties = data ?? [];
  
  const filtered = warranties.filter((w: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.productName?.toLowerCase().includes(term) ||
      w.uniqueId?.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search - Client Interactive */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by product or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Warranty Cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No warranties found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search' : 'You don\'t have any warranties yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((warranty: any) => {
            const status = statusConfig[warranty.status as keyof typeof statusConfig] || statusConfig.ACTIVE;
            const StatusIcon = status.icon;

            return (
              <Card key={warranty.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{warranty.productName}</span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {warranty.uniqueId}
                        </span>
                        <Badge className={status.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>Started: {new Date(warranty.startDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Expires: {new Date(warranty.endDate).toLocaleDateString()}</span>
                        {warranty.status === 'ACTIVE' && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {warranty.daysRemaining} days left
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link href={`/customer/warranties/${warranty.id}`}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}