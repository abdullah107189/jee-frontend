"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  recordBatchOfflineSalesAction,
  validateProductItemAction,
} from "@/actions/seller.actions";
import { QrCameraScanner } from "@/components/modules/admin/orders/QrCameraScanner";
import { toast } from "sonner";
import {
  Search,
  CheckCircle2,
  Package,
  ShieldCheck,
  Printer,
  List,
  PlusCircle,
  X,
  AlertCircle,
  Camera,
  Trash2,
  Receipt,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Barcode,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ScannedProductItem {
  uniqueId: string;
  id: string;
  productName: string;
  sku?: string;
  price: number;
  warrantyMonths: number;
  variantAttributes?: Record<string, any>;
}

export default function SellerNewSalePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // In-memory sets to guarantee 0 duplicate additions under high-speed scanning
  const scannedSerialsRef = useRef<Set<string>>(new Set());
  const pendingSerialsRef = useRef<Set<string>>(new Set());

  const [inputSerial, setInputSerial] = useState("");
  const [scannedItems, setScannedItems] = useState<ScannedProductItem[]>([]);

  // Optional customer & payment fields
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [overallDiscount, setOverallDiscount] = useState<number | string>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER"
  >("CASH");
  const [notes, setNotes] = useState("");

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Success modal state
  const [successModalData, setSuccessModalData] = useState<{
    invoices: string[];
    items: ScannedProductItem[];
    customerName: string;
    customerPhone: string;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    date: string;
  } | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Focus input automatically for hardware barcode gun
  useEffect(() => {
    inputRef.current?.focus();
  }, [scannedItems.length]);

  /**
   * Add a product item by unique serial number
   * Synchronous duplicate prevention via ref Set
   */
  const handleAddSerial = async (rawSerial: string) => {
    const cleanSerial = rawSerial.trim().toUpperCase();
    if (!cleanSerial) return;

    // 1. Strict duplicate check in ref Set (instant, synchronous)
    if (scannedSerialsRef.current.has(cleanSerial)) {
      toast.warning(`⚠️ Unit ${cleanSerial} is already in the list!`);
      setInputSerial("");
      return;
    }

    // 2. Prevent in-flight race conditions from multi-frame camera scans
    if (pendingSerialsRef.current.has(cleanSerial)) {
      return;
    }
    pendingSerialsRef.current.add(cleanSerial);

    try {
      setIsFetching(true);
      const res = await validateProductItemAction(cleanSerial);

      // Re-verify after async resolution
      if (scannedSerialsRef.current.has(cleanSerial)) {
        pendingSerialsRef.current.delete(cleanSerial);
        return;
      }

      const itemPrice = Number(res?.product?.price || 0);

      const newItem: ScannedProductItem = {
        uniqueId: cleanSerial,
        id: res.id,
        productName: res.product.name,
        sku: res.product.sku,
        price: itemPrice,
        warrantyMonths: res.product.warrantyMonths || 12,
        variantAttributes: res.product.attributes,
      };

      scannedSerialsRef.current.add(cleanSerial);
      pendingSerialsRef.current.delete(cleanSerial);

      setScannedItems((prev) => [newItem, ...prev]);
      setInputSerial("");
      toast.success(
        `✅ Added: ${res.product.name} (৳${itemPrice.toLocaleString()})`
      );
    } catch (err: any) {
      pendingSerialsRef.current.delete(cleanSerial);
      toast.error(
        err?.message ||
          err?.data ||
          `❌ Serial ${cleanSerial} not available or already sold.`
      );
    } finally {
      setIsFetching(false);
      inputRef.current?.focus();
    }
  };

  // Auto-search if serial query parameter is present in URL
  useEffect(() => {
    const serialParam = searchParams.get("serial");
    if (serialParam) {
      handleAddSerial(serialParam);
    }
  }, [searchParams]);

  // Remove an item from the scanned list
  const handleRemoveItem = (uniqueId: string) => {
    scannedSerialsRef.current.delete(uniqueId);
    setScannedItems((prev) =>
      prev.filter((item) => item.uniqueId !== uniqueId)
    );
    toast.info(`Removed ${uniqueId}`);
    inputRef.current?.focus();
  };

  // Calculations
  const subtotal = scannedItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0),
    0
  );
  const discountNum = Math.max(0, Number(overallDiscount) || 0);
  const grandTotal = Math.max(0, subtotal - discountNum);

  // Clear entire POS cart
  const handleClearAll = () => {
    scannedSerialsRef.current.clear();
    pendingSerialsRef.current.clear();
    setScannedItems([]);
    setInputSerial("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setOverallDiscount(0);
    setPaymentMethod("CASH");
    setNotes("");
    inputRef.current?.focus();
  };

  // Complete checkout & record sale
  const handleCompleteSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (scannedItems.length === 0) {
      toast.error("Please scan or enter at least one product item to sell.");
      return;
    }

    // Optional phone validation if entered
    if (customerPhone.trim()) {
      const phoneRegex = /^01[3-9]\d{8}$/;
      if (!phoneRegex.test(customerPhone.trim())) {
        toast.error("Invalid Bangladeshi phone number (e.g. 01712345678)");
        return;
      }
    }

    try {
      setIsRecording(true);

      // Distribute global discount proportionally across items
      const perItemDiscount =
        scannedItems.length > 0
          ? Math.round((discountNum / scannedItems.length) * 100) / 100
          : 0;

      const payload = {
        items: scannedItems.map((item, index) => ({
          serialNumber: item.uniqueId,
          salePrice: item.price,
          discount:
            index === scannedItems.length - 1
              ? Math.max(
                  0,
                  discountNum - perItemDiscount * (scannedItems.length - 1)
                )
              : perItemDiscount,
          tax: 0,
        })),
        customerName: customerName.trim() || "Walk-in Customer",
        customerPhone: customerPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        paymentMethod,
        notes: notes.trim() || undefined,
      };

      const res = await recordBatchOfflineSalesAction(payload);

      toast.success(
        `Sale completed! ${res.recordedCount} item(s) sold & digital warranties activated.`
      );

      if (res.errors && res.errors.length > 0) {
        toast.warning(
          `Notice: ${res.errors.length} item(s) could not be recorded.`
        );
      }

      const invoices = res.results.map(
        (r: any) => r.saleId || r.id || "INV-OFFLINE"
      );

      setSuccessModalData({
        invoices,
        items: [...scannedItems],
        customerName: customerName.trim() || "Walk-in Customer",
        customerPhone: customerPhone.trim() || "—",
        subtotal,
        discount: discountNum,
        total: grandTotal,
        paymentMethod,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to record sale. Please try again.");
    } finally {
      setIsRecording(false);
    }
  };

  const handleStartNextSale = () => {
    setSuccessModalData(null);
    handleClearAll();
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-1 sm:px-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
              ⚡
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Showroom POS Terminal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Fast multi-unit scanner with auto-pricing and instant warranty.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <Badge
            variant="outline"
            className="px-3 py-1 font-mono text-xs rounded-lg border-blue-200 bg-blue-50/60 text-blue-700"
          >
            {scannedItems.length} {scannedItems.length === 1 ? "unit" : "units"}
          </Badge>
          {scannedItems.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="h-8 px-2.5 rounded-xl text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      {/* 1️⃣ Step 1: Scanner Input & Barcode Gun */}
      <Card className="rounded-2xl sm:rounded-3xl border-2 border-blue-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-3.5 sm:p-5">
          <CardTitle className="text-sm sm:text-base flex items-center justify-between text-slate-800">
            <span className="flex items-center gap-2">
              <Barcode className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Scan QR / Barcode
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
              Physical gun or phone camera
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                autoFocus
                value={inputSerial}
                onChange={(e) =>
                  setInputSerial(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
                  )
                }
                placeholder="Scan with barcode gun or type serial (Enter)..."
                className="h-11 sm:h-13 text-sm sm:text-base font-mono font-bold uppercase rounded-xl sm:rounded-2xl border-slate-200 focus:border-blue-600 focus:ring-blue-500/20 pl-3.5"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSerial(inputSerial);
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-2.5">
              {/* Continuous Camera Scanner Button */}
              <Button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="h-11 sm:h-13 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-1.5 shadow-sm text-xs sm:text-sm"
              >
                <Camera className="h-4 w-4 text-sky-400 shrink-0" />
                <span>Camera</span>
                {scannedItems.length > 0 && (
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                    {scannedItems.length}
                  </span>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => handleAddSerial(inputSerial)}
                disabled={isFetching || !inputSerial.trim()}
                className="h-11 sm:h-13 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm text-xs sm:text-sm"
              >
                {isFetching ? "Adding..." : "+ Add Unit"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong>Hardware Gun:</strong> Trigger at carton boxes to auto-add units continuously without clicking.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2️⃣ Step 2: Scanned Items Cart (Mobile Cards + Desktop Table) */}
      <Card className="rounded-2xl sm:rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span>Scanned Items ({scannedItems.length})</span>
          </div>
          <span className="text-sm sm:text-base font-black text-slate-900 tabular-nums">
            Total: ৳ {grandTotal.toLocaleString()}
          </span>
        </div>

        <CardContent className="p-0">
          {scannedItems.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-2.5">
              <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Barcode className="h-5 w-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Cart is currently empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Scan unit QR stickers on product cartons to start building this sale order.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View: High-contrast touch cards (sm:hidden) */}
              <div className="divide-y divide-slate-100 sm:hidden">
                {scannedItems.map((item, idx) => (
                  <div key={item.uniqueId} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900 truncate block">
                            {item.productName}
                          </span>
                        </div>
                        {item.sku && (
                          <span className="text-[11px] font-mono text-slate-400">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.uniqueId)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {item.uniqueId}
                        </span>
                        <Badge
                          variant="success"
                          className="text-[10px] py-0 px-1.5 rounded-md"
                        >
                          {item.warrantyMonths}M
                        </Badge>
                      </div>

                      <div className="font-black text-sm text-slate-900 tabular-nums">
                        ৳ {item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Data Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Serial Number</th>
                      <th className="py-3 px-4">Warranty</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scannedItems.map((item, idx) => (
                      <tr
                        key={item.uniqueId}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">
                            {item.productName}
                          </div>
                          {item.sku && (
                            <div className="text-[11px] font-mono text-slate-400">
                              SKU: {item.sku}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md">
                            {item.uniqueId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant="success"
                            className="text-[10px] py-0.5 px-2 rounded-full gap-1"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {item.warrantyMonths} Mos
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900 tabular-nums">
                          ৳ {item.price.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.uniqueId)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 3️⃣ Step 3: Billing & Optional Customer Info */}
      <form onSubmit={handleCompleteSale} className="space-y-4 sm:space-y-6">
        <Card className="rounded-2xl sm:rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
          <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>Checkout & Billing</span>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomerForm(!showCustomerForm)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
            >
              <User className="h-3.5 w-3.5" />
              <span>
                {showCustomerForm ? "Hide Details" : "+ Customer (Optional)"}
              </span>
              {showCustomerForm ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <CardContent className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
            {/* Optional Customer Information Accordion */}
            {showCustomerForm && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  <span>Buyer Information (Optional - Walk-in by default)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Customer Name
                    </label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Karim Ahmed (Walk-in)"
                      className="h-10 sm:h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Mobile Number
                    </label>
                    <Input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01712345678"
                      className="h-10 sm:h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="h-10 sm:h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Price Breakdown & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase text-slate-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER"
                    )
                  }
                  className="w-full h-11 sm:h-12 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CASH">💵 Cash on Counter</option>
                  <option value="CARD">💳 POS Card Payment</option>
                  <option value="BANK_TRANSFER">🏦 Bank Wire Transfer</option>
                  <option value="OTHER">📱 Mobile Banking / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase text-slate-700 mb-1">
                  Order Discount ৳ (Optional)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={overallDiscount}
                  onChange={(e) => setOverallDiscount(e.target.value)}
                  placeholder="0"
                  className="h-11 sm:h-12 rounded-xl bg-slate-50 border-slate-200 font-bold text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase text-slate-700 mb-1">
                  Invoice Notes (Optional)
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery remarks..."
                  className="h-11 sm:h-12 rounded-xl bg-slate-50 border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Grand Total Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Grand Total ({scannedItems.length} items)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                  ৳ {grandTotal.toLocaleString()}
                  {discountNum > 0 && (
                    <span className="text-xs font-normal text-emerald-600 ml-2 block sm:inline">
                      (৳{discountNum.toLocaleString()} discount)
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isRecording || scannedItems.length === 0}
                className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg shadow-emerald-600/30 text-sm sm:text-base shrink-0"
              >
                {isRecording ? (
                  "Processing Sale..."
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Complete Sale ({scannedItems.length} Units)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* 📷 Continuous QR / Barcode Camera Scanner Modal */}
      <QrCameraScanner
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        continuous={true}
        scannedCount={scannedItems.length}
        title="Continuous POS Barcode & QR Scanner"
        onScanSuccess={(scannedSerial) => {
          handleAddSerial(scannedSerial);
        }}
      />

      {/* 4️⃣ Step 4: Success Multi-item Receipt Modal */}
      {successModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="text-center space-y-1.5">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Transaction Successful!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Digital warranties have been activated for all sold units.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900">
                  {successModalData.customerName}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="font-mono font-medium text-slate-800 text-[11px] sm:text-xs">
                  {successModalData.date}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Payment:</span>
                <span className="font-bold text-slate-800">
                  {successModalData.paymentMethod}
                </span>
              </div>

              {/* Items Table */}
              <div className="pt-1.5 space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Sold Items & Active Warranties:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {successModalData.items.map((item) => (
                    <div
                      key={item.uniqueId}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-bold text-slate-900 truncate">
                          {item.productName}
                        </div>
                        <div className="font-mono text-[10px] text-blue-600 font-bold">
                          SN: {item.uniqueId} • {item.warrantyMonths}M
                        </div>
                      </div>
                      <span className="font-black text-slate-900 tabular-nums shrink-0">
                        ৳ {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm sm:text-base text-slate-900">
                <span>Total Amount:</span>
                <span className="tabular-nums">
                  ৳ {successModalData.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                type="button"
                onClick={() => window.print()}
                variant="outline"
                className="flex-1 h-11 rounded-xl bg-white border-slate-300 font-bold text-xs sm:text-sm"
              >
                <Printer className="mr-1.5 h-4 w-4" /> Print Memo
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/seller/sales")}
                variant="outline"
                className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm"
              >
                <List className="mr-1.5 h-4 w-4" /> History
              </Button>
              <Button
                type="button"
                onClick={handleStartNextSale}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 text-xs sm:text-sm"
              >
                <PlusCircle className="mr-1.5 h-4 w-4" /> Next Sale
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
