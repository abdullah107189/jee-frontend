"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Loader2,
} from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { toast } from "sonner";
import type { BrandsResponse } from "@/services/brand.service";

interface AdminBrandsPageProps {
  brands: BrandsResponse;
}

export default function AdminBrandsPage({
  brands,
}: AdminBrandsPageProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [search, setSearch] = useState("");

  const brandList = brands.data ?? [];

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return brandList;
    }

    return brandList.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.slug.toLowerCase().includes(query),
    );
  }, [brandList, search]);

  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    // TODO: Connect delete API here.
    toast.success(
      `Brand "${itemToDelete.name}" deleted successfully.`,
    );

    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Tag className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Brands
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
                Manage product brands and their details.
              </p>
            </div>
          </div>
        </div>

        <Button className="h-10 rounded-xl px-4 shadow-lg shadow-blue-500/20 sm:h-12 sm:rounded-2xl">
          <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Add Brand
        </Button>
      </div>

      {/* Error State */}
      {!brands.success && (
        <Card className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">
            {brands.message || "Failed to load brands."}
          </p>
        </Card>
      )}

      {/* Main Card */}
      <Card className="overflow-hidden rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem]">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              className="h-10 w-full rounded-xl border-transparent bg-slate-50 pl-10 transition-all focus:border-blue-500 focus:bg-white focus:ring-blue-500/20 sm:h-12"
            />
          </div>

          <div className="text-sm font-medium text-slate-500">
            {filteredBrands.length}{" "}
            {filteredBrands.length === 1 ? "brand" : "brands"}
          </div>
        </div>

        {/* Loading / Empty / Table */}
        {!brands.success && brandList.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Loader2 className="h-5 w-5" />
              </div>

              <p className="font-semibold text-slate-800">
                Unable to load brands
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {brands.message || "Please try again later."}
              </p>
            </div>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Tag className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-slate-900">
                {search ? "No brands found" : "No brands yet"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try searching with a different keyword."
                  : "Create your first brand to get started."}
              </p>

              {!search && (
                <Button className="mt-4 rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Brand
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Brand Name
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Slug
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-500 sm:px-6 sm:py-5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredBrands.map((brand) => {
                  const initials = brand.name
                    .trim()
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={brand.id}
                      className="bg-white transition-colors hover:bg-slate-50/70"
                    >
                      {/* Brand */}
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600 sm:h-10 sm:w-10">
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {brand.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              Brand
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-4 py-4 sm:px-6">
                        <code className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-500">
                          {brand.slug}
                        </code>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 sm:px-6">
                        <Badge
                          variant="success"
                          className="rounded-full px-3 py-1 text-xs"
                        >
                          Active
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right sm:px-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:h-10 sm:w-10"
                            title="Edit brand"
                          >
                            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-xl p-0 text-red-400 hover:bg-red-50 hover:text-red-600 sm:h-10 sm:w-10"
                            title="Delete brand"
                            onClick={() =>
                              handleDeleteClick(
                                brand.id,
                                brand.name,
                              )
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
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
        itemName={itemToDelete?.name}
      />
    </div>
  );
}
