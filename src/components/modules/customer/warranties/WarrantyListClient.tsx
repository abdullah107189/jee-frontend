'use client';

import { useState } from 'react';
import Link from 'next/link'; 
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { CustomerWarranty } from '@/services/customer.service';
import { formatAppDate } from '@/lib/utils';
import { Search, X, Eye, Shield, CheckCircle, AlertCircle, Clock, QrCode } from 'lucide-react'; 

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  EXPIRED: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  CLAIMED: {
    label: 'Claimed',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
};

export function WarrantyListClient({ warranties }: { warranties: CustomerWarranty[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = warranties.filter((w) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.productName?.toLowerCase().includes(term) ||
      w.uniqueId?.toLowerCase().includes(term) ||
      w.id?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      {/* Search Input */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by product name or serial..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-9 h-11 rounded-xl bg-card border-border"
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
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="text-center py-12 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {searchTerm ? 'No matching warranties found' : 'No warranties registered yet'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search query or check spelling.'
                : 'Purchased a new JEE product? Scan your product box barcode or serial number to verify coverage.'}
            </p>
            <div className="pt-2">
              <Link href="/customer/warranties/check">
                <Button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold gap-2 shadow-xs">
                  <QrCode className="h-4 w-4" />
                  Verify a Warranty
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((warranty) => {
            const rawStatus = (warranty.status || 'ACTIVE').toUpperCase();
            const config = statusConfig[rawStatus] || statusConfig.ACTIVE;
            const StatusIcon = config.icon;

            return (
              <Card key={warranty.id} className="rounded-2xl border-border bg-card shadow-xs transition hover:shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-foreground">{warranty.productName}</span>
                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                          {warranty.uniqueId}
                        </span>
                        <Badge variant="outline" className={`text-xs px-2.5 py-0.5 rounded-lg ${config.className}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                        <span>Started: <strong className="text-foreground">{formatAppDate(warranty.startDate)}</strong></span>
                        <span>•</span>
                        <span>Expires: <strong className="text-foreground">{formatAppDate(warranty.endDate)}</strong></span>
                        {rawStatus === 'ACTIVE' && warranty.daysRemaining > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {warranty.daysRemaining} days left
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link href={`/customer/warranties/${warranty.id}`}>
                      <Button variant="outline" className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-semibold gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
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
