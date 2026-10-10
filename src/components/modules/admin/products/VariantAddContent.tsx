"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Trash2, Save, ImageIcon, Layers } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AdminProductDetail, CreateVariantInput } from "@/lib/types/admin.types";
import { addVariantAction } from "@/actions/product.action";

export default function VariantAddContent({
    product,
}: {
    product: AdminProductDetail;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    /* Form state */
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [comparePrice, setComparePrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("0");
    const [lowStockThreshold, setLowStockThreshold] = useState("5");
    const [isActive, setIsActive] = useState(true);

    /* Attributes */
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
        { key: "color", value: "" },
    ]);

    /* Images */
    const [images, setImages] = useState<string[]>([""]);

    /* Add attribute row */
    const handleAddAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    /* Remove attribute row */
    const handleRemoveAttribute = (index: number) => {
        if (attributes.length <= 1) return;
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    /* Add image row */
    const handleAddImage = () => {
        setImages([...images, ""]);
    };

    /* Remove image row */
    const handleRemoveImage = (index: number) => {
        if (images.length <= 1) {
            setImages([""]);
            return;
        }
        setImages(images.filter((_, i) => i !== index));
    };

    /* Submit */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!price || Number(price) <= 0) {
            return toast.error("Please enter a valid price greater than 0");
        }

        const validAttrs = attributes.filter((a) => a.key.trim() && a.value.trim());
        if (validAttrs.length === 0) {
            return toast.error("Please add at least one attribute (e.g. Color or Size)");
        }

        const attributesRecord: Record<string, string> = {};
        for (const attr of validAttrs) {
            attributesRecord[attr.key.trim().toLowerCase()] = attr.value.trim();
        }

        const validImages = images.map((img) => img.trim()).filter(Boolean);

        const payload: CreateVariantInput = {
            sku: sku.trim() || undefined,
            attributes: attributesRecord,
            price: Number(price),
            comparePrice: comparePrice ? Number(comparePrice) : undefined,
            images: validImages,
            stockQuantity: Number(stockQuantity) || 0,
            lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined,
            isActive,
        };

        startTransition(async () => {
            const res = await addVariantAction(product.id, payload);
            if (res.success) {
                toast.success(res.message);
                router.push(`/admin/products/${product.id}`);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Back link & Header */}
            <div>
                <Link
                    href={`/admin/products/${product.id}`}
                    className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to {product.name}
                </Link>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            Add New Variant
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                            Product: <span className="font-semibold text-slate-700">{product.name}</span>
                            {product.brand?.name ? ` · ${product.brand.name}` : ""}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Variant Details & SKU */}
                <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-6 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-900">Variant Identity</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                SKU (Stock Keeping Unit)
                            </label>
                            <Input
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="E.g., PROD-WHT-56"
                                className="h-11 rounded-xl bg-slate-50 font-mono text-sm"
                            />
                            <p className="text-xs text-slate-400">
                                Leave blank to auto-generate from product name and attributes.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Variant Status
                            </label>
                            <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                                <input
                                    type="checkbox"
                                    id="isActiveToggle"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                                />
                                <label
                                    htmlFor="isActiveToggle"
                                    className="text-sm font-medium text-slate-700 cursor-pointer"
                                >
                                    Active for sale
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Attributes (Color, Size, Wattage, etc.) */}
                <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Attributes *</h2>
                            <p className="text-xs text-slate-500">
                                Specify characteristics like color, size, capacity, or voltage.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddAttribute}
                            className="rounded-xl border-slate-200"
                        >
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Add Attribute
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {attributes.map((attr, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <Input
                                    value={attr.key}
                                    onChange={(e) => {
                                        const updated = [...attributes];
                                        updated[idx].key = e.target.value;
                                        setAttributes(updated);
                                    }}
                                    placeholder="Name (e.g. Color)"
                                    className="h-11 flex-1 rounded-xl bg-slate-50 text-sm"
                                />
                                <Input
                                    value={attr.value}
                                    onChange={(e) => {
                                        const updated = [...attributes];
                                        updated[idx].value = e.target.value;
                                        setAttributes(updated);
                                    }}
                                    placeholder="Value (e.g. Matte Black)"
                                    className="h-11 flex-1 rounded-xl bg-slate-50 text-sm"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveAttribute(idx)}
                                    disabled={attributes.length === 1}
                                    className="h-11 w-11 rounded-xl p-0 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Pricing & Stock */}
                <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Pricing & Inventory</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Selling Price (৳) *
                            </label>
                            <Input
                                type="number"
                                min="0"
                                step="any"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                                required
                                className="h-11 rounded-xl bg-slate-50 tabular-nums text-sm font-bold text-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Compare Price (৳)
                            </label>
                            <Input
                                type="number"
                                min="0"
                                step="any"
                                value={comparePrice}
                                onChange={(e) => setComparePrice(e.target.value)}
                                placeholder="0"
                                className="h-11 rounded-xl bg-slate-50 tabular-nums text-sm text-slate-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Initial Stock
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                placeholder="0"
                                className="h-11 rounded-xl bg-slate-50 tabular-nums text-sm font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Low Stock Alert
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={lowStockThreshold}
                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                placeholder="5"
                                className="h-11 rounded-xl bg-slate-50 tabular-nums text-sm"
                            />
                        </div>
                    </div>
                </Card>

                {/* Images */}
                <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-slate-600" />
                            <h2 className="text-lg font-bold text-slate-900">Variant Images</h2>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddImage}
                            className="rounded-xl border-slate-200"
                        >
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Add Image URL
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {images.map((imgUrl, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                {imgUrl.trim() && (
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                        <Image
                                            src={imgUrl}
                                            alt={`Preview ${idx + 1}`}
                                            fill
                                            sizes="44px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <Input
                                    value={imgUrl}
                                    onChange={(e) => {
                                        const updated = [...images];
                                        updated[idx] = e.target.value;
                                        setImages(updated);
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                    className="h-11 flex-1 rounded-xl bg-slate-50 text-sm"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="h-11 w-11 rounded-xl p-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link href={`/admin/products/${product.id}`}>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-xl px-6"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-11 rounded-xl px-6 shadow-lg shadow-blue-500/20"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Adding Variant..." : "Create Variant"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
