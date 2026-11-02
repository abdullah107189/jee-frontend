"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Package,
  Image as ImageIcon,
  QrCode,
  Printer,
  Plus,
  Trash2,
  X,
  Layers,
  CheckCircle2,
  Barcode,
  Calendar,
  Sparkles,
  Tag,
  Hash,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { QrStickerModal, type QrStickerItem } from "@/components/modules/admin/products/QrStickerModal";
import { bulkAddVariantItemsAction, deleteVariantItemAction } from "@/actions/product.action";
import { formatAppDate } from "@/lib/utils";
import type { AdminVariantDetail, VariantItem } from "@/lib/types/admin.types";
import { toast } from "sonner";

interface ProductionBatch {
  batchNumber: number;
  label: string;
  date: string;
  items: VariantItem[];
}

/** Helper to get effective date of an item (prefer manufacturedAt, fallback to createdAt) */
function getItemEffectiveDate(item: VariantItem): string {
  return item.manufacturedAt || item.createdAt;
}

/** Group serialized units by their manufacture date and creation session into distinct production runs */
function groupItemsIntoBatches(items: VariantItem[]): ProductionBatch[] {
  if (!items || items.length === 0) return [];

  // Sort ascending chronologically (Batch 1, Batch 2...)
  const sortedAsc = [...items].sort((a, b) => {
    const timeA = new Date(getItemEffectiveDate(a)).getTime();
    const timeB = new Date(getItemEffectiveDate(b)).getTime();
    return timeA - timeB;
  });

  const rawBatches: VariantItem[][] = [];
  let currentGroup: VariantItem[] = [];
  let currentKey = "";

  for (const item of sortedAsc) {
    // If user provided a manufacturedAt date, use its YYYY-MM-DD as distinct batch key
    // Otherwise fallback to createdAt timestamp cluster (within 60s)
    let key = "";
    if (item.manufacturedAt) {
      const d = new Date(item.manufacturedAt);
      key = isNaN(d.getTime()) ? "" : `mfg-${d.toISOString().slice(0, 10)}`;
    }
    if (!key) {
      const c = new Date(item.createdAt);
      key = `created-${c.toISOString().slice(0, 16)}`;
    }

    if (currentKey && key !== currentKey) {
      if (currentGroup.length > 0) {
        rawBatches.push(currentGroup);
      }
      currentGroup = [];
    }

    currentGroup.push(item);
    currentKey = key;
  }

  if (currentGroup.length > 0) {
    rawBatches.push(currentGroup);
  }

  return rawBatches.map((batchItems, idx) => {
    // Pick manufacturedAt if any item has it, else createdAt
    const withMfg = batchItems.find((it) => it.manufacturedAt);
    const dateValue = withMfg?.manufacturedAt || batchItems[0].createdAt;

    return {
      batchNumber: idx + 1,
      label: `Batch #${idx + 1}`,
      date: formatAppDate(dateValue), // Always Day first: DD MMM YYYY (e.g. "15 Oct 2026")
      items: batchItems,
    };
  });
}

