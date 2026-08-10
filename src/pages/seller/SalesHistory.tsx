"use client";
import  { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Eye, PlusCircle, Calendar, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { useGetTransactionsQuery } from '@/lib/redux/features/seller/sellerApi';
import Link from 'next/link';

export default function SellerSalesHistoryPage() {
  const { data: sales = [], isLoading } = useGetTransactionsQuery({ role: 'seller' });

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSales = sales.filter((sale: any) => {
    const matchesSearch = 
      sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerPhone.includes(searchTerm);

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage) || 1;
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getWarrantyBadge = (status: string) => {
    if (status.includes('Active')) {
      return <Badge variant="success" className="rounded-full px-3 py-1 text-xs">✅ Active</Badge>;
    }
    if (status.includes('Claimed')) {
      return <Badge className="bg-amber-500 text-white rounded-full px-3 py-1 text-xs">Claimed</Badge>;
    }
    return <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{status}</Badge>;
  };

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Sales History</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">View all your registered offline transactions, issued receipts, and digital warranties.</p>
          </div>
          <Link href="/seller/sales/new">
            <Button className="h-12 px-6 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20">
              <PlusCircle className="mr-2 h-5 w-5" /> New Offline Sale
            </Button>
          </Link>
        </div>

        {/* Filters Card */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by Product Name, Unique ID, Customer Name or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 w-full text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="THIS_WEEK">This Week</option>
                <option value="THIS_MONTH">This Month</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading sales history...</div>
            ) : filteredSales.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-medium">No sales recorded matching filters.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Unique ID</th>
                    <th className="px-5 py-4">Customer Name</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Warranty Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedSales.map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors bg-white">
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">{sale.date}</td>
                      <td className="px-5 py-4 font-semibold text-slate-900">{sale.product}</td>
                      <td className="px-5 py-4 font-mono text-xs font-bold text-blue-600">{sale.uniqueId}</td>
                      <td className="px-5 py-4 text-slate-800 font-medium">
                        <div>{sale.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{sale.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-slate-900">৳{sale.price.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        {getWarrantyBadge(sale.status)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/seller/sales/${sale.id}`}>
                          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold">
                            <Eye className="h-4 w-4 mr-1.5" /> Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>Showing Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <Button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg bg-white"
                >
                  Previous
                </Button>
                <Button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg bg-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
