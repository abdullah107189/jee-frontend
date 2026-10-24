"use client";

import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  QrCode,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export interface QrStickerItem {
  serialNumber: string;
  productName?: string;
  variantSku?: string;
  attributes?: Record<string, string>;
  status?: string;
}

interface QrStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QrStickerItem[];
  title?: string;
  subtitle?: string;
}

export function QrStickerModal({
  isOpen,
  onClose,
  items,
  title = "Product Item QR Stickers",
  subtitle = "Ready to print & stick onto physical cartons and product boxes.",
}: QrStickerModalProps) {
  const [copiedSerial, setCopiedSerial] = useState<string | null>(null);
  const [stickerSize, setStickerSize] = useState<"standard" | "compact">("standard");

  if (!isOpen || items.length === 0) return null;

  const handleCopyUrl = (serial: string) => {
    const url = `https://jee.store/warranty?serial=${encodeURIComponent(serial)}`;
    navigator.clipboard.writeText(url);
    setCopiedSerial(serial);
    toast.success("Warranty URL copied to clipboard");
    setTimeout(() => setCopiedSerial(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print-specific style overrides */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-stickers-container,
          #printable-stickers-container * {
            visibility: visible;
          }
          #printable-stickers-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 10px;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .sticker-card {
            box-shadow: none !important;
            border: 1px dashed #000 !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Screen Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto no-print">
        <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  {title}
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {items.length} {items.length === 1 ? "Unit" : "Units"}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-6 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Smart QR: Customer scans → Warranty | Warehouse scans → Serial Auto-fill</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setStickerSize("standard")}
                  className={`rounded-md px-2.5 py-1 transition ${
                    stickerSize === "standard"
                      ? "bg-white font-bold text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Standard (Box)
                </button>
                <button
                  type="button"
                  onClick={() => setStickerSize("compact")}
                  className={`rounded-md px-2.5 py-1 transition ${
                    stickerSize === "compact"
                      ? "bg-white font-bold text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Compact
                </button>
              </div>

              <Button
                onClick={handlePrint}
                className="h-9 gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
              >
                <Printer className="h-4 w-4" />
                Print Stickers ({items.length})
              </Button>
            </div>
          </div>

          {/* Stickers Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60">
            <div
              id="printable-stickers-container"
              className={`grid gap-4 ${
                stickerSize === "standard"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              {items.map((item, idx) => {
                const qrValue = `https://jee.store/warranty?serial=${encodeURIComponent(
                  item.serialNumber
                )}`;

                return (
                  <div
                    key={`${item.serialNumber}-${idx}`}
                    className="sticker-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-300 bg-white p-4 shadow-sm transition hover:shadow-md"
                    style={{ minHeight: stickerSize === "standard" ? "210px" : "170px" }}
                  >
                    {/* Top Sticker Header */}
                    <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
                          J
                        </span>
                        <span className="text-xs font-black tracking-wider text-slate-900">
                          JEE.STORE
                        </span>
                      </div>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        GENUINE UNIT
                      </span>
                    </div>

                    {/* Middle: QR Code + Product Info */}
                    <div className="my-2.5 flex items-center gap-3">
                      <div className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm shrink-0">
                        <QRCodeSVG
                          value={qrValue}
                          size={stickerSize === "standard" ? 96 : 76}
                          level="M"
                          includeMargin={false}
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="truncate text-xs font-extrabold text-slate-900">
                          {item.productName || "JEE Official Electronics"}
                        </div>
                        {item.variantSku && (
                          <div className="text-[11px] font-medium text-slate-500">
                            SKU: <span className="font-mono text-slate-800">{item.variantSku}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Official Warranty</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Big Monospace Serial Number */}
                    <div className="mt-auto border-t border-dashed border-slate-200 pt-2 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                          SERIAL NUMBER
                        </div>
                        <div className="font-mono text-sm sm:text-base font-black tracking-tight text-slate-900 select-all">
                          {item.serialNumber}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 no-print">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item.serialNumber)}
                          title="Copy Warranty URL"
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                        >
                          {copiedSerial === item.serialNumber ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Sticker Cut / Corner Markers */}
                    <div className="absolute top-1 left-1 h-1.5 w-1.5 border-t border-l border-slate-400" />
                    <div className="absolute top-1 right-1 h-1.5 w-1.5 border-t border-r border-slate-400" />
                    <div className="absolute bottom-1 left-1 h-1.5 w-1.5 border-b border-l border-slate-400" />
                    <div className="absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
            <span className="text-xs text-slate-400">
              Tip: Standard 50×35mm or A4 multi-label sheets supported.
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-9 rounded-xl border-slate-200 text-slate-600"
              >
                Close
              </Button>
              <Button
                onClick={handlePrint}
                className="h-9 gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Printer className="h-4 w-4" />
                Print Now
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
