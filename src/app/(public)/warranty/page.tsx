"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  CheckCircle,
  ExternalLink,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

function WarrantyTrackerContent() {
  const searchParams = useSearchParams();
  const serialParam = searchParams.get("serial") || searchParams.get("id");

  const [serialNumber, setSerialNumber] = useState(
    serialParam ? serialParam.trim().toUpperCase() : "",
  );
  const [data, setData] = useState<PublicWarrantyCheckResult | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [searchedSerial, setSearchedSerial] = useState("");
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [now, setNow] = useState(Date.now());

  // Live ticking timer for precise countdown
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
      setSelectedImageIndex(0);

      const res = await checkWarrantyAction(query);

      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(null);
        setNotFoundError(
          res.message || "No authorized warranty or genuine product item was found matching this serial number.",
        );
      }
    } catch {
      setData(null);
      setNotFoundError("Could not connect to the verification network. Please check your connection and retry.");
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

  // Live countdown calculation
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
    const remaining = end - now;
    if (remaining <= 0) return 0;
    const pct = Math.min(100, Math.max(0, (remaining / total) * 100));
    return Math.round(pct);
  };

  const isUnsoldItem = data && (!data.isSold || data.status === "UNSOLD");
  const countdown = data ? getCountdown(data.endDate) : null;
  const progressPercent = data ? getProgressPercent(data.startDate, data.endDate) : 0;
  const images = data?.images && data.images.length > 0 ? data.images : [];
  const activeImage = images[selectedImageIndex] || images[0] || null;

  return (
    <section className="section-padding max-w-6xl mx-auto space-y-6 sm:space-y-8 px-4">
      {/* Hero Header */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary typo-badge shadow-2xs">
          <BadgeCheck className="h-4 w-4 text-primary" />
          Official JEE Product Authenticity & Digital Warranty
        </div>
        <h1 className="typo-h1 text-foreground">
          Product Authenticity & Warranty Tracker
        </h1>
        <p className="typo-lead">
          Scan the QR code on your product box or enter the serial number below to verify genuine factory authenticity and view live warranty protection.
        </p>
      </div>

      {/* Search & Camera Scan Bar */}
      <Card className="rounded-2xl sm:rounded-3xl border-border bg-card shadow-sm overflow-hidden max-w-3xl mx-auto">
        <CardContent className="p-3.5 sm:p-5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
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
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition shadow-2xs"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <Button
              type="submit"
              disabled={isFetching}
              className="h-12 px-6 sm:px-8 text-sm sm:text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 shadow-xs"
            >
              {isFetching ? "Verifying..." : "Verify Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Unrecognized Serial Error Alert */}
      {notFoundError && (
        <div className="rounded-2xl sm:rounded-3xl border border-destructive/20 bg-destructive/10 p-6 sm:p-8 text-center animate-in fade-in duration-300 max-w-3xl mx-auto space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/20 text-destructive shadow-sm">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-destructive">
              Unrecognized Serial Number
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No genuine JEE record was found matching serial{" "}
              <span className="font-mono font-bold bg-destructive/20 text-destructive px-2 py-0.5 rounded">
                {searchedSerial}
              </span>
              .
            </p>
          </div>
          <div className="rounded-xl border border-destructive/20 bg-card p-4 text-xs text-muted-foreground text-left max-w-md mx-auto space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-destructive" />
              Authenticity Advisory:
            </p>
            <p>• Verify the serial number against the printed sticker on your product gift box.</p>
            <p>• Make sure all characters, hyphens and digits are entered without extra spaces.</p>
            <p>• If you purchased this device from an authorized showroom, please contact our helpline.</p>
          </div>
        </div>
      )}

      {/* Verified Product Showcase (2-Column Responsive Layout) */}
      {data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-400 space-y-6">
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Visual Product Showcase (Desktop 5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="rounded-2xl sm:rounded-3xl border-border bg-card shadow-sm overflow-hidden">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  {/* Genuine Certification Header Seal */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        Certified Genuine Product
                      </span>
                    </div>
                    {data.brandName && (
                      <Badge variant="outline" className="text-xs font-bold border-border bg-muted/40">
                        {data.brandName}
                      </Badge>
                    )}
                  </div>

                  {/* Primary Product Image Frame */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted/20 border border-border flex items-center justify-center group">
                    {activeImage ? (
                      <Image
                        src={activeImage}
                        alt={data.productName}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 420px"
                        priority
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground/50 space-y-2">
                        <Package className="h-16 w-16" />
                        <span className="text-xs font-medium">JEE Certified Product Item</span>
                      </div>
                    )}

                    {/* Authenticity Watermark Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-md border border-border text-[11px] font-bold text-foreground shadow-xs flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Factory Sealed</span>
                    </div>
                  </div>

                  {/* Thumbnail Row if Multiple Images */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                            selectedImageIndex === idx
                              ? "border-primary shadow-xs"
                              : "border-border hover:border-muted-foreground/40"
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product Title and Category */}
                  <div className="space-y-1 pt-1">
                    <h2 className="text-lg sm:text-xl font-extrabold text-foreground leading-snug">
                      {data.productName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {data.categoryName && (
                        <span>Category: <strong className="text-foreground">{data.categoryName}</strong></span>
                      )}
                      {data.sku && (
                        <>
                          <span>•</span>
                          <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px] font-semibold text-foreground">
                            SKU: {data.sku}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Variant Specifications */}
                  {data.variantAttributes && Object.keys(data.variantAttributes).length > 0 && (
                    <div className="pt-2 border-t border-border space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Hardware Specifications
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(data.variantAttributes).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted/40 border border-border text-foreground capitalize"
                          >
                            <span className="text-muted-foreground mr-1">{k}:</span>
                            {String(v)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Manufacturing & Authenticity Seal */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>Factory Database Verified</span>
                </div>
                {data.manufacturedAt && (
                  <span className="text-[11px] font-medium">
                    Mfg: {formatAppDate(data.manufacturedAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Warranty Certificate & Live Countdown (Desktop 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="rounded-2xl sm:rounded-3xl border-border bg-card shadow-sm overflow-hidden">
                {/* Certificate Top Banner */}
                <div className="border-b border-border p-5 sm:p-6 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">
                      Digital Warranty Certificate
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Official Protection Record
                    </h3>
                  </div>

                  <div>
                    {isUnsoldItem ? (
                      <Badge
                        variant="outline"
                        className="px-3.5 py-1.5 rounded-xl gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-xs"
                      >
                        <Package className="h-3.5 w-3.5" />
                        In-Stock Authentic Unit
                      </Badge>
                    ) : data.effectiveStatus === "ACTIVE" ? (
                      <Badge
                        variant="outline"
                        className="px-3.5 py-1.5 rounded-xl gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs shadow-2xs"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Active Warranty Protection
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="px-3.5 py-1.5 rounded-xl gap-1.5 bg-destructive/10 text-destructive border-destructive/20 font-bold text-xs"
                      >
                        <ShieldX className="h-3.5 w-3.5" />
                        Warranty {data.effectiveStatus}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* Serial Number & Term Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Serial with 1-Click Copy */}
                    <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span className="flex items-center gap-1.5">
                          <Barcode className="h-3.5 w-3.5 text-primary" />
                          Verified Serial Number
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
                      <p className="font-mono text-base font-black text-foreground select-all">
                        {data.serialNumber || searchedSerial}
                      </p>
                    </div>

                    {/* Official Duration */}
                    <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Official Coverage Term
                      </div>
                      <p className="text-base font-black text-emerald-600">
                        {data.warrantyMonths || 24} Months Manufacturer Warranty
                      </p>
                    </div>
                  </div>

                  {/* Dates Grid if Sold Item */}
                  {!isUnsoldItem && (data.startDate || data.endDate) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          Registration / Start Date
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          {formatAppDate(data.startDate)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          Official Expiration Date
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          {formatAppDate(data.endDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Live Visual Countdown Timer for ACTIVE Coverage */}
                  {!isUnsoldItem && data.effectiveStatus === "ACTIVE" && countdown && !countdown.isExpired && (
                    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
                          <h4 className="font-extrabold text-foreground text-sm sm:text-base">
                            Live Remaining Coverage Countdown
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                          {progressPercent}% Period Left
                        </span>
                      </div>

                      {/* Ticking Ticker Boxes */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="rounded-xl bg-background border border-border p-3 shadow-2xs">
                          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                            {countdown.days}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                            Days
                          </div>
                        </div>
                        <div className="rounded-xl bg-background border border-border p-3 shadow-2xs">
                          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                            {String(countdown.hours).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                            Hours
                          </div>
                        </div>
                        <div className="rounded-xl bg-background border border-border p-3 shadow-2xs">
                          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                            {String(countdown.minutes).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                            Minutes
                          </div>
                        </div>
                        <div className="rounded-xl bg-background border border-border p-3 shadow-2xs">
                          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                            {String(countdown.seconds).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                            Seconds
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar & Subtitle */}
                      <div className="space-y-1.5 pt-1">
                        <Progress value={progressPercent} className="h-2" />
                        <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                          <span>Valid From: {formatAppDate(data.startDate)}</span>
                          <span>Expires On: {formatAppDate(data.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Case: UNSOLD In-Stock Genuine Unit Advisory */}
                  {isUnsoldItem && (
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-600 shrink-0" />
                        <h4 className="font-extrabold text-foreground text-sm sm:text-base">
                          Authorized In-Stock Authentic Unit
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        This unit is a brand-new, factory-sealed authentic JEE device currently held in authorized inventory. The official <strong>{data.warrantyMonths || 24}-Month Manufacturer Warranty</strong> activates automatically on the date of retail purchase or delivery.
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-500/15">
                        <span className="text-xs text-muted-foreground">
                          Authorized Showroom or POS Dealer?
                        </span>
                        <Link
                          href={`/seller/sales/new?serial=${encodeURIComponent(data.serialNumber || "")}`}
                          className="w-full sm:w-auto"
                        >
                          <Button className="w-full sm:w-auto h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold gap-2 shadow-xs">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Open POS & Sell This Unit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Case: EXPIRED Coverage Notice */}
                  {!isUnsoldItem && data.effectiveStatus === "EXPIRED" && (
                    <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-2">
                      <p className="font-bold text-foreground text-sm">
                        Standard Manufacturer Warranty Period Has Concluded
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Official coverage expired on {formatAppDate(data.endDate)}. For authorized servicing, certified maintenance or genuine spare parts replacement, contact our customer support center.
                      </p>
                    </div>
                  )}

                  {/* Warranty Terms & Conditions Policy */}
                  {data.warrantyTerms && (
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Coverage Terms & Policy</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                        {data.warrantyTerms}
                      </p>
                    </div>
                  )}

                  {/* Customer Actions & Support Hotline */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <PhoneCall className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Helpline: +880 9612-345678 (9 AM - 9 PM)</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link
                        href={`/customer/warranties/check?serial=${encodeURIComponent(data.serialNumber || "")}`}
                        className="flex-1 sm:flex-none"
                      >
                        <Button variant="outline" className="w-full h-10 px-4 rounded-xl text-xs font-bold gap-1.5">
                          Customer Dashboard
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href="/login" className="flex-1 sm:flex-none">
                        <Button className="w-full h-10 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-xs">
                          File Claim
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Instructions Card */}
      <div className="flex items-start gap-3 rounded-2xl bg-muted/30 border border-border p-4 text-xs text-muted-foreground max-w-3xl mx-auto">
        <HelpCircle className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
        <span>
          Serial numbers are printed on the barcode label attached to the product packaging box and stated on your official invoice. You can scan it instantly with the camera button above.
        </span>
      </div>

      {/* Camera QR Scanner Dialog */}
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
    <div className="section-padding max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-pulse px-4">
      <div className="text-center space-y-3">
        <div className="h-6 w-48 mx-auto rounded-full bg-muted" />
        <div className="h-9 w-72 mx-auto rounded-xl bg-muted" />
        <div className="h-4 w-96 max-w-full mx-auto rounded bg-muted" />
      </div>
      <div className="h-20 rounded-2xl bg-muted" />
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
