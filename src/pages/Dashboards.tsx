import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { useGetSellerDashboardStatsQuery, useGetRecentSalesQuery } from '@/lib/redux/features/seller/sellerApi';
import { Package, Activity, Users, ShoppingCart, ShieldCheck, Box, UserCheck, UserPlus, Clock, PlusCircle, ArrowRight, Eye, Banknote, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const MONTHLY_SALES_DATA = [
  { name: 'Jan', online: 4000, offline: 2400 },
  { name: 'Feb', online: 3000, offline: 1398 },
  { name: 'Mar', online: 2000, offline: 9800 },
  { name: 'Apr', online: 2780, offline: 3908 },
  { name: 'May', online: 1890, offline: 4800 },
  { name: 'Jun', online: 2390, offline: 3800 },
  { name: 'Jul', online: 3490, offline: 4300 },
  { name: 'Ags', online: 3490, offline: 4300 },
  { name: 'Sep', online: 3490, offline: 4300 },
  { name: 'Oct', online: 3490, offline: 4300 },
  { name: 'Nov', online: 3490, offline: 4300 },
  { name: 'Dec', online: 3490, offline: 4300 },
];

const WARRANTY_STATUS_DATA = [
  { name: 'Active', value: 5932 },
  { name: 'Expired', value: 1295 },
  { name: 'Claimed', value: 432 },
  { name: 'Void', value: 120 },
];

const TOP_PRODUCTS_DATA = [
  { name: 'Pro Desk', sales: 430 },
  { name: 'Ergo Chair', sales: 380 },
  { name: 'Mech Key', sales: 290 },
  { name: '4K Monitor', sales: 250 },
  { name: 'Mouse V2', sales: 210 },
];

const COLORS = ['#3b82f6', '#94a3b8', '#f59e0b', '#ef4444'];

export function AdminDashboard() {
  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Overview of your store's performance and operations.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-12 bg-white rounded-xl">
              Export Report
            </Button>
            <Button className="flex-1 sm:flex-none h-10 sm:h-12 rounded-xl shadow-lg shadow-blue-500/20">
              View Analytics
            </Button>
          </div>
        </div>

        {/* Top Level Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Products</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">124</h3>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Box className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Physical Units</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">8,432</h3>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Units</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">1,205</h3>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 sm:p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Today's Orders</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">45</h3>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Monthly Sales Bar Chart */}
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white lg:col-span-2 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Monthly Sales (Online vs Offline)</h3>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={MONTHLY_SALES_DATA}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                  <Bar dataKey="online" name="Online Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="offline" name="Offline Sales" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Warranty Status Pie Chart */}
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Warranty Status</h3>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex-1 min-h-[300px] flex flex-col justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WARRANTY_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {WARRANTY_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" layout="vertical" verticalAlign="bottom" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Secondary Stats Group */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Seller Network</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-slate-100 flex-1">
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <Users className="h-6 w-6 text-slate-400 mb-3" />
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Sellers</p>
                <p className="text-2xl font-extrabold text-slate-800">142</p>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <UserCheck className="h-6 w-6 text-emerald-500 mb-3" />
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Active</p>
                <p className="text-2xl font-extrabold text-slate-800">128</p>
              </div>
              <div className="p-4 sm:p-6 lg:p-8 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-slate-100 bg-orange-50/30 flex flex-col justify-center">
                <UserPlus className="h-6 w-6 text-orange-500 mb-3" />
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Pending</p>
                <p className="text-2xl font-extrabold text-slate-800">14</p>
              </div>
            </div>
          </Card>

          {/* Top 5 Products Chart */}
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Top Selling Products</h3>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={TOP_PRODUCTS_DATA}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} width={80} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="sales" name="Units Sold" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;

export function SellerDashboard() {
  const { data: stats } = useGetSellerDashboardStatsQuery();
  const { data: recentSales = [], isLoading: isSalesLoading } = useGetRecentSalesQuery();

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8">
        {/* Header & Quick Action Big CTA */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-blue-900/20">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Seller Control Center</h1>
            <p className="text-sm sm:text-base text-blue-200 mt-1 font-medium">Record offline sales, issue digital warranties, and manage store performance.</p>
          </div>
          <div>
            <Link href="/seller/sales/new">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-base font-bold shadow-xl shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all">
                <PlusCircle className="mr-2 h-6 w-6" /> 🔴 New Sale
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-lg transition-all">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Banknote className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Sales</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">৳{(stats?.todaysSales || 12500).toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-lg transition-all">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">৳{(stats?.totalSalesAmount || 245000).toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-lg transition-all">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats?.totalOrders || 156}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-lg transition-all">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Warranties</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats?.activeWarranties || 89}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white hover:shadow-lg transition-all col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Claims</span>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stats?.pendingClaims || 3}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/seller/sales/new">
            <Card className="rounded-2xl border-2 border-blue-500 bg-blue-50/50 hover:bg-blue-50 transition-all cursor-pointer p-4 flex items-center justify-between group shadow-md shadow-blue-500/10">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/30">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">New Offline Sale</h4>
                  <p className="text-xs text-slate-500 font-medium">Validate Unique ID & issue warranty</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>

          <Link href="/seller/sales">
            <Card className="rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all cursor-pointer p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">View All Sales</h4>
                  <p className="text-xs text-slate-500 font-medium">History, customer receipts & logs</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>

          <Link href="/seller/warranties">
            <Card className="rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all cursor-pointer p-4 flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">View Warranties</h4>
                  <p className="text-xs text-slate-500 font-medium">Track customer active guarantees</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
        </div>

        {/* Recent Sales Table */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Offline Sales</h3>
              <p className="text-xs text-slate-500 mt-0.5">Showing last 10 offline transactions issued by your outlet.</p>
            </div>
            <Link href="/seller/sales">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            {isSalesLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading sales history...</div>
            ) : recentSales.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No sales recorded yet.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Unique ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentSales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">{sale.productName}</td>
                      <td className="px-5 py-4 font-mono text-xs font-bold text-blue-600">{sale.uniqueId}</td>
                      <td className="px-5 py-4 text-slate-700 font-medium">{sale.customerName}</td>
                      <td className="px-5 py-4 font-extrabold text-slate-900">৳{sale.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">{sale.date}</td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/seller/sales/${sale.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold">
                            <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export function CustomerDashboard() {
  return (
    <DashboardLayout allowedRole="customer">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Customer Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-[0_8px_30px_rgb(59,130,246,0.1)]">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3">My Orders</h3>
            <p className="text-sm sm:text-base text-blue-700/80 mb-5 sm:mb-6 font-medium">View your order history and check warranty details for all your purchased items.</p>
            <Link href="/customer/orders">
              <Button className="shadow-lg shadow-blue-500/20 w-full sm:w-auto">
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-12 sm:py-20">
      <div className="h-16 w-16 sm:h-20 sm:w-20 bg-blue-600 rounded-2xl mb-6 sm:mb-8 shadow-xl shadow-blue-500/30 flex items-center justify-center">
        <Package className="text-white h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 sm:mb-6 text-slate-900">TechStore.</h1>
      <p className="text-lg sm:text-xl text-slate-500 mb-8 sm:mb-12 max-w-2xl font-medium px-4">
        The complete e-commerce solution with offline seller management and instant warranty tracking.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
        <Link href="/login" className="w-full sm:w-auto">
          <Button size="lg" className="w-full">Login to Portals</Button>
        </Link>
        <Link href="/warranty" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full bg-white">Check Warranty</Button>
        </Link>
        <Link href="/customer/checkout" className="w-full sm:w-auto">
          <Button size="lg" variant="ghost" className="w-full border-2 border-transparent bg-slate-100">Demo Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
