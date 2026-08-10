"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLazyCheckWarrantyQuery } from '@/lib/redux/features/warranty/warrantyApi';
import { QrCode, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function WarrantyCheckPage() {
  const [uniqueId, setUniqueId] = useState('');
  const [checkWarranty, { data, isFetching }] = useLazyCheckWarrantyQuery();
  
  const handleSearch = async () => {
    if (!uniqueId.trim()) return;
    try {
      await checkWarranty(uniqueId).unwrap();
    } catch (err) {
      toast.error('Could not find warranty information.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 sm:mb-4">Warranty Tracker</h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Enter your product's Unique ID or scan the QR code to check your warranty status, validity, and claim options.
          </p>
        </div>

        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white/50 backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                  placeholder="Enter Unique Product ID (e.g. FAN-12345)" 
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg font-mono uppercase bg-white rounded-xl sm:rounded-2xl shadow-sm border-slate-200"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex space-x-3 sm:space-x-4">
                <Button onClick={handleSearch} disabled={isFetching} className="flex-1 sm:flex-none h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25">
                  {isFetching ? 'Checking...' : 'Check Status'}
                </Button>
                <Button variant="outline" className="h-12 w-12 sm:h-14 sm:w-14 p-0 shrink-0 rounded-xl sm:rounded-2xl border-slate-200" title="Scan QR Code">
                  <QrCode className="h-5 w-5 text-slate-500" />
                </Button>
              </div>
            </div>

            {data && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">{data.productName}</h3>
                  <Badge 
                    variant={data.status === 'ACTIVE' ? 'success' : 'destructive'}
                    className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full w-fit shadow-sm"
                  >
                    {data.status === 'ACTIVE' ? <ShieldCheck className="mr-1.5 h-4 w-4" /> : <ShieldAlert className="mr-1.5 h-4 w-4" />}
                    {data.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100/50">
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Unique ID</p>
                    <p className="font-mono text-sm sm:text-base font-bold text-slate-800">{data.uniqueId}</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Purchased From</p>
                    <p className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1">{data.sellerInfo || 'Online Store'}</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Activation Date</p>
                    <p className="text-sm sm:text-base font-bold text-slate-800">{new Date(data.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] sm:text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Expiration Date</p>
                    <p className="text-sm sm:text-base font-bold text-slate-800">{new Date(data.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {data.status === 'ACTIVE' && (
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50/80 border border-blue-100/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl gap-4 sm:gap-0">
                    <div>
                      <p className="font-bold text-blue-900 text-sm sm:text-base">Valid for {data.daysRemaining} more days</p>
                      <p className="text-xs sm:text-sm text-blue-700/80 font-medium mt-0.5">You are eligible for warranty claims.</p>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto bg-white text-blue-700 border-blue-200 hover:bg-blue-50 rounded-xl shadow-sm h-10 sm:h-12">
                      Request Claim
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
