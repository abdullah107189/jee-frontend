"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Edit, Package, Plus, Search, Trash2, PackageOpen, Eye,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

import type { AdminProductListItem } from "@/lib/types/admin.types";
import { deleteProductAction } from "@/actions/product.action";

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

interface Props {
  products: AdminProductListItem[];
  meta: Meta;
  initialFilters: {
    search: string;
    status: string;
    active: string;
    stock: string;
    sort: string;
  };
}

export default function ProductsListContent({
  products,
  meta,
  initialFilters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialFilters.search);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  /* ─────── URL update ─────── */
  const updateURL = (
    updates: Record<string, string | undefined>,
    resetPage = true,
  ) => {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== "all") sp.set(key, value);
      else sp.delete(key);
    }
    if (resetPage) sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  };

  /* ─────── Search debounce ─────── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== initialFilters.search) {
        updateURL({ search: search || undefined });
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* ─────── Pagination ─────── */
  const goToPage = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(p));
    router.push(`${pathname}?${sp.toString()}`);
  };

  /* ─────── Delete ─────── */
  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    startTransition(async () => {
      const res = await deleteProductAction(itemToDelete.id);
      if (res.success) {
        toast.success(res.message);
        setDeleteModalOpen(false);
        setItemToDelete(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  /* ─────── Page numbers ─────── */
  const pageNumbers = () => {
    const total = meta.totalPages;
    const cur = meta.page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const set: (number | "…")[] = [1];
    if (cur > 3) set.push("…");
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++)
      set.push(i);
    if (cur < total - 2) set.push("…");
    set.push(total);
    return set;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage your product catalog and inventory.
            </p>
          </div>
        </div>
        <Link href="/admin/products/new">
          <Button className="h-10 rounded-xl px-4 shadow-lg shadow-blue-500/20 sm:h-12 sm:rounded-2xl">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Card */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 sm:p-6 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU, brand..."
              className="h-10 w-full rounded-xl border-transparent bg-slate-50 pl-10 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20 sm:h-12"
            />
          </div>

          {/* Status */}
          <select
            value={initialFilters.status}
            onChange={(e) => updateURL({ status: e.target.value })}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 sm:h-12"
          >
            <option value="all">All Publish</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Active */}
          <select
            value={initialFilters.active}
            onChange={(e) => updateURL({ active: e.target.value })}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 sm:h-12"
          >
            <option value="all">All Active</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Stock */}
          <select
            value={initialFilters.stock}
            onChange={(e) => updateURL({ stock: e.target.value })}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 sm:h-12"
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* Sort */}
          <select
            value={initialFilters.sort}
            onChange={(e) => updateURL({ sort: e.target.value })}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 sm:h-12"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>

          {/* Count */}
          <div className="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-500 sm:h-12">
            {meta.total} {meta.total === 1 ? "product" : "products"}
          </div>
        </div>

        {/* Empty */}
        {products.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <PackageOpen className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-slate-900">
                No products found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/80">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6">
                      Product
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6">
                      Category
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6">
                      Price
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6">
                      Stock
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-500 sm:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((product) => {
                    const stock = product.stockQuantity;
                    const stockStatus =
                      stock === 0
                        ? "Out of stock"
                        : stock <= 10
                          ? "Low stock"
                          : "In stock";
                    const stockColor =
                      stock === 0
                        ? "text-red-500"
                        : stock <= 10
                          ? "text-amber-500"
                          : "text-green-600";

                    return (
                      <tr
                        key={product.id}
                        className="bg-white hover:bg-slate-50/70"
                      >
                        {/* Product */}
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[260px] truncate font-semibold text-slate-900">
                                {product.name}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                {product.variantSku && (
                                  <span className="text-xs font-mono text-slate-400">
                                    {product.variantSku}
                                  </span>
                                )}
                                {product.variantCount > 1 && (
                                  <Badge
                                    variant="outline"
                                    className="rounded-full px-1.5 py-0 text-[10px]"
                                  >
                                    +{product.variantCount - 1} variants
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 sm:px-6">
                          <span className="font-medium text-slate-600">
                            {product.categoryName ?? "—"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">
                              ৳{Number(product.price).toLocaleString()}
                            </span>
                            {product.comparePrice !== null &&
                              Number(product.comparePrice) >
                              Number(product.price) && (
                                <span className="text-xs text-slate-400 line-through">
                                  ৳
                                  {Number(
                                    product.comparePrice,
                                  ).toLocaleString()}
                                </span>
                              )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className={`font-bold ${stockColor}`}>
                              {stock}
                            </span>
                            <span className="text-xs text-slate-400">
                              {stockStatus}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={
                                product.isPublished ? "success" : "outline"
                              }
                              className="w-fit gap-1 rounded-full px-2 py-0.5 text-[10px]"
                            >
                              {product.isPublished ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {product.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Badge
                              variant={
                                product.isActive ? "success" : "outline"
                              }
                              className="w-fit gap-1 rounded-full px-2 py-0.5 text-[10px]"
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 sm:px-6">
                          <span className="text-xs text-slate-500">
                            {new Date(product.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right sm:px-6">
                          <div className="flex justify-end gap-1">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Details</span>
                              </Button>
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:bg-slate-100 sm:h-10 sm:w-10"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 rounded-xl p-0 text-red-400 hover:bg-red-50 hover:text-red-600 sm:h-10 sm:w-10"
                              disabled={isPending}
                              onClick={() =>
                                handleDeleteClick(product.id, product.name)
                              }
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:flex-row sm:px-6">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Page <span className="font-semibold">{meta.page}</span> of{" "}
                  <span className="font-semibold">{meta.totalPages}</span> (
                  {meta.total} items)
                </p>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.hasPrevPage || isPending}
                    onClick={() => goToPage(meta.page - 1)}
                    className="gap-1 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {pageNumbers().map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`e-${i}`}
                          className="px-1 text-slate-400"
                        >
                          …
                        </span>
                      ) : (
                        <Button
                          key={p}
                          variant={p === meta.page ? "default" : "outline"}
                          size="sm"
                          disabled={isPending}
                          onClick={() => goToPage(p as number)}
                          className="h-8 w-8 rounded-lg p-0 sm:h-9 sm:w-9"
                        >
                          {p}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.hasNextPage || isPending}
                    onClick={() => goToPage(meta.page + 1)}
                    className="gap-1 rounded-lg"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        itemName={itemToDelete?.name}
      />
    </div>
  );
}