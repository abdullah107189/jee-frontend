import Link from 'next/link';
import type { CustomerWarranty } from '@/services/customer.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Shield, ArrowRight, Eye, QrCode } from 'lucide-react';
import { formatAppDate } from '@/lib/utils';

export function ActiveWarranties({ warranties }: { warranties: CustomerWarranty[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-foreground">Active Warranties</CardTitle>
        <Link href="/customer/warranties">
          <Button variant="ghost" size="sm" className="gap-1 text-xs font-semibold">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {warranties.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
              <Shield className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No active warranties registered</p>
            <p className="text-xs text-muted-foreground">Verify your purchase to activate warranty tracking.</p>
            <div className="pt-2">
              <Link href="/customer/warranties/check">
                <Button size="sm" className="rounded-xl text-xs gap-1.5 bg-primary text-primary-foreground font-semibold">
                  <QrCode className="h-3.5 w-3.5" />
                  Verify Serial
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {warranties.map((warranty) => (
              <div 
                key={warranty.id} 
                className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl flex-shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{warranty.productName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{warranty.uniqueId}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {warranty.daysRemaining > 0 && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                          {warranty.daysRemaining} days left
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        Expires: <strong className="text-foreground">{formatAppDate(warranty.endDate)}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/customer/warranties/${warranty.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                    <Eye className="w-4 h-4 text-muted-foreground" />
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
