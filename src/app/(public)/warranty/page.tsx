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
import { QrCameraScanner } from "@/components/modules/admin/orders/QrCameraScanner";
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
  Camera,
  CheckCircle2,
  Sparkles,
  Package,
  Barcode,
  Info,
  Copy,
  Check,
  FileText,
  BadgeCheck,
  ShoppingCart,
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
  const [scannerOpen, setScannerOpen] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);

  const executeLookup = async (rawQuery: string) => {
    const query = rawQuery.trim().toUpperCase();
    if (!query) {
      toast.error("Please enter a serial number to verify.");
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
          res.message || "No warranty or product item record found for this serial number.",
        );
      }
    } catch {
      setData(null);
      setNotFoundError("Could not connect to the verification server. Please try again.");
      toast.error("Network error. Could not verify warranty.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await executeLookup(serialNumber);
  };

  const handleCameraScanSuccess = (scannedSerial: string) => {
    setScannerOpen(false);
    const clean = scannedSerial.trim().toUpperCase();
    setSerialNumber(clean);
    executeLookup(clean);
    toast.success(`Serial ${clean} scanned successfully!`);
  };

  const handleCopySerial = (sn: string) => {
    navigator.clipboard.writeText(sn);
    setCopiedSerial(true);
    toast.success("Serial number copied to clipboard!");
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  useEffect(() => {
    if (serialParam && serialParam.trim()) {
      const cleanParam = serialParam.trim().toUpperCase();
      setSerialNumber(cleanParam);
      executeLookup(cleanParam);
    }
  }, [serialParam]);

  const calculateDaysRemaining = (endDateStr?: string | null) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isUnsoldItem = data && (!data.isSold || data.status === "UNSOLD");

  return (
    <section className="section-padding max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Title & Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          <BadgeCheck className="h-4 w-4" />
          Official JEE Product Authenticity & Warranty Verification
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Warranty & Authenticity Tracker
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-medium">
          Scan the QR code on your product packaging or enter the unique serial number below to verify genuine authenticity and warranty coverage.
        </p>
      </div>

      {/* Search & Camera Scan Bar */}
      <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                placeholder="Enter Serial Number (e.g. JEE-FAN-001)"
                className="pl-11 pr-12 h-12 text-sm sm:text-base font-mono uppercase bg-muted/50 rounded-xl border-border focus:bg-background"
              />
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                title="Scan QR Code with Camera"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition shadow-xs"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="submit"
              disabled={isFetching}
              className="h-12 px-6 sm:px-8 text-sm sm:text-base rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-semibold gap-2"
            >
              {isFetching ? "Verifying..." : "Verify Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Not Found / Unrecognized Serial Alert */}
      {notFoundError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/20 text-destructive mb-3 shadow-sm">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-destructive">
            Unrecognized Serial Number
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            No authorized product or warranty record was found matching serial number{" "}
            <span className="font-mono font-bold bg-destructive/20 text-destructive px-2 py-0.5 rounded">
              {searchedSerial}
            </span>
            .
          </p>
          <div className="mt-4 rounded-xl border border-destructive/20 bg-card p-4 text-xs text-muted-foreground text-left max-w-md mx-auto space-y-1.5">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-destructive" />
              Important Verification Advisory:
            </p>
            <p>• Verify that the serial number matches the printed sticker on your product box.</p>
            <p>• Ensure all letters, hyphens, and digits were entered accurately without spaces.</p>
            <p>• If you purchased this item from an authorized JEE showroom or retailer, please contact our support desk.</p>
          </div>
        </div>
      )}

      {/* Case A: UNSOLD / In-Stock Genuine Product Item */}
      {data && isUnsoldItem && (
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400">
          {/* Header */}
          <div className="border-b border-border p-6 sm:p-8 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700">
                  OFFICIAL GENUINE JEE PRODUCT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {data.productName}
              </h2>
              {data.variantAttributes && Object.keys(data.variantAttributes).length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {Object.entries(data.variantAttributes).map(([k, v]) => (
                    <span
                      key={k}
                      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-card border border-border text-foreground capitalize shadow-2xs"
                    >
                      {k}: {String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Badge
                variant="outline"
                className="text-xs sm:text-sm px-3.5 py-1.5 rounded-xl gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold"
              >
                <Package className="h-4 w-4 text-amber-500" />
                In Stock · Unsold Unit
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Serial Number with Copy */}
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <div className="flex items-center gap-1.5">
                    <Barcode className="h-3.5 w-3.5 text-primary" />
                    <span>Serial Number</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopySerial(data.serialNumber || searchedSerial)}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline lowercase"
                  >
                    {copiedSerial ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-base font-extrabold text-foreground select-all">
                  {data.serialNumber || searchedSerial}
                </p>
              </div>

              {/* SKU */}
              {data.sku && (
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    Model SKU
                  </div>
                  <p className="font-mono text-base font-bold text-foreground">
                    {data.sku}
                  </p>
                </div>
              )}

              {/* Warranty Coverage Duration */}
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Official Warranty Term
                </div>
                <p className="text-base font-extrabold text-emerald-600">
                  {data.warrantyMonths || 24} Months Coverage
                </p>
              </div>
            </div>

            {/* Unsold Guidance Banner */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
                <h4 className="font-bold text-foreground text-sm sm:text-base">
                  Warranty Activation Policy
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                This unit is a brand-new, factory-certified authentic JEE product currently in authorized stock. Official <strong>{data.warrantyMonths || 24}-Month Manufacturer Warranty</strong> will automatically activate from the date of purchase upon showroom sale or online delivery.
              </p>
            </div>

            {/* Warranty Terms Card */}
            {data.warrantyTerms && (
              <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Warranty Terms & Coverage</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.warrantyTerms}
                </p>
              </div>
            )}

            {/* Quick POS Offline Sale CTA for showroom sellers */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Showroom Seller? Open POS to sell this verified authentic unit.</span>
              </div>
              <Link
                href={`/seller/sales/new?serial=${encodeURIComponent(data.serialNumber || "")}`}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md shadow-blue-500/20">
                  <ShoppingCart className="h-4 w-4" />
                  ⚡ Sell this Unit (Open POS)
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Case B: SOLD Product Warranty (ACTIVE / EXPIRED / VOID) */}
      {data && !isUnsoldItem && (
        <Card className="rounded-2xl sm:rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400">
          {/* Header */}
          <div className="border-b border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                Product Warranty Details
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {data.productName}
              </h2>
              {data.variantAttributes && Object.keys(data.variantAttributes).length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {Object.entries(data.variantAttributes).map(([k, v]) => (
                    <span
                      key={k}
                      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-card border border-border text-foreground capitalize"
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
                  className="text-sm px-4 py-1.5 rounded-xl gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Active Warranty
                </Badge>
              ) : data.effectiveStatus === "EXPIRED" ? (
                <Badge
                  variant="outline"
                  className="text-sm px-4 py-1.5 rounded-xl gap-1.5 border-border text-muted-foreground"
                >
                  <Clock className="h-4 w-4" />
                  Warranty Expired
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
              {/* Serial Number with Copy */}
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <div className="flex items-center gap-1.5">
                    <Barcode className="h-3.5 w-3.5 text-primary" />
                    <span>Serial Number</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopySerial(data.serialNumber || searchedSerial)}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline lowercase"
                  >
                    {copiedSerial ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-base font-extrabold text-foreground select-all">
                  {data.serialNumber || searchedSerial}
                </p>
              </div>

              {/* Start Date */}
              {data.startDate && (
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Purchase / Start Date
                  </div>
                  <p className="text-base font-bold text-foreground tabular-nums">
                    {new Date(data.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* End Date */}
              {data.endDate && (
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Expiration Date
                  </div>
                  <p className="text-base font-bold text-foreground tabular-nums">
                    {new Date(data.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Coverage Status Banner */}
            {data.effectiveStatus === "ACTIVE" ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground text-sm sm:text-base">
                    Warranty Coverage Active · {calculateDaysRemaining(data.endDate)} days remaining
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    This unit is fully protected under official manufacturer warranty conditions.
                  </p>
                </div>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-card text-foreground border-border hover:bg-accent rounded-xl shadow-xs text-xs sm:text-sm h-10 px-4 font-semibold"
                  >
                    Login to File Claim
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                <p className="font-bold text-foreground">
                  Official warranty period has concluded.
                </p>
                <p className="text-xs mt-0.5">
                  For maintenance, servicing, or spare parts, please contact authorized JEE service centers.
                </p>
              </div>
            )}

            {/* Warranty Terms Card */}
            {data.warrantyTerms && (
              <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Coverage Terms & Policies</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.warrantyTerms}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Helpful Information Note */}
      <div className="flex items-start gap-3 rounded-2xl bg-muted/40 border border-border p-4 text-xs text-muted-foreground">
        <HelpCircle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
        <span>
          Serial numbers are printed on the barcode sticker attached to your product packaging or indicated on your purchase invoice. You can scan it directly using the Camera button above.
        </span>
      </div>

      {/* Camera QR Scanner Modal */}
      <QrCameraScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScanSuccess={handleCameraScanSuccess}
        title="Scan QR Code from Product Label"
      />
    </section>
  );
}

function WarrantyTrackerSkeleton() {
  return (
    <div className="section-padding max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      <div className="text-center space-y-3">
        <div className="h-6 w-40 mx-auto rounded-full bg-muted" />
        <div className="h-9 w-64 mx-auto rounded-xl bg-muted" />
        <div className="h-4 w-96 max-w-full mx-auto rounded bg-muted" />
      </div>
      <div className="h-24 rounded-2xl bg-muted" />
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
