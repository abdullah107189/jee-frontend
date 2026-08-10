import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Package, User, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TransactionDetailsProps {
  transaction: any;
  isLoading: boolean;
  backPath: string;
}

export function TransactionDetails({ transaction, isLoading, backPath }: TransactionDetailsProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  }

  if (!transaction) {
    return <div className="p-8 text-center text-red-500">Transaction not found.</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href={backPath} className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-blue-600 hover:shadow-md transition-all shrink-0">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 line-clamp-1">Transaction Details</h1>
            <p className="text-slate-500 font-mono text-xs sm:text-sm tracking-wider mt-0.5 sm:mt-1">{transaction.id}</p>
          </div>
        </div>
        <Badge variant={transaction.status.includes('Active') ? 'success' : 'default'} className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full shadow-sm w-fit">
          {transaction.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Image and Warranty */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {transaction.image ? (
              <div className="w-full aspect-video sm:aspect-square bg-slate-50">
                <img src={transaction.image} alt={transaction.product} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="w-full aspect-square bg-slate-100 flex items-center justify-center">
                <Package className="h-16 w-16 text-slate-300" />
              </div>
            )}
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight mb-3 sm:mb-2">{transaction.product}</h2>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0">
                <p className="font-mono text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 sm:px-2.5 py-1 rounded-md w-fit">{transaction.uniqueId}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-600">৳{transaction.price}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-blue-50 to-indigo-50/50">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg text-blue-900">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3 text-blue-600">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                Warranty Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transaction.warrantyDetails ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl flex justify-between items-center shadow-sm">
                    <span className="text-sm sm:text-base text-slate-600 font-medium">Duration</span>
                    <span className="font-bold text-blue-700 text-base sm:text-lg">{transaction.warrantyDetails.months} Months</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Start Date</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-800">{transaction.warrantyDetails.startDate}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">End Date</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-800">{transaction.warrantyDetails.endDate}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-slate-500 text-center py-4 bg-white/50 rounded-xl">No warranty information available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer and Seller Details */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg text-slate-800">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-green-50 flex items-center justify-center mr-2 sm:mr-3 text-green-600">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-0.5">Full Name</p>
                  <p className="font-bold text-slate-900 text-base sm:text-lg line-clamp-1">{transaction.customerName}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-0.5">Phone Number</p>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">{transaction.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center text-base sm:text-lg text-slate-800">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-purple-50 flex items-center justify-center mr-2 sm:mr-3 text-purple-600">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                Purchase Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Transaction Date</p>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{transaction.date}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Payment Method</p>
                  <div className="flex items-center">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{transaction.paymentMethod}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-0.5">Fulfilled By</p>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">{transaction.sellerInfo}</p>
                </div>
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 hidden sm:block" />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
