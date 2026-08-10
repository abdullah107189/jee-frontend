"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGetTransactionDetailsQuery } from "@/lib/redux/features/seller/sellerApi";
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  User,
  Receipt,
  CreditCard,
  Calendar,
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SellerSaleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: sale, isLoading } = useGetTransactionDetailsQuery(
    id || "SALE-001",
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/seller/sales">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl bg-white"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sales
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Sale Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Transaction #{sale?.id || id}
              </p>
            </div>
          </div>
          <Button
            onClick={handlePrint}
            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20"
          >
            <Printer className="mr-2 h-5 w-5" /> 🖨️ Print Invoice
          </Button>
        </div>

        {isLoading || !sale ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading sale transaction details...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sale Information Card */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Sale Information
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Sale ID
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-base mt-1 block">
                      {sale.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Date & Time
                    </span>
                    <span className="font-medium text-slate-800 text-sm mt-1 block">
                      {sale.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Product Name
                    </span>
                    <span className="font-bold text-slate-900 text-base mt-1 block">
                      {sale.product}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Unique ID
                    </span>
                    <span className="font-mono font-extrabold text-blue-600 text-base mt-1 block">
                      {sale.uniqueId}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Total Amount
                    </span>
                    <span className="font-extrabold text-slate-900 text-lg mt-1 block">
                      ৳ {sale.price?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Payment Method
                    </span>
                    <span className="font-semibold text-slate-800 text-sm mt-1 block">
                      {sale.paymentMethod}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Card */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
                <User className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Customer Information
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Customer Name
                    </span>
                    <span className="font-bold text-slate-900 text-base mt-1 block">
                      {sale.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Phone Number
                    </span>
                    <span className="font-mono font-semibold text-slate-800 text-sm mt-1 block">
                      {sale.customerPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Email Address
                    </span>
                    <span className="font-medium text-slate-700 text-sm mt-1 block">
                      {sale.customerEmail || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warranty Details Card */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-2 border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-blue-100 bg-blue-500/10 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                  <h3 className="text-base font-extrabold text-blue-950">
                    🛡️ Warranty Details
                  </h3>
                </div>
                <Badge
                  variant="success"
                  className="px-3 py-1 text-xs font-bold rounded-full"
                >
                  ✅ Active
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Status
                    </span>
                    <span className="font-bold text-emerald-600 text-base mt-1 block">
                      ✅ Active
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Start Date
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-1 block">
                      {sale.warrantyDetails?.startDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      End Date
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-1 block">
                      {sale.warrantyDetails?.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Days Remaining
                    </span>
                    <span className="font-extrabold text-blue-700 text-base mt-1 block">
                      {sale.warrantyDetails?.daysRemaining} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center pt-4">
              <Link href="/seller/sales">
                <Button variant="outline" className="rounded-xl bg-white">
                  ← Back to Sales
                </Button>
              </Link>
              <Button
                onClick={handlePrint}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Printer className="mr-2 h-4 w-4" /> 🖨️ Print Invoice
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
