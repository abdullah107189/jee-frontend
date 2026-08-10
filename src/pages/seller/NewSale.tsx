"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLazyValidateProductItemQuery, useRecordOfflineSaleMutation } from '@/lib/redux/features/seller/sellerApi';
import { toast } from 'sonner';
import { Search, CheckCircle2, PackageSearch, ShieldCheck, Printer, List, PlusCircle, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SellerNewSalePage() {
  const router = useRouter();
  const [uniqueId, setUniqueId] = useState('');
  const [productData, setProductData] = useState<any>(null);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [salePrice, setSalePrice] = useState<number | string>('');
  const [discount, setDiscount] = useState<number | string>(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');

  // Success modal state
  const [successModalData, setSuccessModalData] = useState<any | null>(null);

  const [validateProduct, { isFetching }] = useLazyValidateProductItemQuery();
  const [recordSale, { isLoading: isRecording }] = useRecordOfflineSaleMutation();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setUniqueId(val);
  };

  const handleSearch = async () => {
    if (!uniqueId.trim()) {
      toast.error('Please enter a Unique Product ID');
      return;
    }
    if (uniqueId.length < 3) {
      toast.error('Unique ID format invalid (e.g. FAN-001928)');
      return;
    }

    try {
      const res = await validateProduct(uniqueId).unwrap();
      setProductData(res);
      setSalePrice(res.product.price);
      toast.success('✅ Product Found!');
    } catch (err: any) {
      setProductData(null);
      toast.error(err?.data || '❌ Product Item not found or unavailable');
    }
  };

  const handleClear = () => {
    setUniqueId('');
    setProductData(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setSalePrice('');
    setDiscount(0);
    setPaymentMethod('CASH');
    setNotes('');
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData) {
      toast.error('Please search and validate a product first');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Customer Name is required');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('Customer Phone is required');
      return;
    }
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      toast.error('Invalid Bangladeshi phone number format (e.g. 01712345678)');
      return;
    }

    const finalAmount = Number(salePrice) - Number(discount || 0);

    try {
      const payload = {
        uniqueId: productData.uniqueId,
        productItemId: productData.id,
        productName: productData.product.name,
        warrantyMonths: productData.product.warrantyMonths,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        salePrice: finalAmount,
        discount: Number(discount || 0),
        paymentMethod,
        notes,
        saleDate: new Date().toISOString().split('T')[0]
      };

      const res = await recordSale(payload).unwrap();
      toast.success('🎉 Sale Recorded & Warranty Activated!');

      setSuccessModalData(res);
    } catch (err) {
      toast.error('Failed to record sale. Please try again.');
    }
  };

  const handleStartNewSaleFromModal = () => {
    setSuccessModalData(null);
    handleClear();
  };

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">New Offline Sale</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Search Unique Product ID from package and issue instant digital warranty.</p>
        </div>

        {/* 1️⃣ Step 1: Search Product by Unique ID */}
        <Card className="rounded-2xl sm:rounded-[2rem] border-2 border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-5 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center text-slate-800">
              <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mr-3 shadow-md shadow-blue-500/20">
                <Search className="h-4 w-4" />
              </div>
              Step 1: Search Product by Unique ID
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={uniqueId}
                  onChange={handleIdChange}
                  placeholder="Enter Unique ID (e.g., FAN-001928, AC-003456)"
                  className="h-12 sm:h-14 text-base sm:text-lg font-mono font-bold uppercase rounded-xl sm:rounded-2xl border-slate-200 focus:border-blue-600 focus:ring-blue-500/20 pl-4"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isFetching}
                className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 text-base"
              >
                {isFetching ? 'Searching...' : '🔍 Search Product'}
              </Button>
            </div>
            <p className="text-xs text-slate-500 flex items-center font-medium">
              💡 Example format: <span className="font-mono font-bold text-slate-700 ml-1">FAN-001928</span>, <span className="font-mono font-bold text-slate-700 ml-1">AC-003456</span>, <span className="font-mono font-bold text-slate-700 ml-1">BULB-99120</span>
            </p>
          </CardContent>
        </Card>

        {/* 2️⃣ Step 2: Product Preview (After Search) */}
        {productData && (
          <Card className="rounded-2xl sm:rounded-[2rem] border-2 border-emerald-500/50 shadow-xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 px-6 flex justify-between items-center">
              <div className="flex items-center space-x-2 font-bold text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                <span>✅ Product Found!</span>
              </div>
              <Badge variant="success" className="bg-white text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs">Available</Badge>
            </div>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Product Name</span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">{productData.product.name}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Unique ID</span>
                  <p className="text-base font-mono font-extrabold text-blue-600 mt-1">{productData.uniqueId}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Listed Price</span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">৳ {productData.product.price.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Warranty Term</span>
                  <p className="text-base font-extrabold text-blue-700 mt-1">{productData.product.warrantyMonths} Months</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <a href="#customer-form" className="inline-flex items-center font-bold text-sm text-emerald-700 hover:text-emerald-800">
                  Continue to Customer Information <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 3️⃣ Step 3: Customer Information Form */}
        <Card id="customer-form" className={`rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white transition-all ${!productData ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="p-5 sm:p-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900">Step 3: Customer Information & Sale Details</CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmitSale} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Customer Name *</label>
                  <Input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer full name"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Customer Phone Number *</label>
                  <Input
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Customer Email (Optional)</label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@email.com"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Sale Price ৳</label>
                  <Input
                    type="number"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="15000"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Discount ৳ (Optional)</label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="MOBILE">Mobile Banking (bKash / Nagad)</option>
                    <option value="BANK">Bank Wire Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Additional Notes (Optional)</label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific delivery or invoice remarks..."
                    className="h-12 rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={handleClear} className="h-12 rounded-xl px-6 bg-white">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isRecording}
                  className="h-12 sm:h-14 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl shadow-emerald-600/30 text-base"
                >
                  {isRecording ? 'Recording Sale...' : '✅ Record Sale & Activate Warranty'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 4️⃣ Step 4: Success Modal (After Sale) */}
        {successModalData && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
              <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center relative">
                <div className="h-16 w-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black">🎉 Sale Recorded Successfully!</h3>
                <p className="text-xs text-emerald-100 font-medium mt-1">Transaction saved & digital warranty activated automatically.</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Sale ID</span>
                    <span className="font-mono font-extrabold text-slate-900">{successModalData.saleId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Product Name</span>
                    <span className="font-bold text-slate-900">{successModalData.productName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Unique ID</span>
                    <span className="font-mono font-bold text-blue-600">{successModalData.uniqueId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Customer</span>
                    <span className="font-bold text-slate-800">{successModalData.customerName} ({successModalData.customerPhone})</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Paid Amount</span>
                    <span className="font-extrabold text-slate-900">৳{successModalData.salePrice?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Warranty Summary Box */}
                <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <h4 className="font-extrabold text-base">🛡️ Digital Warranty Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block">Start Date:</span>
                      <span className="font-mono font-bold text-slate-800">{successModalData.warranty?.startDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">End Date:</span>
                      <span className="font-mono font-bold text-slate-800">{successModalData.warranty?.endDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Status:</span>
                      <Badge variant="success" className="mt-0.5">Active</Badge>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Days Remaining:</span>
                      <span className="font-bold text-blue-700">{successModalData.warranty?.daysRemaining} Days</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="w-full h-12 rounded-xl bg-white border-slate-300 font-bold"
                  >
                    <Printer className="mr-2 h-4 w-4" /> 🖨️ Print Invoice
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push('/seller/sales')}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-700 font-bold"
                    >
                      <List className="mr-2 h-4 w-4" /> 📋 View All Sales
                    </Button>
                    <Button
                      onClick={handleStartNewSaleFromModal}
                      className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> ➕ New Sale
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
