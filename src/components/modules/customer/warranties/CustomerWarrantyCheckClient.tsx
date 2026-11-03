"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { checkWarrantyAction } from "@/actions/warranty.actions";
import type { PublicWarrantyCheckResult } from "@/lib/types/warranty.types";
import { QrCameraScanner } from "@/components/modules/admin/orders/QrCameraScanner";
import { formatAppDate } from "@/lib/utils";
import {
  Search,
  Camera,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  Calendar,
  Layers,
  Copy,
  Check,
  Package,
  Barcode,
  ArrowRight,
  FileText,
  BadgeCheck,
  Info,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialSerial?: string;
}

export function CustomerWarrantyCheckClient({ initialSerial = "" }: Props) {
  const [serialNumber, setSerialNumber] = useState(initialSerial.trim().toUpperCase());
  const [data, setData] = useState<PublicWarrantyCheckResult | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [searchedSerial, setSearchedSerial] = useState("");
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Ticking effect for live countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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
          res.message || "No authorized warranty or product record found for this serial number."
        );
      }
    } catch {
      setData(null);
      setNotFoundError("Could not connect to the verification service. Please try again.");
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
    if (initialSerial && initialSerial.trim()) {
      const clean = initialSerial.trim().toUpperCase();
      setSerialNumber(clean);
      executeLookup(clean);
    }
  }, [initialSerial]);

  // Precise live countdown
  const getCountdown = (endDateStr?: string | null) => {
    if (!endDateStr) return null;
    const end = new Date(endDateStr).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isExpired: false };
  };

  // Progress percentage calculation
  const getProgressPercent = (startStr?: string | null, endStr?: string | null) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    const total = end - start;
    if (total <= 0) return 0;
    const elapsed = now - start;
    const remaining = end - now;
    if (remaining <= 0) return 0;
    const pct = Math.min(100, Math.max(0, (remaining / total) * 100));
    return Math.round(pct);
  };

  const isUnsoldItem = data && (!data.isSold || data.status === "UNSOLD");
  const countdown = data ? getCountdown(data.endDate) : null;
  const progressPercent = data ? getProgressPercent(data.startDate, data.endDate) : 0;
  const primaryImage = data?.images && data.images.length > 0 ? data.images[0] : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Customer Warranty Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Verify Product Warranty
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Verify authentic coverage, check remaining days, and file claims for any JEE device.
          </p>
        </div>

        <Link href="/customer/warranties">
          <Button variant="outline" className="h-10 px-4 rounded-xl text-xs font-bold gap-2">
            View My Warranties
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Verification Input Box */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                placeholder="Enter Serial Number (e.g. CF-BLU-1FZ7V1-0004)"
                className="pl-11 pr-12 h-12 text-sm sm:text-base font-mono uppercase bg-muted/40 rounded-xl border-border focus:bg-background"
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
              className="h-12 px-6 sm:px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-xs"
            >
              {isFetching ? "Checking..." : "Verify Serial"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Not Found Alert */}
      {notFoundError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/20 text-destructive mb-3 shadow-2xs">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-destructive">
            Serial Number Not Found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            No warranty or product item record matches{" "}
            <span className="font-mono font-bold bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
              {searchedSerial}
            </span>
            .
          </p>
          <div className="mt-4 rounded-xl border border-destructive/20 bg-card p-3.5 text-xs text-muted-foreground text-left max-w-md mx-auto space-y-1">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-destructive" />
              Verification Tips:
            </p>
            <p>• Verify letters, hyphens and numbers on your package barcode.</p>
            <p>• Make sure there are no accidental spaces.</p>
          </div>
        </div>
      )}

      {/* Verified Result Card */}
      {data && (
        <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden animate-in fade-in duration-300">
          {/* Card Banner Header */}
          <div className="border-b border-border p-5 sm:p-6 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    Certified Genuine Hardware
                  </span>
                  {data.brandName && (
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      • {data.brandName}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {data.productName}
                </h2>
              </div>
            </div>

            <div>
              {isUnsoldItem ? (
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 rounded-xl gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-xs"
                >
                  <Package className="h-3.5 w-3.5" />
                  In Stock · Unsold Unit
                </Badge>
              ) : data.effectiveStatus === "ACTIVE" ? (
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 rounded-xl gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Active Warranty
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 rounded-xl gap-1.5 bg-destructive/10 text-destructive border-destructive/20 font-bold text-xs"
                >
                  <ShieldX className="h-3.5 w-3.5" />
                  Warranty {data.effectiveStatus}
                </Badge>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Top Grid: Product Showcase & Serial */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Product Thumbnail / Image */}
              <div className="md:col-span-4 rounded-xl border border-border bg-muted/20 p-4 flex flex-col items-center justify-center text-center">
                <div className="relative w-full aspect-square max-w-[200px] rounded-lg overflow-hidden bg-background border border-border flex items-center justify-center mb-3">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={data.productName}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  ) : (
                    <Package className="h-14 w-14 text-muted-foreground/40" />
                  )}
                </div>
                <p className="text-xs font-bold text-foreground truncate max-w-full">
                  {data.productName}
                </p>
                {data.categoryName && (
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {data.categoryName}
                  </p>
                )}
                {data.sku && (
                  <span className="mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    SKU: {data.sku}
                  </span>
                )}
              </div>

              {/* Specs & Attributes */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Serial with Copy */}
                  <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span className="flex items-center gap-1.5">
                        <Barcode className="h-3.5 w-3.5 text-primary" />
                        Serial Number
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopySerial(data.serialNumber || searchedSerial)}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        {copiedSerial ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-sm sm:text-base font-extrabold text-foreground select-all">
                      {data.serialNumber || searchedSerial}
                    </p>
                  </div>

                  {/* Coverage Duration */}
                  <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Warranty Coverage Term
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-foreground">
                      {data.warrantyMonths || 24} Months Official
                    </p>
                  </div>
                </div>

                {/* Variant Attributes Tags */}
                {data.variantAttributes && Object.keys(data.variantAttributes).length > 0 && (
                  <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Product Specifications
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(data.variantAttributes).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-background border border-border text-foreground capitalize"
                        >
                          <span className="text-muted-foreground mr-1">{k}:</span>
                          {String(v)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates Grid if sold */}
                {!isUnsoldItem && (data.startDate || data.endDate) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Purchase / Start Date
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {formatAppDate(data.startDate)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Expiration Date
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {formatAppDate(data.endDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Countdown & Progress Bar for ACTIVE */}
            {!isUnsoldItem && data.effectiveStatus === "ACTIVE" && countdown && !countdown.isExpired && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        Active Coverage Countdown
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Live remaining protection period under manufacturer terms.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">
                      {progressPercent}% Remaining
                    </span>
                  </div>
                </div>

                {/* Ticking Ticker Numbers */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-background border border-border p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-foreground font-mono">
                      {countdown.days}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Days
                    </div>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-foreground font-mono">
                      {String(countdown.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Hours
                    </div>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-foreground font-mono">
                      {String(countdown.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Mins
                    </div>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                      {String(countdown.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Secs
                    </div>
                  </div>
                </div>

                {/* Visual Progress Meter */}
                <div className="space-y-1.5 pt-1">
                  <Progress value={progressPercent} className="h-2" />
                  <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                    <span>Started: {formatAppDate(data.startDate)}</span>
                    <span>Expires: {formatAppDate(data.endDate)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Unsold Guidance Banner */}
            {isUnsoldItem && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0" />
                  <h4 className="font-bold text-foreground text-sm sm:text-base">
                    Authorized In-Stock Authentic Unit
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  This serial is an authentic, brand-new product currently registered in JEE inventory. Official <strong>{data.warrantyMonths || 24}-Month Manufacturer Warranty</strong> activates automatically upon retail delivery or showroom sale.
                </p>
              </div>
            )}

            {/* Warranty Terms Card */}
            {data.warrantyTerms && (
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Coverage Terms & Conditions</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.warrantyTerms}
                </p>
              </div>
            )}

            {/* Direct Dashboard Action Links */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Need service or repair assistance for this product?
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link href="/customer/warranties" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full h-10 px-4 rounded-xl text-xs font-bold">
                    My Warranties
                  </Button>
                </Link>
                <Link href="/customer/profile" className="flex-1 sm:flex-none">
                  <Button className="w-full h-10 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-xs">
                    Support Desk
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* QR Camera Scanner Modal */}
      <QrCameraScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScanSuccess={handleCameraScanSuccess}
        title="Scan Product QR Code"
      />
    </div>
  );
}

