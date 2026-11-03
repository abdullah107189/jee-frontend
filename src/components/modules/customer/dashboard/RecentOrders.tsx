import Link from 'next/link';
import type { CustomerOrder } from '@/services/customer.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Package, ArrowRight, Eye, ShoppingCart } from 'lucide-react';
import { formatAppDate } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  PROCESSING: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  SHIPPED: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  CANCELLED: 'bg-destructive/10 text-destructive border-destructive/20',
  RETURNED: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export function RecentOrders({ orders }: { orders: CustomerOrder[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold text-foreground">Recent Orders</CardTitle>
        <Link href="/customer/orders">
          <Button variant="ghost" size="sm" className="gap-1 text-xs font-semibold">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">No orders yet</p>
            <p className="text-xs text-muted-foreground">Explore our official electronics collection.</p>
            <div className="pt-2">
              <Link href="/products">
                <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 font-semibold">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Browse Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => {
              const rawStatus = (order.status || 'PENDING').toUpperCase();
              const badgeClass = statusColors[rawStatus] || 'bg-muted text-muted-foreground';

              return (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 bg-muted text-foreground rounded-xl flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        Order #{order.orderNumber || order.id}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatAppDate(order.createdAt || order.date)}</span>
                        <span>•</span>
                        <span className="font-semibold text-foreground">
                          ৳{(order.totalAmount || order.total || 0).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="outline" className={`mt-1 text-[11px] px-2 py-0.5 rounded-md font-bold ${badgeClass}`}>
                        {rawStatus === 'RETURNED' ? 'Returned' : rawStatus}
                      </Badge>
                    </div>
                  </div>
                  <Link href={`/customer/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
