"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Edit,
    Package,
    Image as ImageIcon,
    QrCode,
    Printer,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QrStickerModal, type QrStickerItem } from "@/components/modules/admin/items/QrStickerModal";
import type { AdminVariantDetail } from "@/lib/types/admin.types";

export default function VariantDetailsContent({
    productId,
    variant,
}: {
    productId: string;
    variant: AdminVariantDetail;
}) {
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrItems, setQrItems] = useState<QrStickerItem[]>([]);
    const [qrModalTitle, setQrModalTitle] = useState("Product Item QR Stickers");

    const price = Number(variant.price);
    const compare = variant.comparePrice ? Number(variant.comparePrice) : null;

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
                    <p className="mt-1 text-sm font-mono text-slate-500">{variant.sku}</p>
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
                    <Button className="h-11 rounded-xl shadow-lg shadow-blue-500/20">
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

            {/* Pricing */}
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

            {/* Items */}
            <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 p-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                        <Package className="h-5 w-5" />
                        Items ({variant.productItems.length})
                    </h2>
                    <div className="flex items-center gap-2">
                        {variant.productItems.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setQrItems(
                                        variant.productItems.map((it) => ({
                                            serialNumber: it.serialNumber,
                                            variantSku: variant.sku,
                                            status: it.status,
                                        }))
                                    );
                                    setQrModalTitle(`All Stickers (${variant.productItems.length}) — SKU: ${variant.sku}`);
                                    setQrModalOpen(true);
                                }}
                                className="rounded-xl gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                            >
                                <Printer className="h-4 w-4 text-blue-600" />
                                Print Stickers
                            </Button>
                        )}
                        <Link href={`/admin/products/${productId}/variants/${variant.id}/items`}>
                            <Button variant="outline" className="rounded-xl">
                                <Package className="mr-2 h-4 w-4" />
                                Manage Items
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/80">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-500">
                                    Serial Number
                                </th>
                                <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Added</th>
                                <th className="px-6 py-4 font-medium text-slate-500 text-right">QR Sticker</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {variant.productItems.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-slate-500"
                                    >
                                        No items yet.
                                    </td>
                                </tr>
                            )}
                            {variant.productItems.map((item) => (
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
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setQrItems([
                                                    {
                                                        serialNumber: item.serialNumber,
                                                        variantSku: variant.sku,
                                                        status: item.status,
                                                    },
                                                ]);
                                                setQrModalTitle(`Box Sticker — SN: ${item.serialNumber}`);
                                                setQrModalOpen(true);
                                            }}
                                            className="h-8 gap-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50"
                                        >
                                            <QrCode className="h-3.5 w-3.5" />
                                            Sticker
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <QrStickerModal
                isOpen={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                items={qrItems}
                title={qrModalTitle}
            />
        </div>
    );
}