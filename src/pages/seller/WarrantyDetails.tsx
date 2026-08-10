"use client";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGetSellerWarrantyDetailsQuery } from "@/lib/redux/features/seller/sellerApi";
import {
  ShieldCheck,
  ArrowLeft,
  User,
  Package,
  Calendar,
  Award,
  Wrench,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function SellerWarrantyDetailsPage() {
  const { id: any } = useParams<{ id: string }>();
  const { data: warranty, isLoading } = useGetSellerWarrantyDetailsQuery(
    id || "WAR-001",
  );

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/seller/warranties">
            <Button variant="outline" size="sm" className="rounded-xl bg-white">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Warranties
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              🛡️ Warranty Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Digital Guarantee Record #{warranty?.id || id}
            </p>
          </div>
        </div>

        {isLoading || !warranty ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading warranty records...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Overview Box */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-2 border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/30 overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-blue-100 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {warranty.productName}
                    </h2>
                    <p className="font-mono text-sm font-bold text-blue-600 mt-1">
                      Unique ID: {warranty.uniqueId}
                    </p>
                  </div>
                  <Badge
                    variant="success"
                    className="px-4 py-1.5 text-sm font-extrabold rounded-full"
                  >
                    ✅ {warranty.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Customer Name
                    </span>
                    <p className="font-bold text-slate-900 text-sm mt-1">
                      {warranty.customerName}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Start Date
                    </span>
                    <p className="font-mono font-bold text-slate-800 text-sm mt-1">
                      {warranty.startDate}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      End Date
                    </span>
                    <p className="font-mono font-bold text-slate-800 text-sm mt-1">
                      {warranty.endDate}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Days Remaining
                    </span>
                    <p className="font-extrabold text-blue-700 text-sm mt-1">
                      {warranty.daysRemaining} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sale Information Card */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                <Package className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Sale Information
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Sale Date
                    </span>
                    <span className="font-medium text-slate-800 text-sm mt-1 block">
                      {warranty.saleInformation?.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Sale Amount
                    </span>
                    <span className="font-extrabold text-slate-900 text-base mt-1 block">
                      ৳ {warranty.saleInformation?.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Payment Method
                    </span>
                    <span className="font-semibold text-slate-800 text-sm mt-1 block">
                      {warranty.saleInformation?.payment}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claim History Section */}
            <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
                <Wrench className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Claim History
                </h3>
              </div>
              <CardContent className="p-6">
                {!warranty.claimHistory ||
                warranty.claimHistory.length === 0 ? (
                  <p className="text-sm text-slate-500 font-medium py-4 text-center">
                    No warranty claims filed for this product item yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {warranty.claimHistory.map((claim: any, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">
                              Claim #{claim.claimId || i + 1}
                            </span>
                            <Badge
                              variant="success"
                              className="text-[10px] py-0 px-2"
                            >
                              {claim.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            Type: {claim.type} • {claim.notes}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-600">
                          {claim.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="pt-2">
              <Link href="/seller/warranties">
                <Button variant="outline" className="rounded-xl bg-white">
                  ← Back to Warranties
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
