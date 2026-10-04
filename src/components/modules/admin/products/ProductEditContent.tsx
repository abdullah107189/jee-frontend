"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Save, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import type {
    CategoryFlat,
    BrandOption,
    AdminProductDetail,
} from "@/lib/types/admin.types";
import { updateProductAction } from "@/actions/product.action";

/* ─────────── helpers ─────────── */
const slugify = (s: string) =>
    s.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

/* ─────────── main ─────────── */
export default function ProductEditContent({
    product,
    categories,
    brands,
}: {
    product: AdminProductDetail;
    categories: CategoryFlat[];
    brands: BrandOption[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    /* basic */
    const [name, setName] = useState(product.name);
    const [slug, setSlug] = useState(product.slug);
    const [description, setDescription] = useState(product.description ?? "");
    const [categoryId, setCategoryId] = useState(product.categoryId);
    const [brandId, setBrandId] = useState(product.brandId ?? "");

    /* specs */
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
        product.specifications
            ? Object.entries(product.specifications).map(([key, value]) => ({
                key,
                value: String(value),
            }))
            : [{ key: "", value: "" }],
    );

    /* warranty */
    const [warrantyMonths, setWarrantyMonths] = useState(
        String(product.warrantyMonths),
    );
    const [warrantyTerms, setWarrantyTerms] = useState(product.warrantyTerms ?? "");

    /* status */
    const [isPublished, setIsPublished] = useState(product.isPublished);
    const [isActive, setIsActive] = useState(product.isActive);

    /* variants — read-only currently (variant edit pore) */
    const variantCount = product.variants.length;

    /* submit */
    const handleSubmit = () => {
        if (!name.trim()) return toast.error("Name required");
        if (!categoryId) return toast.error("Category required");

        const payload = {
            name: name.trim(),
            slug: slug.trim() || slugify(name),
            description: description.trim() || undefined,
            specifications: Object.fromEntries(
                specs.filter((s) => s.key && s.value).map((s) => [s.key, s.value]),
            ),
            warrantyMonths: Number(warrantyMonths) || 0,
            warrantyTerms: warrantyTerms.trim() || undefined,
            categoryId,
            brandId: brandId || undefined,
            isPublished,
            isActive,
        };

        startTransition(async () => {
            const res = await updateProductAction(product.id, payload);
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
                    className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Product
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
                            Edit Product
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Update product info. Variant edit separate page e.
                        </p>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="h-11 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Basic Info */}
            <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="mb-4 text-lg font-bold text-slate-800">Basic Info</h2>

                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Name *</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl bg-slate-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Slug</label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="h-11 rounded-xl bg-slate-50 font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Category *</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {"— ".repeat(c.level)}
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Brand</label>
                            <select
                                value={brandId}
                                onChange={(e) => setBrandId(e.target.value)}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Specs */}
            <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Specifications</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSpecs([...specs, { key: "", value: "" }])}
                        className="rounded-xl"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>

                <div className="space-y-3">
                    {specs.map((s, i) => (
                        <div key={i} className="flex gap-3">
                            <Input
                                value={s.key}
                                onChange={(e) => {
                                    const next = [...specs];
                                    next[i].key = e.target.value;
                                    setSpecs(next);
                                }}
                                placeholder="Material"
                                className="h-11 flex-1 rounded-xl bg-slate-50"
                            />
                            <Input
                                value={s.value}
                                onChange={(e) => {
                                    const next = [...specs];
                                    next[i].value = e.target.value;
                                    setSpecs(next);
                                }}
                                placeholder="Plastic"
                                className="h-11 flex-1 rounded-xl bg-slate-50"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSpecs(specs.filter((_, x) => x !== i))}
                                disabled={specs.length === 1}
                                className="h-11 w-11 rounded-xl p-0 text-red-500 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Warranty */}
            <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="mb-4 text-lg font-bold text-slate-800">Warranty</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Months *</label>
                        <Input
                            type="number"
                            value={warrantyMonths}
                            onChange={(e) => setWarrantyMonths(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Terms</label>
                        <textarea
                            value={warrantyTerms}
                            onChange={(e) => setWarrantyTerms(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            </Card>

            {/* Variants (read-only) */}
            <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Variants ({variantCount})
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Variant edit korte product details page e jao.
                        </p>
                    </div>
                    <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            View Variants
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Status */}
            <Card className="rounded-2xl border-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="mb-4 text-lg font-bold text-slate-800">Status</h2>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="h-4 w-4"
                        />
                        Published
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4"
                        />
                        Active
                    </label>
                </div>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
                <Link href={`/admin/products/${product.id}`}>
                    <Button variant="outline" className="h-11 rounded-xl">
                        Cancel
                    </Button>
                </Link>
                <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="h-11 rounded-xl shadow-lg shadow-blue-500/20"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}