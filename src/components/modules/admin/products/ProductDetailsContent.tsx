"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit, Plus, Package, Boxes, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { AdminProductDetail } from "@/lib/types/admin.types";

interface ProductDetailsContentProps {
    product: AdminProductDetail;
}

export default function ProductDetailsContent({ product }: ProductDetailsContentProps) {
    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div>
                <Link
                    href="/admin/products"
                    className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            {product.name}
                        </h1>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                            {product.brand?.name ?? "No brand"} ·{" "}
                            {product.category?.name ?? "No category"}
                        </p>

                        <div className="mt-3 flex gap-2">
                            <Badge variant={product.isPublished ? "success" : "outline"}>
                                {product.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant={product.isActive ? "success" : "outline"}>
                                {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    <Link href={`/admin/products/${product.id}/edit`}>
                        <Button className="h-11 rounded-xl shadow-lg shadow-blue-500/20">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Basic Info */}
            <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-foreground">
                    Basic Information
                </h2>

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                        <span className="text-muted-foreground">Warranty:</span>{" "}
                        <span className="font-semibold text-foreground">
                            {product.warrantyMonths} months
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Variants:</span>{" "}
                        <span className="font-semibold text-foreground">
                            {product.variants.length}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Total Stock:</span>{" "}
                        <span className="font-semibold text-foreground">
                            {product.variants.reduce((s, v) => s + v.stockQuantity, 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Slug:</span>{" "}
                        <span className="font-mono text-xs text-foreground/80">
                            {product.slug}
                        </span>
                    </div>

                    {product.warrantyTerms && (
                        <div className="sm:col-span-2">
                            <span className="text-muted-foreground">Warranty Terms:</span>{" "}
                            <span className="text-foreground/90">{product.warrantyTerms}</span>
                        </div>
                    )}

                    {product.description && (
                        <div className="sm:col-span-2">
                            <span className="text-muted-foreground">Description:</span>{" "}
                            <p className="mt-1 text-foreground/90">{product.description}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Variants */}
            <Card className="rounded-2xl border border-border/60 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
                <div className="flex items-center justify-between border-b border-border/60 p-6 sm:p-8">
                    <div className="flex items-center gap-2">
                        <Boxes className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-bold text-foreground">
                            Variants ({product.variants.length})
                        </h2>
                    </div>
                    <Link href={`/admin/products/${product.id}/variants/new`}>
                        <Button size="sm" className="rounded-xl shadow-md shadow-blue-500/10">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add Variant
                        </Button>
                    </Link>
                </div>

                <div className="space-y-3 p-4 sm:p-6">
                    {product.variants.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No variants yet.
                        </p>
                    )}

                    {product.variants.map((v) => (
                        <Link
                            key={v.id}
                            href={`/admin/products/${product.id}/variants/${v.id}`}
                            className="group block"
                        >
                            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 transition-all group-hover:border-blue-500/30 group-hover:bg-blue-500/5 sm:flex-row sm:items-center sm:justify-between">
                                {/* Left: image + name + attributes */}
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-card border border-border">
                                        {v.images[0] ? (
                                             <Image
                                                src={v.images[0]}
                                                alt={v.sku}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <Package className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        {/* Variant name — attributes theke */}
                                        <p className="font-semibold text-foreground truncate">
                                            {Object.entries(v.attributes)
                                                .slice(0, 2)
                                                .map(([, val]) => String(val))
                                                .join(" · ") || "Default Variant"}
                                        </p>

                                        {/* All attributes small */}
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                            {Object.entries(v.attributes)
                                                .map(([k, val]) => `${k}: ${val}`)
                                                .join(" · ")}
                                        </p>

                                        <p className="mt-1 text-[11px] font-mono text-muted-foreground/70 truncate">
                                            {v.sku}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: price + stock + chevron */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-foreground">
                                            ৳{Number(v.price).toLocaleString()}
                                        </p>
                                        {v.comparePrice &&
                                            Number(v.comparePrice) > Number(v.price) && (
                                                <p className="text-xs text-muted-foreground line-through">
                                                    ৳{Number(v.comparePrice).toLocaleString()}
                                                </p>
                                            )}
                                    </div>

                                    <Badge
                                        variant={v.stockQuantity > 0 ? "success" : "outline"}
                                        className="min-w-[80px] justify-center"
                                    >
                                        {v.stockQuantity} in stock
                                    </Badge>

                                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>
        </div>
    );
}
