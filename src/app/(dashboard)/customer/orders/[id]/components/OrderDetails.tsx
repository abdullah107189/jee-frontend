// app/(dashboard)/customer/orders/[id]/components/OrderDetails.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  CreditCard,
  Printer,
} from 'lucide-react';
import { useGetOrderDetailsQuery } from '@/lib/redux/features/admin/adminApi';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SHIPPED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function OrderDetails({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data, isLoading } = useGetOrderDetailsQuery({ id: orderId });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const order = data?.data;
  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist.
        </p>
        <Link href="/customer/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </button>

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge className={`text-base px-4 py-2 ${statusColors[order.status]}`}>
          {order.status}
        </Badge>
      </div>

      {/* Order Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Order Timeline</h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-6">
                {order.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="relative z-10">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items?.map((item: any) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="w-8 h-8 m-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      {item.serialNumber && (
                        <p className="text-xs text-muted-foreground font-mono">
                          SN: {item.serialNumber}
                        </p>
                      )}
                      {item.warrantyMonths && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.warrantyMonths} months warranty
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="font-bold whitespace-nowrap">
                    ৳{item.total?.toLocaleString() || 0}
                  </p>
                </div>
              ))}

              {order.notes && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {order.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{order.subtotal?.toLocaleString() || 0}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-৳{order.discount?.toLocaleString() || 0}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>৳{order.shipping?.toLocaleString() || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>৳{order.total?.toLocaleString() || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                📞 {order.shippingAddress?.phone}
              </p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-3 h-3 mt-0.5" />
                <span>
                  {order.shippingAddress?.address}
                  {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <CreditCard className="w-3 h-3" />
                {order.paymentMethod}
              </p>
              <p className="text-muted-foreground">
                Status: <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'outline'}>
                  {order.paymentStatus}
                </Badge>
              </p>
              {order.bkashTrxId && (
                <p className="text-xs text-muted-foreground font-mono">
                  Trx: {order.bkashTrxId}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}