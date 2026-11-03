"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, Camera, ShieldCheck } from "lucide-react";
import { QrCameraScanner } from "@/components/modules/admin/orders/QrCameraScanner";

export default function QuickWarrantyCheck() {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id = productId.trim();

    if (!id) return;

    router.push(`/warranty?serial=${encodeURIComponent(id.toUpperCase())}`);
  };

  const handleCameraScanSuccess = (scannedSerial: string) => {
    setScannerOpen(false);
    const clean = scannedSerial.trim().toUpperCase();
    setProductId(clean);
    router.push(`/warranty?serial=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-xl bg-card p-2 xs:p-2.5 sm:p-4 lg:p-5">
      {/* Header: Compact on tiny phone screens, expanded on larger screens */}
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
            <h2 className="text-[11px] xs:text-xs sm:text-sm lg:text-base font-bold text-foreground truncate">
              Check Warranty
            </h2>
          </div>
          <span className="hidden sm:inline-block text-[10px] text-muted-foreground shrink-0 font-medium">
            Official JEE
          </span>
        </div>

        <p className="hidden xs:block sm:block text-[9px] xs:text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
          Verify product authenticity & warranty
        </p>
      </div>

      {/* Form: Proportional height & spacing across all phone & desktop sizes */}
      <form onSubmit={handleSubmit} className="mt-1 xs:mt-1.5 sm:mt-3 flex flex-col justify-end gap-1.5 sm:gap-2 flex-1">
        <label htmlFor="quick-product-id" className="sr-only">
          Product ID or Serial Number
        </label>

        <div className="relative flex items-center">
          <Search
            aria-hidden="true"
            className="absolute left-2 sm:left-3 top-1/2 size-3 sm:size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />

          <input
            id="quick-product-id"
            name="productId"
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Serial / Product ID"
            autoComplete="off"
            spellCheck={false}
            required
            className="h-6.5 xs:h-7 sm:h-9 lg:h-10 w-full min-w-0 rounded-md sm:rounded-lg border border-input bg-background pl-6 sm:pl-8.5 pr-7 sm:pr-8 text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-mono uppercase outline-none transition focus:border-primary focus:ring-1 sm:focus:ring-2 focus:ring-primary/15"
          />

          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            title="Scan QR Code with Camera"
            aria-label="Scan QR Code with Camera"
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded text-muted-foreground hover:text-primary transition"
          >
            <Camera className="size-3.5 sm:size-4" />
          </button>
        </div>

        <button
          type="submit"
          className="flex h-6.5 xs:h-7 sm:h-9 lg:h-10 w-full items-center justify-center rounded-md sm:rounded-lg bg-primary px-2 sm:px-3 text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-semibold text-primary-foreground transition active:scale-[0.98] hover:bg-primary/90 shadow-2xs gap-1"
        >
          <span>Verify Warranty</span>
          <ArrowRight className="size-2.5 xs:size-3 sm:size-3.5" />
        </button>
      </form>

      {/* QR Camera Scanner Modal */}
      <QrCameraScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScanSuccess={handleCameraScanSuccess}
        title="Scan Product QR / Barcode"
      />
    </div>
  );
}
