// app/(dashboard)/customer/components/ActiveWarranties.tsx
'use client';

import Link from 'next/link';
 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, ArrowRight, Eye } from 'lucide-react';
import { useGetCustomerWarrantiesQuery } from '@/lib/redux/features/customer/customerApi';

export function ActiveWarranties() {
  const { data, isLoading } = useGetCustomerWarrantiesQuery({ 
    limit: 3,
    status: 'ACTIVE' 
  });
  const warranties = data ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Warranties</CardTitle>
        <Link href="/customer/warranties">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {warranties.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No active warranties</p>
          </div>
        ) : (
          <div className="space-y-4">
            {warranties.map((warranty: any) => (
              <div 
                key={warranty.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{warranty.productName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{warranty.uniqueId}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {warranty.daysRemaining} days left
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Expires: {new Date(warranty.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/customer/warranties/${warranty.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}