"use client";

import React, { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
  PackageOpen,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

import type { AdminProductListItem } from "@/lib/types/admin.types";
import { deleteProductAction } from "@/actions/product.action";

interface AdminProductsPageProps {
  products: AdminProductListItem[];
}

export default function AdminProductsPage({
  products,
}: AdminProductsPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.variantSku?.toLowerCase().includes(query) ||
        product.brandName?.toLowerCase().includes(query) ||
        product.categoryName?.toLowerCase().includes(query);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stockQuantity > 0) ||
        (stockFilter === "low-stock" &&
          product.stockQuantity > 0 &&
          product.stockQuantity <= 10) ||
        (stockFilter === "out-of-stock" && product.stockQuantity === 0);

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Products
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
                Manage your product catalog and inventory.
              </p>
            </div>
          </div>
        </div>

        <Link href="/admin/products/new">
          <Button className="h-10 w-full rounded-xl px-4 shadow-lg shadow-blue-500/20 sm:h-12 sm:w-auto sm:rounded-2xl">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Products Card */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-4 sm:p-6 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU, brand..."
              className="h-10 w-full rounded-xl border-transparent bg-slate-50 pl-10 transition-all focus:border-blue-500 focus:bg-white focus:ring-blue-500/20 sm:h-12"
            />
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-12"
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <div className="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-500 sm:h-12">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <PackageOpen className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-slate-900">
                {search || stockFilter !== "all"
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {search || stockFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Create your first product to get started."}
              </p>
              {!search && stockFilter === "all" && (
                <Link href="/admin/products/new">
                  <Button className="mt-4 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Product
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Category
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Price
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Stock
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Brand
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => {
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
                      key={`${product.id}-${product.variantId}`}
                      className="bg-white transition-colors hover:bg-slate-50/70"
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
                            {product.variantSku && (
                              <p className="mt-0.5 text-xs font-mono text-slate-400">
                                SKU: {product.variantSku}
                              </p>
                            )}
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
                            Number(product.comparePrice) > Number(product.price) && (
                              <span className="text-xs text-slate-400 line-through">
                                ৳{Number(product.comparePrice).toLocaleString()}
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

                      {/* Brand */}
                      <td className="px-4 py-4 sm:px-6">
                        <span className="font-medium text-slate-600">
                          {product.brandName ?? "—"}
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
                              className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:h-10 sm:w-10"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl p-0 text-red-400 hover:bg-red-50 hover:text-red-600 sm:h-10 sm:w-10"
                            title="Delete Product"
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