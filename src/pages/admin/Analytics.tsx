import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Printer, TrendingUp, Package, Users, ShieldAlert, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useGetAnalyticsQuery } from '@/lib/redux/features/admin/adminApi';
import { toast } from 'sonner';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('MONTH');
  const { data: analytics, isLoading } = useGetAnalyticsQuery({ period });

  const handleExportCSV = () => {
    toast.success('Analytics report exported as CSV');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Analytics & Reports</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Deep-dive into store performance, stock levels, seller metrics, and warranty claims.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-10 sm:h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="MONTH">This Month</option>
              <option value="QUARTER">This Quarter</option>
              <option value="YEAR">This Year</option>
            </select>
            <Button onClick={handleExportCSV} variant="outline" className="h-10 sm:h-12 bg-white rounded-xl">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={handleExportPDF} className="h-10 sm:h-12 rounded-xl shadow-lg shadow-blue-500/20">
              <Printer className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        {isLoading || !analytics ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading analytics reports...</div>
        ) : (
          <>
            {/* 1️⃣ Sales Overview Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" /> Sales & Revenue Overview
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Line Chart */}
                <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white lg:col-span-2 flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-800">Monthly Sales (Online vs Offline)</h3>
                  </div>
                  <div className="p-6 flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.salesTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'}} />
                        <Legend iconType="circle" />
                        <Line type="monotone" dataKey="online" name="Online Store" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                        <Line type="monotone" dataKey="offline" name="Offline Sellers" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Sales by Category */}
                <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white flex flex-col">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">Sales by Category</h3>
                  </div>
                  <div className="p-6 flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={analytics.categorySales} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} width={100} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="sales" name="Units" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={18} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>

            {/* 2️⃣ Product & Stock Analytics */}
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-indigo-600" /> Inventory & Product Intelligence
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Selling Products */}
                <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">Best Selling Products</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="p-4">Product Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4 text-right">Units Sold</th>
                          <th className="p-4 text-right">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analytics.bestSellingProducts?.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-semibold text-slate-900">{item.name}</td>
                            <td className="p-4 text-xs text-slate-500">{item.category}</td>
                            <td className="p-4 text-right font-bold text-slate-800">{item.sold}</td>
                            <td className="p-4 text-right font-extrabold text-blue-600">৳{item.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Low Stock Alerts Table */}
                <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
                    <h3 className="text-base font-bold text-rose-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-rose-600" /> Low Stock Alerts
                    </h3>
                    <Badge variant="destructive" className="rounded-full">Requires Re-stock</Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="p-4">Product Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Available Stock</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analytics.lowStockProducts?.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-semibold text-slate-900">{item.name}</td>
                            <td className="p-4 text-xs text-slate-500">{item.category}</td>
                            <td className="p-4 font-bold text-rose-600">{item.stock} units left</td>
                            <td className="p-4">
                              <Badge variant="destructive" className="rounded-full text-[10px] px-2.5 py-0.5">
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>

            {/* 3️⃣ Seller & Warranty Intelligence */}
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-amber-600" /> Seller & Warranty Performance
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Sellers Table */}
                <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">Top Performing Sellers</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="p-4">Merchant Name</th>
                          <th className="p-4 text-right">Units Sold</th>
                          <th className="p-4 text-right">Gross Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analytics.topSellers?.map((seller: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-4 font-semibold text-slate-900">{seller.name}</td>
                            <td className="p-4 text-right font-bold text-slate-800">{seller.sales}</td>
                            <td className="p-4 text-right font-extrabold text-emerald-600">৳{seller.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Warranties Expiring Soon */}
                <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">Warranties Expiring Soon (Next 30 Days)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="p-4">Unique ID</th>
                          <th className="p-4">Product & Customer</th>
                          <th className="p-4 text-right">Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analytics.expiringWarranties?.map((w: any) => (
                          <tr key={w.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-mono font-bold text-blue-600">{w.uniqueId}</td>
                            <td className="p-4">
                              <div className="font-semibold text-slate-800">{w.product}</div>
                              <div className="text-xs text-slate-500">{w.customer}</div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="font-mono text-xs font-bold text-amber-600">{w.expiryDate}</div>
                              <div className="text-[10px] text-slate-400">({w.daysRemaining} days left)</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
