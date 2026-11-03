"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Upload,
    Layers,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addVariantAction } from "@/actions/product.action";

interface VariantAddContentProps {
    product: {
        id: string;
        name: string;
        slug: string;
    };
}

export default function VariantAddContent({ product }: VariantAddContentProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    /* Form states */
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [comparePrice, setComparePrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("0");
    const [lowStockThreshold, setLowStockThreshold] = useState("5");
    const [isActive, setIsActive] = useState(true);

    /* Dynamic Attributes: array of { key, value } */
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
        { key: "Color", value: "" },
    ]);

    /* Image URLs: array of strings */
    const [images, setImages] = useState<string[]>([""]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* Attribute handlers */
    const handleAddAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const handleRemoveAttribute = (index: number) => {
        if (attributes.length === 1) {
            toast.error("At least one attribute is required");
            return;
        }
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    /* Image handlers */
    const handleAddImage = () => {
        setImages([...images, ""]);
    };

    const handleRemoveImage = (index: number) => {
        if (images.length === 1) {
            setImages([""]);
            return;
        }
        setImages(images.filter((_, i) => i !== index));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImages((prev) => {
                        const filtered = prev.filter((img) => img.trim() !== "");
                        return [...filtered, reader.result as string];
                    });
                }
            };
            reader.readAsDataURL(file);
        });
        toast.success(`Loaded ${files.length} image(s) for preview.`);
    };

    /* Submit form */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!price || Number(price) < 0) {
            return toast.error("Please enter a valid price");
        }

        const validAttrs: Record<string, string> = {};
        for (const attr of attributes) {
            const k = attr.key.trim();
            const v = attr.value.trim();
            if (k && v) {
                validAttrs[k] = v;
            }
        }

        if (Object.keys(validAttrs).length === 0) {
            return toast.error("Please add at least one attribute key & value (e.g. Color: Black)");
        }

        const validImages = images.map((img) => img.trim()).filter((img) => img.length > 0);

        const payload = {
            sku: sku.trim() || undefined,
            price: Number(price),
            comparePrice: comparePrice ? Number(comparePrice) : undefined,
            stockQuantity: Number(stockQuantity) || 0,
            lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined,
            attributes: validAttrs,
            images: validImages,
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
            {/* Header */}
            <div>
                <Link
                    href={`/admin/products/${product.id}`}
                    className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Product Details
                </Link>

                <div className="flex flex-col gap-2">
                    <h1 className="page-header-title">
                        Add Product Variant
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Adding variant for product:{" "}
                        <span className="font-semibold text-foreground/90">{product.name}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Variant Identity & Status */}
                <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-6 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-foreground">Variant Identity</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/90">
                                SKU (Auto-generated if blank)
                            </label>
                            <Input
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="E.g., PROD-BLK-01"
                                className="h-11 rounded-xl font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/90">
                                Variant Status
                            </label>
                            <div className="flex h-11 items-center gap-3 rounded-xl border border-border bg-muted/30 px-4">
                                <input
                                    type="checkbox"
                                    id="isActiveToggle"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                                />
                                <label
                                    htmlFor="isActiveToggle"
                                    className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                    Active for sale immediately
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Attributes */}
                <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Attributes *</h2>
                            <p className="text-xs text-muted-foreground">
                                Define options like Color, Storage, Size (at least one is required).
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddAttribute}
                            className="rounded-xl border-border"
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
                                    className="h-11 flex-1 rounded-xl text-sm"
                                />
                                <Input
                                    value={attr.value}
                                    onChange={(e) => {
                                        const updated = [...attributes];
                                        updated[idx].value = e.target.value;
                                        setAttributes(updated);
                                    }}
                                    placeholder="Value (e.g. Matte Black)"
                                    className="h-11 flex-1 rounded-xl text-sm"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveAttribute(idx)}
                                    disabled={attributes.length === 1}
                                    className="h-11 w-11 rounded-xl p-0 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 disabled:opacity-30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Pricing & Stock */}
                <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <h2 className="mb-4 text-lg font-bold text-foreground">Pricing & Inventory</h2>
                    <div className="grid gap-4 sm:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/90">
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
                                className="h-11 rounded-xl tabular-nums text-sm font-bold text-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/90">
                                Compare Price (৳)
                            </label>
                            <Input
                                type="number"
                                min="0"
                                step="any"
                                value={comparePrice}
                                onChange={(e) => setComparePrice(e.target.value)}
                                placeholder="0"
                                className="h-11 rounded-xl tabular-nums text-sm text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/90">
                                Initial Stock
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                placeholder="0"
                                className="h-11 rounded-xl tabular-nums text-sm font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground/90">
                                Low Stock Alert
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={lowStockThreshold}
                                onChange={(e) => setLowStockThreshold(e.target.value)}
                                placeholder="5"
                                className="h-11 rounded-xl tabular-nums text-sm"
                            />
                        </div>
                    </div>
                </Card>

                {/* Images (Dual mode: Upload + URL) */}
                <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Variant Images</h2>
                                <p className="text-xs text-muted-foreground">Paste direct image link or upload an image file</p>
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
                                className="rounded-xl border-border hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 text-xs"
                            >
                                <Upload className="mr-1.5 h-3.5 w-3.5" />
                                Upload File
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddImage}
                                className="rounded-xl border-border text-xs"
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
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
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
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
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
                                    className="h-11 flex-1 rounded-xl text-sm font-mono text-xs"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="h-11 w-11 rounded-xl p-0 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500"
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
                            className="h-11 rounded-xl px-6 border-border"
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
