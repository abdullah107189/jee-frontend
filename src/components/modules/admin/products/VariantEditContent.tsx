"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, ImageIcon, Layers, AlertCircle, Upload, Check } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AdminVariantDetail, CreateVariantInput } from "@/lib/types/admin.types";
import { updateVariantAction, deleteVariantAction } from "@/actions/product.action";

export default function VariantEditContent({
    productId,
    variant,
}: {
    productId: string;
    variant: AdminVariantDetail;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* Form state initialized from existing variant */
    const [sku, setSku] = useState(variant.sku || "");
    const [price, setPrice] = useState(String(variant.price ?? ""));
    const [comparePrice, setComparePrice] = useState(
        variant.comparePrice ? String(variant.comparePrice) : "",
    );
    const [stockQuantity, setStockQuantity] = useState(String(variant.stockQuantity ?? 0));
    const [lowStockThreshold, setLowStockThreshold] = useState(
        String(variant.lowStockThreshold ?? 5),
    );
    const [isActive, setIsActive] = useState(variant.isActive ?? true);

    /* Attributes initialized */
    const initialAttributes = Object.entries(variant.attributes || {}).map(([key, value]) => ({
        key,
        value: value != null ? String(value) : "",
    }));
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(
        initialAttributes.length > 0 ? initialAttributes : [{ key: "color", value: "" }],
    );

    /* Images initialized */
    const [images, setImages] = useState<string[]>(
        Array.isArray(variant.images) && variant.images.length > 0 ? [...variant.images] : [""],
    );

    /* Attribute operations */
    const handleAddAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const handleRemoveAttribute = (index: number) => {
        if (attributes.length <= 1) return;
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    /* Image operations */
    const handleAddImage = () => {
        setImages([...images, ""]);
    };

    const handleRemoveImage = (index: number) => {
        if (images.length <= 1) {
            setImages([""]);
            return;
        }
        setImages(images.filter((_, i) => i !== index));
    };

    /* Local File Upload Handler (Dual mode: Upload + URL) */
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB size limit`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                if (result) {
                    setImages((prev) => {
                        const filtered = prev.filter((img) => img.trim().length > 0);
                        return [...filtered, result];
                    });
                    toast.success(`Image ${file.name} loaded`);
                }
            };
            reader.readAsDataURL(file);
        });

        e.target.value = "";
    };

    /* Submit changes */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!price || Number(price) <= 0) {
            return toast.error("Please enter a valid price greater than 0");
        }

        const validAttrs = attributes.filter((a) => a.key.trim() && a.value.trim());
        if (validAttrs.length === 0) {
            return toast.error("Please provide at least one attribute");
        }

        const attributesRecord: Record<string, string> = {};
        for (const attr of validAttrs) {
            attributesRecord[attr.key.trim().toLowerCase()] = attr.value.trim();
        }

        const validImages = images.map((img) => img.trim()).filter(Boolean);

        const payload: Partial<CreateVariantInput> = {
            sku: sku.trim() || undefined,
            attributes: attributesRecord,
            price: Number(price),
            comparePrice: comparePrice ? Number(comparePrice) : undefined,
            images: validImages,
            stockQuantity: Number(stockQuantity) || 0,
            lowStockThreshold: Number(lowStockThreshold) || 5,
            isActive,
        };

        startTransition(async () => {
            const res = await updateVariantAction(productId, variant.id, payload);
            if (res.success) {
                toast.success(res.message || "Variant updated successfully");
                router.push(`/admin/products/${productId}/variants/${variant.id}`);
                router.refresh();
            } else {
                toast.error(res.message || "Failed to update variant");
            }
        });
    };

    /* Delete variant */
    const handleDelete = () => {
        if (!confirm(`Are you sure you want to delete variant ${variant.sku || "this variant"}?`)) {
            return;
        }

        setIsDeleting(true);
        startTransition(async () => {
            const res = await deleteVariantAction(productId, variant.id);
            if (res.success) {
                toast.success(res.message || "Variant deleted successfully");
                router.push(`/admin/products/${productId}`);
                router.refresh();
            } else {
                toast.error(res.message || "Failed to delete variant");
                setIsDeleting(false);
            }
        });
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Back link & Header */}
            <div>
                <Link
                    href={`/admin/products/${productId}/variants/${variant.id}`}
                    className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Variant Details
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            Edit Variant
                        </h1>
                        <p className="mt-1 font-mono text-sm text-slate-500">
                            {variant.sku || "No SKU assigned"} · Product:{" "}
                            <span className="font-semibold text-slate-700">
                                {variant.product?.name}
                            </span>
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={isDeleting || isPending}
                        className="h-10 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete Variant"}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Variant Identity & Status */}
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
                                placeholder="E.g., PROD-BLK-01"
                                className="h-11 rounded-xl bg-slate-50 font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Variant Status
                            </label>
                            <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                                <input
                                    type="checkbox"
                                    id="isActiveToggleEdit"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                                />
                                <label
                                    htmlFor="isActiveToggleEdit"
                                    className="text-sm font-medium text-slate-700 cursor-pointer"
                                >
                                    Active for sale
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Attributes */}
                <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Attributes *</h2>
                            <p className="text-xs text-slate-500">
                                Attributes like color, size, capacity define this variant.
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
                                    placeholder="Value (e.g. Navy Blue)"
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
                    <div className="grid gap-4 sm:grid-cols-4">
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
                                Stock Quantity
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
                                className="h-11 rounded-xl bg-slate-50 tabular-nums text-sm font-semibold"
                            />
                        </div>
                    </div>

                    {variant.productItems && variant.productItems.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50/60 p-3 text-xs text-blue-700 border border-blue-100">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>
                                This variant currently has {variant.productItems.length} registered physical serial items.
                            </span>
                        </div>
                    )}
                </Card>

                {/* Images (Dual Mode: URL + File Upload) */}
                <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-slate-600" />
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Variant Images</h2>
                                <p className="text-xs text-slate-500">Add direct image URL or upload image file from your device</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-xs"
                            >
                                <Upload className="mr-1.5 h-3.5 w-3.5" />
                                Upload File
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddImage}
                                className="rounded-xl border-slate-200 text-xs"
                            >
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Add URL
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {images.map((imgUrl, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                {imgUrl.trim() ? (
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                        <img
                                            src={imgUrl}
                                            alt={`Preview ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/product-placeholder.jpg";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                )}
                                <Input
                                    value={imgUrl}
                                    onChange={(e) => {
                                        const updated = [...images];
                                        updated[idx] = e.target.value;
                                        setImages(updated);
                                    }}
                                    placeholder="Enter image URL (https://... or /image.png or upload above)"
                                    className="h-11 flex-1 rounded-xl bg-slate-50 text-sm font-mono text-xs"
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
                    <Link href={`/admin/products/${productId}/variants/${variant.id}`}>
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
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