/** Calculate the next sequential serial number starting point for this SKU */
function getNextSerialSequence(sku: string, items: VariantItem[]): number {
  let maxNum = 0;
  const prefix = `${sku}-`;

  items.forEach((it) => {
    if (it.serialNumber && it.serialNumber.startsWith(prefix)) {
      const numPart = it.serialNumber.slice(prefix.length);
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  });

  return maxNum > 0 ? maxNum + 1 : items.length + 1;
}

export default function VariantDetailsContent({
  productId,
  variant,
}: {
  productId: string;
  variant: AdminVariantDetail;
}) {
  /* QR Sticker Print Modal state */
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrItems, setQrItems] = useState<QrStickerItem[]>([]);
  const [qrModalTitle, setQrModalTitle] = useState("Product Item QR Stickers");

  /* Add Batch Units Modal state */
  const [addBatchModalOpen, setAddBatchModalOpen] = useState(false);
  const [batchMode, setBatchMode] = useState<"auto" | "scan">("auto");
  const [autoQuantity, setAutoQuantity] = useState<number>(10);
  const [bulkSerialsText, setBulkSerialsText] = useState("");
  const [manufacturedAt, setManufacturedAt] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [isAddingBatch, startAddBatchTransition] = useTransition();

  /* Batch Tab Filter in Table */
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>("ALL");

  /* Delete Item confirmation state */
  const [itemToDelete, setItemToDelete] = useState<{ id: string; serial: string } | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const price = Number(variant.price);
  const compare = variant.comparePrice ? Number(variant.comparePrice) : null;

  /* Group items into chronologically identified production batches */
  const batches = useMemo(
    () => groupItemsIntoBatches(variant.productItems || []),
    [variant.productItems]
  );

  /* Next sequence starting index */
  const nextSeq = useMemo(
    () => getNextSerialSequence(variant.sku, variant.productItems || []),
    [variant.sku, variant.productItems]
  );

  /* Auto-generate preview serials */
  const autoPreviewSerials = useMemo(() => {
    const qty = Math.max(1, Math.min(autoQuantity || 1, 500));
    return Array.from({ length: qty }, (_, i) => {
      const num = nextSeq + i;
      return `${variant.sku}-${String(num).padStart(4, "0")}`;
    });
  }, [nextSeq, autoQuantity, variant.sku]);

  /* Parse quick scan / paste text into clean uppercase serial numbers */
  const parsedCustomSerials = useMemo(() => {
    const list = bulkSerialsText
      .split(/[\n,;\s]+/)
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);
    return [...new Set(list)];
  }, [bulkSerialsText]);

  /* Filtered Items for the Table */
  const displayedItems = useMemo(() => {
    if (selectedBatchFilter === "ALL") {
      return variant.productItems || [];
    }
    const found = batches.find((b) => String(b.batchNumber) === selectedBatchFilter);
    return found ? found.items : variant.productItems || [];
  }, [selectedBatchFilter, batches, variant.productItems]);

  /* Submit Batch Units */
  const handleBatchSubmit = () => {
    let finalSerials: string[] = [];

    if (batchMode === "auto") {
      finalSerials = autoPreviewSerials;
    } else {
      if (parsedCustomSerials.length === 0) {
        toast.error("Please enter or scan at least one valid serial number.");
        return;
      }
      finalSerials = parsedCustomSerials;
    }

    startAddBatchTransition(async () => {
      const res = await bulkAddVariantItemsAction({
        productId,
        variantId: variant.id,
        items: finalSerials.map((s) => ({
          serialNumber: s,
          status: "AVAILABLE",
          manufacturedAt: manufacturedAt ? manufacturedAt.trim() : undefined,
        })),
      });

      if (!res.success) {
        toast.error(res.message || "Failed to add batch units");
        return;
      }

      toast.success(res.message || `${finalSerials.length} units added successfully!`);

      // Prepare stickers specifically for the newly manufactured batch
      const newStickers: QrStickerItem[] = finalSerials.map((serial) => ({
        serialNumber: serial,
        productName: variant.product?.name,
        variantSku: variant.sku,
        status: "AVAILABLE",
      }));

      // Close add modal & automatically open QR sticker print dialog for new batch
      setAddBatchModalOpen(false);
      setBulkSerialsText("");
      setAutoQuantity(10);

      setQrItems(newStickers);
      setQrModalTitle(
        `New Batch Stickers (${newStickers.length} Units) — ${finalSerials[0]} to ${
          finalSerials[finalSerials.length - 1]
        }`
      );
      setQrModalOpen(true);
    });
  };

  /* Delete Item Handler */
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    startDeleteTransition(async () => {
      const res = await deleteVariantItemAction({
        productId,
        variantId: variant.id,
        itemId: itemToDelete.id,
      });

      if (res.success) {
        toast.success(res.message || "Unit removed");
        setItemToDelete(null);
      } else {
        toast.error(res.message || "Failed to delete unit");
      }
    });
  };

  /* Helper to print a specific batch */
  const handlePrintBatch = (batch: ProductionBatch) => {
    const stickers: QrStickerItem[] = batch.items.map((it) => ({
      serialNumber: it.serialNumber,
      productName: variant.product?.name,
      variantSku: variant.sku,
      status: it.status,
    }));
    setQrItems(stickers);
    setQrModalTitle(`${batch.label} Stickers (${stickers.length} Units) — Date: ${batch.date}`);
    setQrModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back */}
      <Link
        href={`/admin/products/${productId}`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Product
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {variant.product?.name || "Unnamed Variant"}
          </h1>
          <p className="mt-1 text-sm font-mono text-slate-500 font-semibold">{variant.sku}</p>
          <div className="mt-3 flex gap-2">
            {variant.isDefault && <Badge variant="outline">Default</Badge>}
            <Badge variant={variant.isActive ? "success" : "outline"}>
              {variant.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={variant.stockQuantity > 0 ? "success" : "outline"}>
              {variant.stockQuantity} in stock
            </Badge>
          </div>
        </div>

        <Link href={`/admin/products/${productId}/variants/${variant.id}/edit`}>
          <Button className="h-11 rounded-xl shadow-lg shadow-blue-500/20 font-bold">
            <Edit className="mr-2 h-4 w-4" />
            Edit Variant
          </Button>
        </Link>
      </div>

      {/* Images */}
      <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <ImageIcon className="h-5 w-5" /> Images ({variant.images.length})
        </h2>
        {variant.images.length === 0 ? (
          <p className="text-sm text-slate-500">No images.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {variant.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <Image
                  src={img}
                  alt={`${variant.sku}-${i}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pricing & Stock Summary */}
      <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Pricing & Stock</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-xl font-bold text-slate-900">
              ৳{price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Compare Price</p>
            <p className="text-xl font-bold text-slate-400 line-through">
              {compare ? `৳${compare.toLocaleString()}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Stock Quantity</p>
            <p className="text-xl font-bold text-slate-900">
              {variant.stockQuantity}
            </p>
          </div>
        </div>
      </Card>

      {/* Attributes */}
      <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Attributes</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(variant.attributes).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
            >
              <span className="text-sm font-medium capitalize text-slate-500">
                {k}
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {String(v)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Production Batches & Serialized Units Section */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Production Batches & Physical Units ({variant.productItems.length})
              </h2>
              <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-bold border border-blue-200">
                {batches.length} {batches.length === 1 ? "Batch" : "Batches"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Organized by production launch run. Print batch stickers together to easily attach to fresh product bodies.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {variant.productItems.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setQrItems(
                    variant.productItems.map((it) => ({
                      serialNumber: it.serialNumber,
                      productName: variant.product?.name,
                      variantSku: variant.sku,
                      status: it.status,
                    }))
                  );
                  setQrModalTitle(
                    `All Visible Stickers (${variant.productItems.length}) — SKU: ${variant.sku}`
                  );
                  setQrModalOpen(true);
                }}
                className="rounded-xl gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
              >
                <Printer className="h-4 w-4 text-blue-600" />
                Print All ({variant.productItems.length})
              </Button>
            )}

            <Button
              onClick={() => setAddBatchModalOpen(true)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              Add Batch Units (Stock In)
            </Button>
          </div>
        </div>

        {/* Batch Overview Cards / Fast Print Bar */}
        {batches.length > 0 && (
          <div className="p-6 bg-slate-50/60 border-b border-slate-100 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Production Runs (Click to Filter or Print Batch Stickers)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {batches.map((batch) => {
                const firstSerial = batch.items[0]?.serialNumber;
                const lastSerial = batch.items[batch.items.length - 1]?.serialNumber;
                const isSelected = selectedBatchFilter === String(batch.batchNumber);

                return (
                  <div
                    key={batch.batchNumber}
                    onClick={() =>
                      setSelectedBatchFilter((prev) =>
                        prev === String(batch.batchNumber) ? "ALL" : String(batch.batchNumber)
                      )
                    }
                    className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                      isSelected
                        ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800">
                          {batch.label}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {batch.items.length} units
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 font-semibold">
                        <Calendar className="h-3 w-3 text-blue-600" /> {batch.date}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-500 truncate mb-3">
                      Range: <span className="text-slate-800 font-bold">{firstSerial}</span> →{" "}
                      <span className="text-slate-800 font-bold">{lastSerial}</span>
                    </p>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintBatch(batch);
                      }}
                      className="w-full h-8 rounded-xl text-xs font-bold gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Printer className="h-3.5 w-3.5 text-blue-600" />
                      Print {batch.label} Stickers ({batch.items.length})
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-400 whitespace-nowrap">Filter Units:</span>
          <button
            onClick={() => setSelectedBatchFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedBatchFilter === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Units ({variant.productItems.length})
          </button>
          {batches.map((batch) => (
            <button
              key={batch.batchNumber}
              onClick={() => setSelectedBatchFilter(String(batch.batchNumber))}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedBatchFilter === String(batch.batchNumber)
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Tag className="h-3 w-3" />
              {batch.label} ({batch.items.length} Units — {batch.date})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500">Serial Number</th>
                <th className="px-6 py-4 font-bold text-slate-500">Production Batch</th>
                <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 font-bold text-slate-500">Manufacture Date (DD MMM YYYY)</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Package className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No units in this selection.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click &quot;Add Batch Units&quot; to produce and register new serial numbers into this variant.
                    </p>
                  </td>
                </tr>
              )}
              {displayedItems.map((item) => {
                // Find which batch this item belongs to
                const matchedBatch = batches.find((b) =>
                  b.items.some((it) => it.id === item.id)
                );

                const displayDate = item.manufacturedAt || item.createdAt;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                      {item.serialNumber}
                    </td>
                    <td className="px-6 py-4">
                      {matchedBatch ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                          <Tag className="h-3 w-3" /> {matchedBatch.label}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          item.status === "AVAILABLE"
                            ? "success"
                            : item.status === "SOLD"
                            ? "destructive"
                            : "outline"
                        }
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-700 font-bold">
                      {formatAppDate(displayDate)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQrItems([
                            {
                              serialNumber: item.serialNumber,
                              productName: variant.product?.name,
                              variantSku: variant.sku,
                              status: item.status,
                            },
                          ]);
                          setQrModalTitle(`Box Sticker — SN: ${item.serialNumber}`);
                          setQrModalOpen(true);
                        }}
                        className="h-8 gap-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50"
                        title="Print Single Unit Sticker"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        Sticker
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        onClick={() =>
                          setItemToDelete({ id: item.id, serial: item.serialNumber })
                        }
                        className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove Unit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Batch Units (Stock In) Modal */}
      {addBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Add Production Batch Units
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    SKU: <span className="font-bold text-slate-700">{variant.sku}</span> | Next Batch:{" "}
                    <span className="font-bold text-blue-600">Batch #{batches.length + 1}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddBatchModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setBatchMode("auto")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  batchMode === "auto"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto Sequential Serials (Factory Run)
              </button>
              <button
                type="button"
                onClick={() => setBatchMode("scan")}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  batchMode === "scan"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Barcode className="h-3.5 w-3.5" />
                Custom / Supplier Barcode Scan
              </button>
            </div>

            {/* Mode 1: Auto Sequential Serials */}
            {batchMode === "auto" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-bold text-slate-700">
                      Units to Produce / Stock In
                    </label>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Current Total: {variant.productItems.length} units
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      value={autoQuantity}
                      onChange={(e) =>
                        setAutoQuantity(parseInt(e.target.value, 10) || 1)
                      }
                      className="h-11 rounded-xl text-base font-bold font-mono w-32"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {[5, 10, 20, 50].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAutoQuantity(num)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            autoQuantity === num
                              ? "bg-blue-50 border-blue-400 text-blue-700"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Sequence Preview */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-blue-600" />
                    Generated Serial Number Sequence Preview:
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-500">First Serial:</span>{" "}
                      <span className="font-bold text-slate-800">
                        {autoPreviewSerials[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Last Serial:</span>{" "}
                      <span className="font-bold text-slate-800">
                        {autoPreviewSerials[autoPreviewSerials.length - 1]}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-blue-700 font-medium">
                    All {autoPreviewSerials.length} serials will be automatically created in sequential order and ready for 1-click sticker printing.
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2: Custom / Supplier Barcode Scan */}
            {batchMode === "scan" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Barcode className="h-4 w-4 text-blue-600" />
                    Scan or Paste Serial Numbers
                  </label>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Detected: {parsedCustomSerials.length} units
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={bulkSerialsText}
                  onChange={(e) => setBulkSerialsText(e.target.value)}
                  placeholder="Paste or scan barcodes separated by new line or comma...&#10;e.g.&#10;WALTON-AC-901&#10;WALTON-AC-902"
                  className="w-full rounded-2xl border border-slate-200 p-4 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            )}

            {/* Manufacture Date Input with DD MMM YYYY Preview */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Batch Manufacture Date
              </label>
              <Input
                type="date"
                value={manufacturedAt}
                onChange={(e) => setManufacturedAt(e.target.value)}
                className="h-10 rounded-xl text-xs font-mono"
              />
              <p className="text-[11px] text-blue-600 font-semibold font-mono">
                Formatted Date: {formatAppDate(manufacturedAt)} (Day-Month-Year)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                type="button"
                onClick={() => setAddBatchModalOpen(false)}
                className="rounded-xl px-5 font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isAddingBatch}
                onClick={handleBatchSubmit}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-500/20"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isAddingBatch
                  ? "Saving Batch..."
                  : `Save Batch & Print Stickers (${
                      batchMode === "auto"
                        ? autoPreviewSerials.length
                        : parsedCustomSerials.length
                    })`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Unit from Inventory"
        description="Are you sure you want to remove this serial unit? The variant's stock quantity will be automatically updated."
        itemName={itemToDelete ? `SN: ${itemToDelete.serial}` : undefined}
      />

      {/* QR Sticker Print Modal */}
      <QrStickerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        items={qrItems}
        title={qrModalTitle}
      />
    </div>
  );
}
