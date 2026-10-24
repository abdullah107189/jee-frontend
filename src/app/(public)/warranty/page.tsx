"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { checkWarrantyAction } from "@/actions/warranty.actions";
import type { PublicWarrantyCheckResult } from "@/lib/types/warranty.types";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Clock,
  Calendar,
  Layers,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

function WarrantyTrackerContent() {
  const searchParams = useSearchParams();
  const serialParam = searchParams.get("serial");

  const [serialNumber, setSerialNumber] = useState(
    serialParam ? serialParam.trim().toUpperCase() : "",
  );
  const [data, setData] = useState<PublicWarrantyCheckResult | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [searchedSerial, setSearchedSerial] = useState("");
  const [notFoundError, setNotFoundError] = useState<string | null>(null);

  const executeLookup = async (rawQuery: string) => {
    const query = rawQuery.trim().toUpperCase();
    if (!query) {
      toast.error("Please enter a serial number to check.");
      return;
    }

    try {
      setIsFetching(true);
      setNotFoundError(null);
      setSearchedSerial(query);

      const res = await checkWarrantyAction(query);

      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(null);
        setNotFoundError(
          res.message || "No warranty record found for this serial number.",
        );
      }
    } catch {
      setData(null);
      setNotFoundError("Could not connect to the server. Please try again.");
      toast.error("Network error. Could not verify warranty.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await executeLookup(serialNumber);
  };

  useEffect(() => {
    if (serialParam && serialParam.trim()) {
      const cleanParam = serialParam.trim().toUpperCase();
      setSerialNumber(cleanParam);
      executeLookup(cleanParam);
    }
  }, [serialParam]);

  const calculateDaysRemaining = (endDateStr: string) => {
    const end = new Date(endDateStr).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <section className="section-padding max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4" />
          Official Warranty Verification
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Warranty Tracker
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
          Enter your product serial number to verify active warranty coverage,
          terms, and validity duration.
        </p>
      </div>

      {/* Search Input Card */}
      <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                placeholder="Enter Serial Number (e.g. FAN-001-A)"
                className="pl-11 h-12 text-sm sm:text-base font-mono uppercase bg-slate-50/80 rounded-xl border-slate-200 focus:bg-white"
              />
            </div>
            <Button
              type="submit"
              disabled={isFetching}
              className="h-12 px-6 sm:px-8 text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/20 font-semibold"
            >
              {isFetching ? "Checking..." : "Verify Warranty"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Not Found Error Alert */}
      {notFoundError && (
        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-3">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-red-900">
            Warranty Not Found
          </h3>
          <p className="mt-1 text-sm text-red-700 max-w-md mx-auto">
            No warranty record exists for serial number{" "}
            <span className="font-mono font-bold">{searchedSerial}</span>.
          </p>
          <p className="mt-2 text-xs text-red-600/80">
            Please double check the serial number printed on the product label or purchase invoice.
          </p>
        </div>
      )}

      {/* Results Card */}
      {data && (
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400">
          {/* Header info */}
          <div className="border-b border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                Product Warranty Status
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {data.productName}
              </h2>
              {data.variantAttributes && Object.keys(data.variantAttributes).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(data.variantAttributes).map(([k, v]) => (
                    <span
                      key={k}
                      className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize"
                    >
                      {k}: {String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              {data.effectiveStatus === "ACTIVE" ? (
                <Badge
                  variant="success"
                  className="text-sm px-4 py-1.5 rounded-xl gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Active Warranty
                </Badge>
              ) : data.effectiveStatus === "EXPIRED" ? (
                <Badge
                  variant="outline"
                  className="text-sm px-4 py-1.5 rounded-xl gap-1.5 border-slate-300 text-slate-600"
                >
                  <Clock className="h-4 w-4" />
                  Expired
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="text-sm px-4 py-1.5 rounded-xl gap-1.5"
                >
                  <ShieldX className="h-4 w-4" />
                  {data.effectiveStatus}
                </Badge>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Serial */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Layers className="h-3.5 w-3.5" />
                  Serial Number
                </div>
                <p className="font-mono text-base font-bold text-slate-900">
                  {data.serialNumber || searchedSerial}
                </p>
              </div>

              {/* Start Date */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Start Date
                </div>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {new Date(data.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* End Date */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Expiration Date
                </div>
                <p className="text-base font-bold text-slate-900 tabular-nums">
                  {new Date(data.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Status Banner */}
            {data.effectiveStatus === "ACTIVE" ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-blue-900 text-sm sm:text-base">
                    Coverage Active · {calculateDaysRemaining(data.endDate)} days remaining
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700/80 font-medium">
                    This unit is fully covered under the manufacturer warranty terms.
                  </p>
                </div>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-blue-700 border-blue-200 hover:bg-blue-50 rounded-xl shadow-sm text-xs sm:text-sm h-10 px-4"
                  >
                    Login to Claim
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                <p className="font-bold text-slate-800">
                  Warranty period has concluded.
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  For servicing and repairs outside warranty coverage, please contact customer support.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Helpful Info Tip */}
      <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 border border-slate-100 p-4 text-xs text-slate-500">
        <HelpCircle className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
        <span>
          Serial numbers are usually located on the back or bottom sticker of the device, or indicated on your purchase receipt or warranty slip.
        </span>
      </div>
    </section>
  );
}

function WarrantyTrackerSkeleton() {
  return (
    <div className="section-padding max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      <div className="text-center space-y-3">
        <div className="h-6 w-40 mx-auto rounded-full bg-slate-100" />
        <div className="h-9 w-64 mx-auto rounded-xl bg-slate-100" />
        <div className="h-4 w-96 max-w-full mx-auto rounded bg-slate-100" />
      </div>
      <div className="h-24 rounded-2xl bg-slate-100" />
    </div>
  );
}

export default function WarrantyCheckPage() {
  return (
    <main className="mxw">
      <Suspense fallback={<WarrantyTrackerSkeleton />}>
        <WarrantyTrackerContent />
      </Suspense>
    </main>
  );
}
