"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Package } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import type { VariantItem } from "@/lib/types/admin.types";
import { bulkAddVariantItemsAction } from "@/actions/product.action";

type Row = {
  id: string;
  serialNumber: string;
  status: VariantItem["status"];
  manufacturedAt: string;
};

const emptyRow = (): Row => ({
  id: crypto.randomUUID(),
  serialNumber: "",
  status: "AVAILABLE",
  manufacturedAt: "",
});

export default function ProductItemsContent({
  productId,
  variantId,
  variantSku,
  initialItems,
}: {
  productId: string;
  variantId: string;
  variantSku: string;
  initialItems: VariantItem[];
}) {
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [isPending, startTransition] = useTransition();

  const addRow = () => setRows((r) => [...r, emptyRow()]);

  const removeRow = (id: string) =>
    setRows((r) => (r.length === 1 ? r : r.filter((x) => x.id !== id)));

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const handleSubmit = () => {
    const valid = rows.filter((r) => r.serialNumber.trim() !== "");

    if (valid.length === 0) {
      toast.error("No valid serial numbers");
      return;
    }

    const serials = valid.map((r) => r.serialNumber);
    if (new Set(serials).size !== serials.length) {
      toast.error("Duplicate serial numbers in your list");
      return;
    }

    startTransition(async () => {
      const res = await bulkAddVariantItemsAction({
        productId,
        variantId,
        items: valid.map((r) => ({
          serialNumber: r.serialNumber.toUpperCase(),
          status: r.status,
          manufacturedAt: r.manufacturedAt || undefined,
        })),
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setRows([emptyRow()]);
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/admin/products/${productId}`}
          className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
              Variant Items
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              SKU:{" "}
              <span className="font-mono text-slate-700">{variantSku}</span>
              {" · "}
              Existing:{" "}
              <span className="font-mono">{initialItems.length}</span>
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="h-11 rounded-xl shadow-lg shadow-blue-500/20"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending
              ? "Saving..."
              : `Save ${rows.filter((r) => r.serialNumber).length} Items`}
          </Button>
        </div>
      </div>

      {/* Bulk add */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6">
          <h2 className="text-lg font-bold text-slate-800">Bulk Add</h2>
          <p className="mt-1 text-sm text-slate-500">
            Serial: A-Z, 0-9, hyphen only.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr>
                <th className="hidden w-12 px-6 py-4 font-medium text-slate-500 sm:table-cell">
                  #
                </th>
                <th className="px-6 py-4 font-medium text-slate-500">
                  Serial Number *
                </th>
                <th className="w-48 px-6 py-4 font-medium text-slate-500">
                  Status
                </th>
                <th className="w-48 px-6 py-4 font-medium text-slate-500">
                  Manufactured
                </th>
                <th className="w-20 px-6 py-4 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="hidden px-6 py-4 text-slate-500 sm:table-cell">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      value={row.serialNumber}
                      onChange={(e) =>
                        updateRow(row.id, {
                          serialNumber: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. FAN-001928"
                      className="h-11 rounded-xl bg-slate-50 font-mono uppercase"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={row.status}
                      onChange={(e) =>
                        updateRow(row.id, {
                          status: e.target.value as Row["status"],
                        })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="DAMAGED">DAMAGED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      type="date"
                      value={row.manufacturedAt}
                      onChange={(e) =>
                        updateRow(row.id, { manufacturedAt: e.target.value })
                      }
                      className="h-11 rounded-xl bg-slate-50"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="h-10 w-10 rounded-xl p-0 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-50 bg-slate-50/50 p-6">
          <Button
            variant="outline"
            onClick={addRow}
            className="h-11 rounded-xl border-2 border-dashed border-slate-200 bg-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>
        </div>
      </Card>

      {/* Existing items */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2 border-b border-slate-100 p-6">
          <Package className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-800">
            Existing Items ({initialItems.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">
                  Serial Number
                </th>
                <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                <th className="px-6 py-4 font-medium text-slate-500">
                  Manufactured
                </th>
                <th className="px-6 py-4 font-medium text-slate-500">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialItems.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No items yet.
                  </td>
                </tr>
              )}

              {initialItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                    {item.serialNumber}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        item.status === "AVAILABLE" ? "success" : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.manufacturedAt
                      ? new Date(item.manufacturedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}