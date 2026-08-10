import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [bKashNumber, setBkashNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(bKashNumber)) {
      return toast.error("Invalid bKash Number");
    }
    if (trxId.length < 8) {
      return toast.error("Invalid Transaction ID");
    }

    setIsVerifying(true);
    // Mock API call to verify bKash TrxID
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success("Payment verified successfully!");
    }, 1500);
  };

  const handlePlaceOrder = () => {
    toast.success("Order Placed Successfully!");
    // In real app, redirect to order confirmation
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 flex-col-reverse lg:flex-row">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
            <Card className="rounded-2xl sm:rounded-[2rem]">
              <CardHeader>
                <CardTitle>Advance Payment (bKash)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6">
                <div className="bg-pink-50 border border-pink-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-pink-900 flex flex-col sm:flex-row items-start sm:items-center">
                  <AlertCircle className="h-6 w-6 mr-3 mb-2 sm:mb-0 flex-shrink-0 text-pink-600" />
                  <div>
                    <p className="font-bold mb-1 text-sm sm:text-base">Please send exactly ৳70 advance</p>
                    <p className="text-xs sm:text-sm text-pink-700/80">To confirm your order, send 70 BDT to our bKash Merchant Number: <strong className="text-base sm:text-lg block mt-1 text-pink-700 font-mono">017XXXXXXXX</strong></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700">Your bKash Number</label>
                    <Input 
                      placeholder="e.g. 01712345678" 
                      value={bKashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      disabled={isVerified}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700">bKash Transaction ID (TrxID)</label>
                    <Input 
                      placeholder="e.g. 8N5G6A9B2" 
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      className="uppercase bg-slate-50 font-mono"
                      disabled={isVerified}
                    />
                  </div>
                  
                  {!isVerified ? (
                    <Button 
                      className="w-full bg-[#e2136e] hover:bg-[#b80f58] text-white shadow-lg shadow-pink-500/25 h-12 sm:h-14 rounded-xl sm:rounded-2xl" 
                      onClick={handleVerify}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifying Transaction...' : 'Verify bKash Payment'}
                    </Button>
                  ) : (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl sm:rounded-2xl border border-green-100 flex items-center justify-center font-bold">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      Payment Verified
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl sm:rounded-[2rem]">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Standard address form would go here */}
                <p className="text-sm text-slate-500 bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center">Address form placeholder...</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 mb-6 lg:mb-0">
            <Card className="sticky top-24 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
              <CardHeader className="pb-4">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      <img src="https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=300&q=80" alt="Fan" className="h-full w-full object-cover" crossOrigin="anonymous" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 leading-tight">Vision 56" Ceiling Fan</span>
                  </div>
                  <span className="font-bold text-slate-900">৳3,500</span>
                </div>
                <div className="space-y-3 px-2">
                  <div className="flex justify-between text-sm text-slate-600 font-medium">
                    <span>Delivery Charge</span>
                    <span className="text-slate-900">৳120</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-800">
                    <span>Total</span>
                    <span>৳3,620</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50/50 p-2 rounded-lg">
                    <span>Advance Paid</span>
                    <span>- ৳70</span>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 px-2 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Due on Delivery</span>
                  <span className="font-black text-xl sm:text-2xl text-blue-600">৳3,550</span>
                </div>

                <Button 
                  className="w-full mt-6 sm:mt-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg shadow-blue-500/20" 
                  size="lg" 
                  disabled={!isVerified}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
