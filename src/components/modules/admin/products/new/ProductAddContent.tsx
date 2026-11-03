"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Save, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import type { CategoryFlat, BrandOption } from "@/lib/types/admin.types";
import { createProductAction } from "@/actions/product.action";

/* ─────────── helpers ─────────── */
const emptyVariant = () => ({
  id: crypto.randomUUID(),
  attributes: [{ key: "", value: "" }],
  price: "",
  comparePrice: "",
  stockQuantity: "",
  lowStockThreshold: "",
  images: [""],
});

/* ─────────── main ─────────── */
export default function ProductAddContent({
  categories,
  brands,
}: {
  categories: CategoryFlat[];
  brands: BrandOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /* basic */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  /* specs */
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  /* warranty */
  const [warrantyMonths, setWarrantyMonths] = useState("12");
  const [warrantyTerms, setWarrantyTerms] = useState("");

  /* status */
  const [isPublished, setIsPublished] = useState(true);
  const [isActive, setIsActive] = useState(true);

  /* variants */
  const [variants, setVariants] = useState([emptyVariant()]);

  /* ─────────── submit ─────────── */
  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Name required");
    if (!categoryId) return toast.error("Category required");
    if (variants.length === 0) return toast.error("At least 1 variant required");

    /* validate variants */
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.price) return toast.error(`Variant ${i + 1}: price required`);
      if (!v.stockQuantity && v.stockQuantity !== "0")
        return toast.error(`Variant ${i + 1}: stock required`);

      const attrs = v.attributes.filter((a) => a.key && a.value);
      if (attrs.length === 0)
        return toast.error(`Variant ${i + 1}: at least 1 attribute required`);
    }

    /* build payload */
    const payload = {
      name: name.trim(),
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
      variants: variants.map((v) => ({
        attributes: Object.fromEntries(
          v.attributes.filter((a) => a.key && a.value).map((a) => [a.key, a.value]),
        ),
        price: Number(v.price),
        comparePrice: v.comparePrice ? Number(v.comparePrice) : undefined,
        images: v.images.filter((i) => i.trim()),
        stockQuantity: Number(v.stockQuantity),
        lowStockThreshold: v.lowStockThreshold
          ? Number(v.lowStockThreshold)
          : undefined,
        isActive: true,
      })),
    };

    startTransition(async () => {
      const res = await createProductAction(payload);
      if (res.success) {
        toast.success(res.message);
        router.push("/admin/products");
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
          href="/admin/products"
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Add New Product
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create product with at least 1 variant (SKU auto-generated).
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="h-11 rounded-xl shadow-lg shadow-blue-500/20"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">Basic Info</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground/90">
              Product Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JEE Solar Inverter Pro"
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground/90">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detailed product features, use cases..."
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-foreground/90">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500"
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

            <div>
              <label className="text-sm font-semibold text-foreground/90">Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand (optional)</option>
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

      {/* Specifications */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Specifications</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="rounded-xl border-border"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Spec
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
                placeholder="Key (e.g. Material)"
                className="h-11 flex-1 rounded-xl"
              />
              <Input
                value={s.value}
                onChange={(e) => {
                  const next = [...specs];
                  next[i].value = e.target.value;
                  setSpecs(next);
                }}
                placeholder="Value (e.g. Aluminum)"
                className="h-11 flex-1 rounded-xl"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSpecs(specs.filter((_, x) => x !== i))}
                disabled={specs.length === 1}
                className="h-11 w-11 rounded-xl p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Warranty */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">Warranty</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground/90">
              Warranty Months *
            </label>
            <Input
              type="number"
              value={warrantyMonths}
              onChange={(e) => setWarrantyMonths(e.target.value)}
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground/90">
              Warranty Terms
            </label>
            <textarea
              value={warrantyTerms}
              onChange={(e) => setWarrantyTerms(e.target.value)}
              rows={2}
              placeholder="e.g. Covers manufacturing defects for 12 months..."
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </Card>

      {/* Variants */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Variants ({variants.length})
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Each variant is a distinct selling unit with its own price, stock, and attributes.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setVariants([...variants, emptyVariant()])}
            className="rounded-xl border-border"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Variant
          </Button>
        </div>

        <div className="space-y-6">
          {variants.map((v, vi) => (
            <div
              key={v.id}
              className="rounded-2xl border border-border/60 bg-muted/30 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">
                  Variant {vi + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setVariants(variants.filter((_, i) => i !== vi))
                  }
                  disabled={variants.length === 1}
                  className="h-8 w-8 rounded-xl p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Attributes */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Attributes *
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = [...variants];
                      next[vi].attributes.push({ key: "", value: "" });
                      setVariants(next);
                    }}
                    className="h-7 rounded-lg text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {v.attributes.map((a, ai) => (
                    <div key={ai} className="flex gap-2">
                      <Input
                        value={a.key}
                        onChange={(e) => {
                          const next = [...variants];
                          next[vi].attributes[ai].key = e.target.value;
                          setVariants(next);
                        }}
                        placeholder="color"
                        className="h-10 flex-1 rounded-lg text-sm"
                      />
                      <Input
                        value={a.value}
                        onChange={(e) => {
                          const next = [...variants];
                          next[vi].attributes[ai].value = e.target.value;
                          setVariants(next);
                        }}
                        placeholder="White"
                        className="h-10 flex-1 rounded-lg text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const next = [...variants];
                          next[vi].attributes = next[vi].attributes.filter(
                            (_, i) => i !== ai,
                          );
                          setVariants(next);
                        }}
                        disabled={v.attributes.length === 1}
                        className="h-10 w-10 rounded-lg p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing + stock */}
              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Price *
                  </label>
                  <Input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const next = [...variants];
                      next[vi].price = e.target.value;
                      setVariants(next);
                    }}
                    placeholder="72000"
                    className="mt-1 h-10 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Compare Price
                  </label>
                  <Input
                    type="number"
                    value={v.comparePrice}
                    onChange={(e) => {
                      const next = [...variants];
                      next[vi].comparePrice = e.target.value;
                      setVariants(next);
                    }}
                    placeholder="79000"
                    className="mt-1 h-10 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Stock *
                  </label>
                  <Input
                    type="number"
                    value={v.stockQuantity}
                    onChange={(e) => {
                      const next = [...variants];
                      next[vi].stockQuantity = e.target.value;
                      setVariants(next);
                    }}
                    placeholder="2"
                    className="mt-1 h-10 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Low threshold
                  </label>
                  <Input
                    type="number"
                    value={v.lowStockThreshold}
                    onChange={(e) => {
                      const next = [...variants];
                      next[vi].lowStockThreshold = e.target.value;
                      setVariants(next);
                    }}
                    placeholder="5"
                    className="mt-1 h-10 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Image URLs
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const next = [...variants];
                      next[vi] = {
                        ...next[vi],
                        images: [...next[vi].images, ""],
                      };
                      setVariants(next);
                    }}
                    className="h-7 rounded-lg px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {v.images.map((img, ii) => (
                    <div key={ii} className="flex gap-2">
                      <Input
                        value={img}
                        onChange={(e) => {
                          const next = [...variants];
                          next[vi].images[ii] = e.target.value;
                          setVariants(next);
                        }}
                        placeholder="https://picsum.photos/..."
                        className="h-10 flex-1 rounded-lg text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const next = [...variants];
                          next[vi].images = next[vi].images.filter(
                            (_, i) => i !== ii,
                          );
                          setVariants(next);
                        }}
                        disabled={v.images.length === 1}
                        className="h-10 w-10 rounded-lg p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Status */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-foreground">Status</h2>
        <div className="flex gap-6 text-foreground">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            Active
          </label>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Link href="/admin/products">
          <Button variant="outline" className="h-11 rounded-xl border-border">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="h-11 rounded-xl shadow-lg shadow-blue-500/20"
        >
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
