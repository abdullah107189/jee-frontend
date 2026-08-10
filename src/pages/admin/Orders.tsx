import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, ShoppingBag, CheckCircle, Clock, Truck, Package, Eye, FileSpreadsheet, ShieldCheck, AlertCircle, Printer, RefreshCw } from 'lucide-react';
import { useGetOrdersQuery, useGetOrderDetailsQuery, useUpdateOrderStatusMutation, useVerifyOrderPaymentMutation } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [verifyPayment] = useVerifyOrderPaymentMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orderDetails } = useGetOrderDetailsQuery(selectedOrderId  || '', { skip: !selectedOrderId });

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || order.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus.toUpperCase() === paymentFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
      toast.success(`Order #${id} status changed to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentVerify = async (id: string, verified: boolean) => {
    try {
      await verifyPayment({ id, verified }).unwrap();
      toast.success(`bKash payment for #${id} ${verified ? 'Verified' : 'Unverified'}`);
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">Delivered</Badge>;
      case 'SHIPPED':
        return <Badge className="bg-purple-500 text-white rounded-full px-3 py-1 text-xs">Shipped</Badge>;
      case 'PROCESSING':
        return <Badge className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs">Processing</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-teal-500 text-white rounded-full px-3 py-1 text-xs">Confirmed</Badge>;
      case 'PENDING':
        return <Badge variant="warning" className="rounded-full px-3 py-1 text-xs">Pending</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <Badge variant="success" className="rounded-full px-2.5 py-0.5 text-xs">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="warning" className="rounded-full px-2.5 py-0.5 text-xs">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-xs">Failed</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Order Management</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Track customer orders, verify bKash payments, and manage fulfillment.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Orders</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orders.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Pending</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orders.filter((o: any) => o.status === 'Pending').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Shipped</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orders.filter((o: any) => o.status === 'Shipped' || o.status === 'Processing').length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase">Delivered</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{orders.filter((o: any) => o.status === 'Delivered').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table Card */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by Order #, Customer Name, or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Order Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select 
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No orders found matching criteria.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Order #</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Customer</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Total Amount</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Order Status</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Payment</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Date</th>
                    <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-extrabold text-slate-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getOrderStatusBadge(order.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          {getPaymentStatusBadge(order.paymentStatus)}
                          <div className="text-xs text-slate-400 font-mono">{order.paymentMethod}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-500">
                        {order.date}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedOrderId(order.id)}
                          className="h-9 px-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <Eye className="h-4 w-4 mr-1.5" /> Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Order Details Modal */}
        {selectedOrderId && orderDetails && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Order Details #{orderDetails.id}</h3>
                  <p className="text-xs text-slate-400 mt-1">Placed on {orderDetails.date} • {orderDetails.paymentMethod}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => window.print()} variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 rounded-xl">
                    <Printer className="h-4 w-4 mr-1.5" /> Invoice
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrderId(null)} className="text-slate-400 hover:text-white">✕</Button>
                </div>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                {/* Status Controls */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Current Status</span>
                    <div className="mt-1">{getOrderStatusBadge(orderDetails.status)}</div>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                    <select 
                      value={orderDetails.status} 
                      onChange={(e) => handleStatusChange(orderDetails.id, e.target.value)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Customer Info</h4>
                    <p className="font-bold text-slate-800">{orderDetails.customerName}</p>
                    <p className="text-xs text-slate-600">{orderDetails.customerEmail}</p>
                    <p className="text-xs font-mono text-slate-600">{orderDetails.customerPhone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Shipping Address & Notes</h4>
                    <p className="text-xs text-slate-700 font-medium">{orderDetails.shippingAddress}</p>
                    <p className="text-xs text-slate-500 italic mt-1">"{orderDetails.notes}"</p>
                  </div>
                </div>

                {/* bKash Payment Verification Box */}
                {orderDetails.paymentMethod === 'bKash' && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">bKash Mobile Banking</span>
                      <p className="font-mono text-sm font-extrabold mt-1">TRX ID: {orderDetails.bkashTrxId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handlePaymentVerify(orderDetails.id, true)} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                      >
                        <ShieldCheck className="h-4 w-4 mr-1.5" /> Verify Payment
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePaymentVerify(orderDetails.id, false)} 
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
                      >
                        Flag Issue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Products Breakdown Table */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Order Items</h4>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">SKU / Serial</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3 text-right">Price</th>
                          <th className="p-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orderDetails.items?.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                            <td className="p-3 font-mono text-xs text-slate-500">{item.sku} ({item.serialNumber})</td>
                            <td className="p-3 font-bold">{item.quantity}</td>
                            <td className="p-3 text-right text-slate-600 font-medium">৳{item.price.toLocaleString()}</td>
                            <td className="p-3 text-right font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Price Calculation Summary */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">৳{orderDetails.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Tax (VAT):</span>
                      <span className="font-semibold">৳{orderDetails.tax?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Shipping Fee:</span>
                      <span className="font-semibold">৳{orderDetails.shipping?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span className="text-blue-600">৳{orderDetails.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedOrderId(null)} className="rounded-xl">Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
