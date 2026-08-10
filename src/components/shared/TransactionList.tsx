import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LayoutGrid, List as ListIcon, Eye } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  uniqueId: string;
  product: string;
  image?: string;
  date: string;
  price: number;
  customerName: string;
  customerPhone: string;
  status: string;
  paymentMethod: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  basePath: string; // e.g., '/seller/sales' or '/customer/orders'
}

export function TransactionList({ transactions, isLoading, basePath }: TransactionListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid'); // Default to grid to show off images

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading records...</div>;
  }

  if (!transactions.length) {
    return <div className="p-8 text-center text-slate-500 border border-dashed rounded-3xl bg-white">No records found.</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end space-x-2 sm:space-x-3 mb-2 sm:mb-4">
        <Button 
          variant={viewMode === 'table' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setViewMode('table')}
          className="rounded-full px-4 sm:px-5 shadow-sm"
        >
          <ListIcon className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Table View</span>
        </Button>
        <Button 
          variant={viewMode === 'grid' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setViewMode('grid')}
          className="rounded-full px-4 sm:px-5 shadow-sm"
        >
          <LayoutGrid className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Grid View</span>
        </Button>
      </div>

      {viewMode === 'table' ? (
        <Card className="rounded-2xl sm:rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Product</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap hidden sm:table-cell">Date</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap hidden md:table-cell">Customer Info</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap">Price</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 whitespace-nowrap hidden sm:table-cell">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 font-medium text-slate-500 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {t.image && (
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden shrink-0 shadow-sm hidden sm:block">
                            <img src={t.image} alt={t.product} className="h-full w-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{t.product}</div>
                          <div className="font-mono text-[10px] sm:text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">{t.uniqueId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600 whitespace-nowrap hidden sm:table-cell">{t.date}</td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      {t.customerName !== 'N/A' ? (
                        <div>
                          <div className="font-medium text-slate-900">{t.customerName}</div>
                          <div className="text-xs text-slate-500">{t.customerPhone}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not Provided</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-semibold text-slate-800">৳{t.price}</td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <Badge variant={t.status.includes('Active') ? 'success' : 'default'} className="rounded-full shadow-sm whitespace-nowrap">
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <Link href={`${basePath}/${t.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full shadow-sm text-blue-600 border-blue-100 hover:bg-blue-50 px-3 sm:px-4">
                          <Eye className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Details</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {transactions.map((t) => (
            <Card key={t.id} className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col group">
              {t.image && (
                <div className="w-full h-40 sm:h-48 overflow-hidden relative">
                  <img src={t.image} alt={t.product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Badge variant={t.status.includes('Active') ? 'success' : 'default'} className="shadow-md backdrop-blur-md bg-white/90">
                      {t.status}
                    </Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs sm:text-sm font-medium text-blue-500/80">{t.date}</span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-800 mb-1 leading-tight line-clamp-1">{t.product}</h3>
                <p className="font-mono text-[10px] sm:text-xs font-medium text-slate-500 bg-slate-100/80 px-2 py-1 rounded-md inline-block w-fit mb-4 sm:mb-5">{t.uniqueId}</p>
                
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600 mb-5 sm:mb-6 flex-1">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl">
                    <span className="text-slate-500">Price</span>
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">৳{t.price}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl">
                    <span className="text-slate-500">Customer</span>
                    <span className="font-medium text-slate-800 truncate max-w-[120px] sm:max-w-[140px] text-right">{t.customerName}</span>
                  </div>
                </div>

                <Link href={`${basePath}/${t.id}`} className="mt-auto">
                  <Button className="w-full rounded-xl sm:rounded-2xl h-10 sm:h-12 shadow-md shadow-blue-500/20 bg-blue-500 hover:bg-blue-600 text-white transition-all text-sm sm:text-base">
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
